import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.crud import crud_user
from app.models.domain import School, Class, Exam, Submission, SubmissionStatus, Student, Result
from app.models.user import User
from app.schemas.endpoints import AIWebhookPayload
from app.services.gcs import upload_file_to_gcs
import uuid

router = APIRouter()

# Setup local storage directory for development
UPLOAD_DIR = "local_storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/ingest")
async def ingest_data(
    class_id: str = Form(...),
    subject_id: int = Form(...),
    exam_type_id: int = Form(...),
    term: int = Form(...),
    year: int = Form(...),
    exam_name: str = Form(...),
    school: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Ingest endpoint for the Data Entry App.
    Expects Bearer token authentication.
    """
    
    # 1. Validate School
    result = await db.execute(select(School).filter(School.id == school))
    school_obj = result.scalars().first()
    if not school_obj:
        raise HTTPException(status_code=400, detail="School not found")

    # 2. Validate Class
    result = await db.execute(select(Class).filter(Class.id == class_id, Class.school_id == school_obj.id))
    cls = result.scalars().first()
    if not cls:
        raise HTTPException(status_code=400, detail="Class not found for the given school")

    # 3. Find or Create Exam
    result = await db.execute(select(Exam).filter(
        Exam.name == exam_name, 
        Exam.class_id == cls.id,
        Exam.subject_id == subject_id,
        Exam.exam_type_id == exam_type_id,
        Exam.term == term,
        Exam.year == year
    ))
    exam = result.scalars().first()
    if not exam:
        exam = Exam(
            name=exam_name, 
            class_id=cls.id,
            subject_id=subject_id,
            exam_type_id=exam_type_id,
            term=term,
            year=year
        )
        db.add(exam)
        await db.commit()
        await db.refresh(exam)

    # 4. Upload File to GCS
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    destination_blob_name = f"uploads/{school_obj.id}/{cls.id}/{unique_filename}"
    
    try:
        gcs_url = upload_file_to_gcs(file, destination_blob_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file to GCS: {str(e)}")
        
    # 5. Create Submission
    submission = Submission(exam_id=exam.id, file_url=gcs_url, status=SubmissionStatus.PENDING)
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    
    # TODO: In production, trigger an async task to notify the AI to process this file
    
    return {"message": "Upload successful", "submission_id": submission.id}

@router.post("/ai/webhook")
async def ai_webhook(
    payload: AIWebhookPayload,
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Webhook for the AI service to submit results.
    """
    result = await db.execute(select(Submission).filter(Submission.id == payload.submission_id))
    submission = result.scalars().first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Get the Exam and Class to associate students
    result = await db.execute(select(Exam).filter(Exam.id == submission.exam_id))
    exam = result.scalars().first()
    
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
        
    result = await db.execute(select(Class).filter(Class.id == exam.class_id))
    cls = result.scalars().first()
    
    # Process students and results
    for student_data in payload.students:
        # Find or create student by name (in real app, might need better unique identifier)
        result = await db.execute(select(Student).filter(Student.name == student_data.name, Student.class_id == cls.id))
        student = result.scalars().first()
        
        if not student:
            student = Student(name=student_data.name, class_id=cls.id, school_id=cls.school_id)
            db.add(student)
            await db.commit()
            await db.refresh(student)
            
        # Create Result
        exam_result = Result(
            student_id=student.id,
            exam_id=exam.id,
            score=student_data.score,
            ai_analysis_json=student_data.analysis
        )
        db.add(exam_result)
        
    submission.status = SubmissionStatus.COMPLETED
    await db.commit()
    
    return {"message": "Results processed successfully"}

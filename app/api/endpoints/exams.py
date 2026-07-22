import hashlib
import os
import shutil
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.api import deps
from app.models.domain import School, Class, Exam, ExamStatus, Submission, SubmissionStatus
from app.models.user import User
from app.schemas.endpoints import (
    ExamSessionResponse,
    ExamUploadResponse,
    ExamSealResponse,
    ExamDetailResponse
)
from app.services.gcs import upload_file_to_gcs

router = APIRouter()

UPLOAD_DIR = "local_storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/session", response_model=ExamSessionResponse)
async def create_exam_session(
    class_stream: Optional[str] = Form(None),
    class_id: Optional[str] = Form(None),
    subject_id: int = Form(...),
    exam_type_id: int = Form(...),
    term: int = Form(...),
    year: int = Form(...),
    name: Optional[str] = Form(None),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Open/Create an exam session.
    Accepts class_stream (e.g. "S.4 East") or class_id.
    Returns exam_id (unique key), status ('OPEN'), and class_stream.
    """
    target_input = class_stream or class_id
    if not target_input:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'class_stream' or 'class_id' parameter must be provided"
        )

    # 1. Flexible Class lookup (by ID, Level, or Level + Stream)
    result = await db.execute(
        select(Class).filter(
            (Class.id == target_input) |
            (Class.level == target_input) |
            ((Class.level + " " + Class.stream) == target_input)
        )
    )
    cls = result.scalars().first()

    # If not found and contains space (e.g., "S.4 East"), try matching level & stream
    if not cls and " " in target_input:
        parts = target_input.split(" ", 1)
        res = await db.execute(
            select(Class).filter(Class.level == parts[0], Class.stream == parts[1])
        )
        cls = res.scalars().first()

    # If class record does not exist yet, auto-create it using caller's school
    if not cls:
        target_school_id = current_user.school_id if current_user and current_user.school_id else None
        if not target_school_id:
            s_res = await db.execute(select(School))
            first_school = s_res.scalars().first()
            if first_school:
                target_school_id = first_school.id
            else:
                # Create default school if none exists
                default_school = School(name="Default School")
                db.add(default_school)
                await db.commit()
                await db.refresh(default_school)
                target_school_id = default_school.id

        parts = target_input.split(" ", 1) if " " in target_input else [target_input, None]
        cls = Class(
            level=parts[0],
            stream=parts[1] if parts[1] else None,
            school_id=target_school_id
        )
        db.add(cls)
        await db.commit()
        await db.refresh(cls)

    # 2. Create a new unique Exam session using valid class UUID
    session_name = name or f"Exam_{cls.class_stream}_Subj{subject_id}_T{term}_{year}"
    exam = Exam(
        name=session_name,
        class_id=cls.id,
        subject_id=subject_id,
        exam_type_id=exam_type_id,
        term=term,
        year=year,
        status=ExamStatus.OPEN
    )
    db.add(exam)
    await db.commit()
    await db.refresh(exam)

    return ExamSessionResponse(
        exam_id=exam.id,
        status=exam.status.value,
        name=exam.name,
        class_stream=cls.class_stream,
        class_id=exam.class_id,
        subject_id=exam.subject_id,
        exam_type_id=exam.exam_type_id,
        term=exam.term,
        year=exam.year
    )


@router.post("/{exam_id}/upload", response_model=ExamUploadResponse)
@router.post("/upload", response_model=ExamUploadResponse)
async def upload_paper(
    exam_id: Optional[str] = None,
    exam_id_form: Optional[str] = Form(None, alias="exam_id"),
    file: Optional[UploadFile] = File(None),
    paper: Optional[UploadFile] = File(None),
    pdf: Optional[UploadFile] = File(None),
    document: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Upload a single student paper PDF into the specified exam_id bucket folder.
    Supports exam_id in path or in multipart form data.
    Accepts file, paper, pdf, or document as the file form field name.
    Verifies that the session is still OPEN.
    """
    target_exam_id = exam_id or exam_id_form
    if not target_exam_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="exam_id is required either in path or form body"
        )

    target_file = file or paper or pdf or document
    if not target_file:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="PDF file is required in multipart/form-data under key 'file', 'paper', 'pdf', or 'document'"
        )

    # 1. Fetch Exam
    result = await db.execute(select(Exam).filter(Exam.id == target_exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exam session with id '{target_exam_id}' not found"
        )

    # 2. Check if Exam is SEALED
    if exam.status == ExamStatus.SEALED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This exam session is SEALED. No further paper uploads are allowed."
        )

    # 3. Calculate file content SHA-256 hash for deduplication
    content = await target_file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    target_file.file.seek(0)

    # Check if this exact paper was already uploaded into this exam_id
    existing_sub_res = await db.execute(
        select(Submission).filter(
            Submission.exam_id == exam.id,
            Submission.file_hash == file_hash
        )
    )
    existing_sub = existing_sub_res.scalars().first()
    if existing_sub:
        return ExamUploadResponse(
            exam_id=exam.id,
            file_url=existing_sub.file_url
        )

    # 4. Upload File to Storage (GCS with local fallback)
    file_ext = target_file.filename.split(".")[-1] if "." in (target_file.filename or "") else "pdf"
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    destination_blob_name = f"exams/{exam.id}/{unique_filename}"

    file_url = None
    try:
        file_url = upload_file_to_gcs(target_file, destination_blob_name)
    except Exception:
        # Fallback to local storage
        local_path = os.path.join(UPLOAD_DIR, "exams", exam.id)
        os.makedirs(local_path, exist_ok=True)
        file_location = os.path.join(local_path, unique_filename)
        target_file.file.seek(0)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(target_file.file, buffer)
        file_url = f"/local_storage/exams/{exam.id}/{unique_filename}"

    # 5. Create Submission
    submission = Submission(
        exam_id=exam.id,
        file_url=file_url,
        file_hash=file_hash,
        status=SubmissionStatus.PENDING
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)

    return ExamUploadResponse(
        exam_id=exam.id,
        file_url=file_url
    )


@router.post("/{exam_id}/seal", response_model=ExamSealResponse)
async def seal_exam_session(
    exam_id: str,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Seal the exam session once all student papers have been scanned & uploaded.
    Prevents any future uploads for this exam_id.
    """
    # 1. Fetch Exam
    result = await db.execute(select(Exam).filter(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exam session with id '{exam_id}' not found"
        )

    # 2. Update status to SEALED
    exam.status = ExamStatus.SEALED
    await db.commit()

    # 3. Get total submission count
    res = await db.execute(
        select(func.count(Submission.id)).filter(Submission.exam_id == exam.id)
    )
    total_submissions = res.scalar() or 0

    return ExamSealResponse(
        message="Exam session successfully sealed. No further uploads will be accepted.",
        exam_id=exam.id,
        status=exam.status.value,
        total_submissions=total_submissions
    )


@router.get("/{exam_id}", response_model=ExamDetailResponse)
async def get_exam_session_details(
    exam_id: str,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get exam session status and current paper count.
    """
    result = await db.execute(select(Exam).filter(Exam.id == exam_id))
    exam = result.scalars().first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exam session with id '{exam_id}' not found"
        )

    class_res = await db.execute(select(Class).filter(Class.id == exam.class_id))
    cls = class_res.scalars().first()

    res = await db.execute(
        select(func.count(Submission.id)).filter(Submission.exam_id == exam.id)
    )
    total_submissions = res.scalar() or 0

    return ExamDetailResponse(
        exam_id=exam.id,
        status=exam.status.value,
        name=exam.name,
        class_stream=cls.class_stream if cls else None,
        class_id=exam.class_id,
        subject_id=exam.subject_id,
        exam_type_id=exam.exam_type_id,
        term=exam.term,
        year=exam.year,
        total_submissions=total_submissions
    )

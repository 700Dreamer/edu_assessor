from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# --- Ingest Models ---
# Since ingest receives files and data, it might be Form data. 
# But let's define what we expect from the AI Webhook

class AIStudentResult(BaseModel):
    name: str
    score: float
    analysis: Dict[str, Any]

class AIWebhookPayload(BaseModel):
    submission_id: str
    students: List[AIStudentResult]

# --- Mobile Exam Session Schemas ---

class ExamSessionCreate(BaseModel):
    class_stream: Optional[str] = None
    class_id: Optional[str] = None
    subject_id: int
    exam_type_id: int
    term: int
    year: int
    name: Optional[str] = None

class ExamSessionResponse(BaseModel):
    exam_id: str
    status: str
    name: Optional[str] = None
    class_stream: Optional[str] = None
    class_id: str
    subject_id: Optional[int] = None
    exam_type_id: Optional[int] = None
    term: Optional[int] = None
    year: Optional[int] = None

class ExamUploadResponse(BaseModel):
    exam_id: str
    file_url: str

class ExamSealResponse(BaseModel):
    message: str
    exam_id: str
    status: str
    total_submissions: int

class ExamDetailResponse(BaseModel):
    exam_id: str
    status: str
    name: Optional[str] = None
    class_stream: Optional[str] = None
    class_id: str
    subject_id: Optional[int] = None
    exam_type_id: Optional[int] = None
    term: Optional[int] = None
    year: Optional[int] = None
    total_submissions: int

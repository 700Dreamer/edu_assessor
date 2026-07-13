from pydantic import BaseModel
from typing import List, Dict, Any

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

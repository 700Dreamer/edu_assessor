from typing import List, Optional
from pydantic import BaseModel

class ClassResponse(BaseModel):
    id: str
    level: str
    stream: Optional[str] = None

class SchoolResponse(BaseModel):
    id: str
    name: str
    classes: List[ClassResponse] = []

class LevelCreate(BaseModel):
    level: str  # e.g., "S.1"
    streams: List[str]  # e.g., ["A", "B", "Leopard"]

class SchoolCreate(BaseModel):
    name: str
    levels: List[LevelCreate]

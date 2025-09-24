from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClassificationBase(BaseModel):
    category: str
    confidence_score: Optional[float] = None
    suggested_response: Optional[str] = None
    processing_time: Optional[float] = None

class ClassificationCreate(ClassificationBase):
    email_id: int

class ClassificationResponse(ClassificationBase):
    id: int
    email_id: int
    is_deleted: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EmailClassificationResponse(BaseModel):
    email: dict
    classification: ClassificationResponse

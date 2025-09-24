from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EmailBase(BaseModel):
    subject: Optional[str] = None
    content: str
    sender: Optional[str] = None
    recipient: Optional[str] = None

class EmailCreate(EmailBase):
    file_name: Optional[str] = None
    file_type: Optional[str] = None

class EmailResponse(EmailBase):
    id: int
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    is_deleted: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

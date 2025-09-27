from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.template import TemplateType, TemplateCategory

class TemplateBase(BaseModel):
    type: TemplateType
    category: TemplateCategory
    content: str
    description: Optional[str] = None
    is_active: bool = False

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    type: Optional[TemplateType] = None
    category: Optional[TemplateCategory] = None
    content: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class TemplateResponse(TemplateBase):
    id: int
    version: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

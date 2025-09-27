from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.prompt import PromptType, PromptCategory, PromptSubcategory

class PromptBase(BaseModel):
    type: PromptType
    category: PromptCategory
    subcategory: Optional[PromptSubcategory] = PromptSubcategory.GENERAL
    content: str
    description: Optional[str] = None
    is_active: bool = False

class PromptCreate(PromptBase):
    pass

class PromptUpdate(BaseModel):
    type: Optional[PromptType] = None
    category: Optional[PromptCategory] = None
    subcategory: Optional[PromptSubcategory] = None
    content: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class PromptResponse(PromptBase):
    id: int
    version: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

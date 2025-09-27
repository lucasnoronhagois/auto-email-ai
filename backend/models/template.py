from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from config.database import Base
import enum

class TemplateType(enum.Enum):
    RESPONSE = "response"
    EMAIL = "email"
    NOTIFICATION = "notification"

class TemplateCategory(enum.Enum):
    PRODUCTIVE = "productive"
    UNPRODUCTIVE = "unproductive"
    GENERAL = "general"
    BUSINESS = "business"
    SPAM = "spam"

class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(Enum(TemplateType), nullable=False)
    category = Column(Enum(TemplateCategory), nullable=False)
    version = Column(Integer, default=1, nullable=False)
    content = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Template(id={self.id}, type={self.type.value}, category={self.category.value}, version={self.version})>"

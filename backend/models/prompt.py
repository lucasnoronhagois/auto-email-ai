from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from config.database import Base
import enum

class PromptType(enum.Enum):
    CLASSIFICATION = "classification"
    RESPONSE_GENERATION = "response_generation"

class PromptCategory(enum.Enum):
    PRODUCTIVE = "produtivo"
    UNPRODUCTIVE = "improdutivo"
    GENERAL = "geral"

class PromptSubcategory(enum.Enum):
    # Produtivos
    MEETINGS = "meetings"
    PROJECTS = "projects"
    SALES_BUSINESS = "sales_business"
    CUSTOMER_SERVICE = "customer_service"
    COLLABORATION = "collaboration"
    TRAINING = "training"
    REPORTING = "reporting"
    FINANCIAL = "financial"
    HR_RECRUITMENT = "hr_recruitment"
    TECHNOLOGY = "technology"
    STRATEGY_PLANNING = "strategy_planning"
    URGENT_IMPORTANT = "urgent_important"
    
    # Improdutivos
    SPAM = "spam"
    PROMOTIONS = "promotions"
    SOCIAL_MEDIA = "social_media"
    ENTERTAINMENT = "entertainment"
    PERSONAL = "personal"
    ADVERTISEMENTS = "advertisements"
    SPAM_PROMOTIONS = "spam_promotions"
    PERSONAL_GREETINGS = "personal_greetings"
    SCAMS_FRAUD = "scams_fraud"
    ADULT_CONTENT = "adult_content"
    PERSONAL_ASSOCIATIONS = "personal_associations"
    PERSONAL_SERVICES = "personal_services"
    LOCAL_SERVICES = "local_services"
    PERSONAL_PAYMENTS = "personal_payments"
    
    # Geral
    GENERAL = "general"
    OTHER = "other"

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(Enum(PromptType), nullable=False)
    category = Column(Enum(PromptCategory), nullable=False)
    subcategory = Column(Enum(PromptSubcategory), nullable=True, default=PromptSubcategory.GENERAL)
    version = Column(Integer, default=1, nullable=False)
    content = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Prompt(id={self.id}, type={self.type.value}, category={self.category.value}, version={self.version})>"

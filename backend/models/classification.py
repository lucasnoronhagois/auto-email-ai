from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.database import Base

class Classification(Base):
    __tablename__ = "classifications"

    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(Integer, ForeignKey("emails.id"), nullable=False)
    category = Column(String(20), nullable=False)  # "Produtivo" or "Improdutivo"
    subcategory = Column(String(50), nullable=True)  # Subcategoria específica
    confidence_score = Column(Float, nullable=True)
    suggested_response = Column(Text, nullable=True)
    processing_time = Column(Float, nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    email = relationship("Email", back_populates="classifications")
    historico = relationship("Historico", back_populates="classification")

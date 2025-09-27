from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.database import Base
import enum

class ActionType(enum.Enum):
    CREATED = "created"
    VIEWED = "viewed"
    UPDATED = "updated"
    DELETED = "deleted"

class Historico(Base):
    __tablename__ = "historico"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email_id = Column(Integer, ForeignKey("emails.id"), nullable=False)
    classification_id = Column(Integer, ForeignKey("classifications.id"), nullable=False)
    action_type = Column(Enum(ActionType), nullable=False)
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 support
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    email = relationship("Email", back_populates="historico")
    classification = relationship("Classification", back_populates="historico")

    def __repr__(self):
        return f"<Historico(id={self.id}, email_id={self.email_id}, action_type={self.action_type.value})>"

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.historico import ActionType

class HistoricoBase(BaseModel):
    email_id: int
    classification_id: int
    action_type: ActionType
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

class HistoricoCreate(HistoricoBase):
    pass

class HistoricoResponse(HistoricoBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class HistoricoWithDetails(HistoricoResponse):
    """Resposta com detalhes do email e classificação para o histórico"""
    email_subject: Optional[str] = None
    email_sender: Optional[str] = None
    email_content: Optional[str] = None
    classification_category: Optional[str] = None
    classification_confidence: Optional[float] = None
    classification_suggested_response: Optional[str] = None

    class Config:
        from_attributes = True

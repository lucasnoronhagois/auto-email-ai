from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.historico import Historico, ActionType
from ..schemas.historico import HistoricoCreate, HistoricoWithDetails
from typing import List, Optional

class HistoricoService:
    def __init__(self, db: Session):
        self.db = db

    def create_historico(self, historico_data: HistoricoCreate) -> Historico:
        """Cria um novo registro no histórico"""
        db_historico = Historico(**historico_data.model_dump())
        self.db.add(db_historico)
        self.db.commit()
        self.db.refresh(db_historico)
        return db_historico

    def get_historico_by_email(self, email_id: int) -> List[Historico]:
        """Busca histórico de um email específico"""
        return self.db.query(Historico).filter(
            Historico.email_id == email_id
        ).order_by(desc(Historico.created_at)).all()

    def get_historico_with_details(self, limit: int = 100, skip: int = 0) -> List[HistoricoWithDetails]:
        """Busca histórico com detalhes do email e classificação para o frontend"""
        from models.email import Email
        from models.classification import Classification
        
        query = self.db.query(
            Historico.id,
            Historico.email_id,
            Historico.classification_id,
            Historico.action_type,
            Historico.user_agent,
            Historico.ip_address,
            Historico.created_at,
            # Campos do email
            Email.subject,
            Email.sender,
            Email.content,
            # Campos da classificação
            Classification.category,
            Classification.confidence_score,
            Classification.suggested_response
        ).join(
            Email, Historico.email_id == Email.id
        ).join(
            Classification, Historico.classification_id == Classification.id
        ).filter(
            Historico.action_type == ActionType.CREATED
        ).order_by(desc(Historico.created_at)).offset(skip).limit(limit)

        results = []
        for row in query.all():
            historico_detail = HistoricoWithDetails(
                id=row[0],
                email_id=row[1],
                classification_id=row[2],
                action_type=row[3],
                user_agent=row[4],
                ip_address=row[5],
                created_at=row[6],
                email_subject=row[7],
                email_sender=row[8],
                email_content=row[9],
                classification_category=row[10],
                classification_confidence=row[11],
                classification_suggested_response=row[12]
            )
            results.append(historico_detail)

        return results

    def get_historico_count(self) -> int:
        """Conta total de registros no histórico"""
        return self.db.query(Historico).filter(
            Historico.action_type == ActionType.CREATED
        ).count()

    def log_email_created(self, email_id: int, classification_id: int, 
                         user_agent: str = None, ip_address: str = None) -> Historico:
        """Log quando um email é criado/classificado"""
        historico_data = HistoricoCreate(
            email_id=email_id,
            classification_id=classification_id,
            action_type=ActionType.CREATED,
            user_agent=user_agent,
            ip_address=ip_address
        )
        return self.create_historico(historico_data)

    def log_email_viewed(self, email_id: int, classification_id: int,
                        user_agent: str = None, ip_address: str = None) -> Historico:
        """Log quando um email é visualizado no histórico"""
        historico_data = HistoricoCreate(
            email_id=email_id,
            classification_id=classification_id,
            action_type=ActionType.VIEWED,
            user_agent=user_agent,
            ip_address=ip_address
        )
        return self.create_historico(historico_data)

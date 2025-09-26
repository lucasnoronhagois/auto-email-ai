from sqlalchemy.orm import Session
from models.email import Email
from schemas.email import EmailCreate
from typing import List, Optional

class EmailService:
    def __init__(self, db: Session):
        self.db = db

    def create_email(self, email_data: EmailCreate) -> Email:
        db_email = Email(**email_data.model_dump())
        self.db.add(db_email)
        self.db.commit()
        self.db.refresh(db_email)
        return db_email

    def get_email(self, email_id: int) -> Optional[Email]:
        return self.db.query(Email).filter(
            Email.id == email_id, 
            Email.is_deleted == False
        ).first()

    def get_emails(self, skip: int = 0, limit: int = 100) -> List[Email]:
        return self.db.query(Email).filter(
            Email.is_deleted == False
        ).offset(skip).limit(limit).all()

    def delete_email(self, email_id: int) -> bool:
        db_email = self.get_email(email_id)
        if not db_email:
            return False
        
        db_email.is_deleted = True
        self.db.commit()
        return True

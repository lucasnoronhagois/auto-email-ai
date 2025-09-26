from sqlalchemy.orm import Session
from models.classification import Classification
from schemas.classification import ClassificationCreate
from typing import List, Optional

class ClassificationService:
    def __init__(self, db: Session):
        self.db = db

    def create_classification(self, classification_data: ClassificationCreate) -> Classification:
        db_classification = Classification(**classification_data.model_dump())
        self.db.add(db_classification)
        self.db.commit()
        self.db.refresh(db_classification)
        return db_classification

    def get_classification(self, classification_id: int) -> Optional[Classification]:
        return self.db.query(Classification).filter(
            Classification.id == classification_id, 
            Classification.is_deleted == False
        ).first()

    def get_classification_by_email(self, email_id: int) -> Optional[Classification]:
        return self.db.query(Classification).filter(
            Classification.email_id == email_id, 
            Classification.is_deleted == False
        ).first()

    def get_classifications(self, skip: int = 0, limit: int = 100) -> List[Classification]:
        return self.db.query(Classification).filter(
            Classification.is_deleted == False
        ).offset(skip).limit(limit).all()

    def delete_classification(self, classification_id: int) -> bool:
        db_classification = self.get_classification(classification_id)
        if not db_classification:
            return False
        
        db_classification.is_deleted = True
        self.db.commit()
        return True

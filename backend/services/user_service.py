from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserUpdate
from typing import List, Optional

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate) -> User:
        db_user = User(**user_data.dict())
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(
            User.id == user_id, 
            User.is_deleted == False
        ).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(
            User.email == email, 
            User.is_deleted == False
        ).first()

    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).filter(
            User.is_deleted == False
        ).offset(skip).limit(limit).all()

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete_user(self, user_id: int) -> bool:
        db_user = self.get_user(user_id)
        if not db_user:
            return False
        
        db_user.is_deleted = True
        self.db.commit()
        return True

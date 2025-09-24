from sqlalchemy.orm import Session
from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate, VehicleUpdate
from typing import List, Optional

class VehicleService:
    def __init__(self, db: Session):
        self.db = db

    def create_vehicle(self, vehicle_data: VehicleCreate) -> Vehicle:
        db_vehicle = Vehicle(**vehicle_data.dict())
        self.db.add(db_vehicle)
        self.db.commit()
        self.db.refresh(db_vehicle)
        return db_vehicle

    def get_vehicle(self, vehicle_id: int) -> Optional[Vehicle]:
        return self.db.query(Vehicle).filter(
            Vehicle.id == vehicle_id, 
            Vehicle.is_deleted == False
        ).first()

    def get_vehicles(self, skip: int = 0, limit: int = 100) -> List[Vehicle]:
        return self.db.query(Vehicle).filter(
            Vehicle.is_deleted == False
        ).offset(skip).limit(limit).all()

    def get_vehicles_by_user(self, user_id: int) -> List[Vehicle]:
        return self.db.query(Vehicle).filter(
            Vehicle.user_id == user_id,
            Vehicle.is_deleted == False
        ).all()

    def update_vehicle(self, vehicle_id: int, vehicle_data: VehicleUpdate) -> Optional[Vehicle]:
        db_vehicle = self.get_vehicle(vehicle_id)
        if not db_vehicle:
            return None
        
        update_data = vehicle_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_vehicle, field, value)
        
        self.db.commit()
        self.db.refresh(db_vehicle)
        return db_vehicle

    def delete_vehicle(self, vehicle_id: int) -> bool:
        db_vehicle = self.get_vehicle(vehicle_id)
        if not db_vehicle:
            return False
        
        db_vehicle.is_deleted = True
        self.db.commit()
        return True

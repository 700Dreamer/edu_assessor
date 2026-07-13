from sqlalchemy import Column, String, Boolean, Enum
import enum
from app.db.base_class import Base, generate_uuid

class UserRole(str, enum.Enum):
    SUPERADMIN = "SUPERADMIN"
    SCHOOL_ADMIN = "SCHOOL_ADMIN"

class User(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.SCHOOL_ADMIN, nullable=False)
    school_id = Column(String, nullable=True, index=True) # Will be foreign key later
    is_active = Column(Boolean, default=True)

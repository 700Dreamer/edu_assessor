from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    role: Optional[UserRole] = None
    school_id: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str
    role: UserRole = UserRole.SCHOOL_ADMIN

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[str] = None

    model_config = {"from_attributes": True}

class User(UserInDBBase):
    pass

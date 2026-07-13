from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud import crud_school
from app.schemas.school import SchoolCreate, SchoolResponse
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=SchoolResponse)
async def create_school(
    school_in: SchoolCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Create a new school with its classes (levels and streams).
    """
    school = await crud_school.create_school_with_classes(db=db, obj_in=school_in)
    return school

@router.get("/", response_model=List[SchoolResponse])
async def read_schools(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve schools.
    """
    schools = await crud_school.get_schools(db, skip=skip, limit=limit)
    return schools

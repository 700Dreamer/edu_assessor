from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.domain import School, Class
from app.schemas.school import SchoolCreate

async def create_school_with_classes(db: AsyncSession, obj_in: SchoolCreate) -> School:
    # Create the School
    db_school = School(name=obj_in.name)
    db.add(db_school)
    await db.flush()  # To get the school.id
    
    # Create the Classes
    for level_in in obj_in.levels:
        if not level_in.streams:
            # Create a single class for this level with no stream
            db_class = Class(level=level_in.level, school_id=db_school.id)
            db.add(db_class)
        else:
            for stream_name in level_in.streams:
                db_class = Class(level=level_in.level, stream=stream_name, school_id=db_school.id)
                db.add(db_class)
                
    await db.commit()
    
    # Reload with classes
    result = await db.execute(select(School).options(selectinload(School.classes)).filter(School.id == db_school.id))
    return result.scalars().first()

async def get_schools(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(School).options(selectinload(School.classes)).offset(skip).limit(limit))
    return result.scalars().all()

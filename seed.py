import asyncio
from app.db.session import SessionLocal
from app.crud import crud_user
from app.schemas.user import UserCreate
from app.models.user import UserRole

async def seed_admin():
    async with SessionLocal() as db:
        # Check if admin already exists
        user = await crud_user.get_user_by_email(db, email="admin@eduquest.com")
        if user:
            print("Admin account already exists: admin@eduquest.com / password123")
            return
            
        print("Creating admin account...")
        admin_in = UserCreate(
            email="admin@eduquest.com",
            password="password123",
            role=UserRole.SUPERADMIN,
            is_active=True
        )
        
        await crud_user.create_user(db, obj_in=admin_in)
        print("Successfully created admin account!")
        print("Email: admin@eduquest.com")
        print("Password: password123")

if __name__ == "__main__":
    asyncio.run(seed_admin())

import asyncio
import os
import zipfile
import requests
from app.db.session import SessionLocal
from app.models.domain import School, Class
from sqlalchemy.future import select

# 1. Setup mock data in the DB
async def setup_test_data():
    async with SessionLocal() as db:
        # Create a mock School
        result = await db.execute(select(School).filter(School.name == "Test High School"))
        school = result.scalars().first()
        if not school:
            school = School(name="Test High School")
            db.add(school)
            await db.commit()
            await db.refresh(school)
            
        # Create a mock Class
        result = await db.execute(select(Class).filter(Class.name == "Senior 4", Class.school_id == school.id))
        cls = result.scalars().first()
        if not cls:
            cls = Class(name="Senior 4", school_id=school.id)
            db.add(cls)
            await db.commit()
            await db.refresh(cls)
            
        return str(school.id), str(cls.id)

def main():
    print("1. Creating dummy ZIP file...")
    zip_path = "test_exam.zip"
    with zipfile.ZipFile(zip_path, 'w') as z:
        z.writestr("scanned_paper.pdf", b"dummy pdf binary content")
    print(f"-> Created {zip_path}")
    
    print("\n2. Setting up test data in Database...")
    school_id, class_id = asyncio.run(setup_test_data())
    print(f"-> School ID: {school_id}")
    print(f"-> Class ID: {class_id}")
    
    base_url = "http://localhost:8000"
    
    print("\n3. Logging in to get Bearer Token...")
    # Assuming you've run seed.py to create this admin
    login_data = {
        "username": "admin@eduquest.com",
        "password": "password123"
    }
    resp = requests.post(f"{base_url}/api/v1/auth/token", data=login_data)
    
    if resp.status_code != 200:
        print(f"-> LOGIN FAILED! Status: {resp.status_code}, {resp.text}")
        print("-> Make sure the server is running (python server.py) and seed.py was run.")
        return
        
    token = resp.json().get("access_token")
    print("-> Successfully retrieved JWT token!")
    
    print("\n4. Testing the /api/v1/ingest upload endpoint...")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # Form data payload
    data = {
        "school": school_id,
        "class_id": class_id,
        "subject_id": 5,
        "exam_type_id": 2,
        "term": 2,
        "year": 2026,
        "exam_name": "Mid Term II"
    }
    
    # Upload the file
    with open(zip_path, "rb") as f:
        files = {"file": ("test_exam.zip", f, "application/zip")}
        
        upload_resp = requests.post(
            f"{base_url}/api/v1/ingest", 
            headers=headers, 
            data=data, 
            files=files
        )
        
    print(f"-> Upload Response Code: {upload_resp.status_code}")
    print(f"-> Upload Response Body: {upload_resp.json()}")

    # Clean up the dummy zip
    if os.path.exists(zip_path):
        os.remove(zip_path)

if __name__ == "__main__":
    main()

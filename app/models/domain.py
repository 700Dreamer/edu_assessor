from sqlalchemy import Column, String, ForeignKey, Integer, Float, Enum, JSON
from sqlalchemy.orm import relationship
import enum
from app.db.base_class import Base, generate_uuid

class School(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, nullable=False, index=True)
    
    classes = relationship("Class", back_populates="school")
    students = relationship("Student", back_populates="school")
    # A school can have many users (admins)

class Class(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    level = Column(String, nullable=False, index=True) # e.g. "S.1"
    stream = Column(String, nullable=True) # e.g. "Leopard"
    school_id = Column(String, ForeignKey("school.id"), nullable=False)
    
    school = relationship("School", back_populates="classes")
    students = relationship("Student", back_populates="cls")
    exams = relationship("Exam", back_populates="cls")

    @property
    def class_stream(self) -> str:
        if self.stream:
            return f"{self.level} {self.stream}"
        return self.level

class Student(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, nullable=False)
    school_id = Column(String, ForeignKey("school.id"), nullable=False)
    class_id = Column(String, ForeignKey("class.id"), nullable=False)
    
    school = relationship("School", back_populates="students")
    cls = relationship("Class", back_populates="students")
    results = relationship("Result", back_populates="student")

class ExamStatus(str, enum.Enum):
    OPEN = "OPEN"
    SEALED = "SEALED"

class Exam(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, nullable=True)
    class_id = Column(String, ForeignKey("class.id"), nullable=False)
    subject_id = Column(Integer, nullable=True)
    exam_type_id = Column(Integer, nullable=True)
    term = Column(Integer, nullable=True)
    year = Column(Integer, nullable=True)
    status = Column(Enum(ExamStatus), default=ExamStatus.OPEN, nullable=False)
    
    cls = relationship("Class", back_populates="exams")
    submissions = relationship("Submission", back_populates="exam")
    results = relationship("Result", back_populates="exam")

class SubmissionStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Submission(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    exam_id = Column(String, ForeignKey("exam.id"), nullable=False)
    file_url = Column(String, nullable=False)
    file_hash = Column(String, nullable=True, index=True)
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING)
    
    exam = relationship("Exam", back_populates="submissions")

class Result(Base):
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    student_id = Column(String, ForeignKey("student.id"), nullable=False)
    exam_id = Column(String, ForeignKey("exam.id"), nullable=False)
    score = Column(Float, nullable=True)
    ai_analysis_json = Column(JSON, nullable=True) # Arbitrary metrics from AI
    
    student = relationship("Student", back_populates="results")
    exam = relationship("Exam", back_populates="results")

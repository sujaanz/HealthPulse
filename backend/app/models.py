from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    contact = Column(String(20), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ClinicalEncounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_name = Column(String(100), default="Dr. Ballav")
    raw_narrative = Column(Text, nullable=False)
    language = Column(String(10), default="en-IN")
    structured_info = Column(JSON, nullable=False)
    cds_insights = Column(JSON, nullable=False)
    case_summary = Column(Text, nullable=False)
    status = Column(String(50), default="Finalized")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
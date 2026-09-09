import traceback
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import engine, Base, get_db
from .models import Patient, ClinicalEncounter
from .schemas import (
    PatientCreate,
    PatientResponse,
    NLPAnalyzeRequest,
    NLPAnalyzeResponse,
    EncounterCreate,
)
from .ai_engine import extract_clinical_data

# Creating a database table
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthPulse Clinical Automation API", version="2.0")

# CORS configuration (for connecting to Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter(Patient.contact == payload.contact).first()
    if existing:
        return existing
    patient = Patient(**payload.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@app.get("/api/patients", response_model=List[PatientResponse])
def search_patients(search: str = "", db: Session = Depends(get_db)):
    if search:
        return db.query(Patient).filter(Patient.contact.contains(search)).all()
    return db.query(Patient).limit(20).all()

@app.post("/api/clinical/analyze", response_model=NLPAnalyzeResponse)
def analyze_case(payload: NLPAnalyzeRequest):
    try:
        analysis = extract_clinical_data(payload.narrative, payload.language)
        return analysis
    except Exception as e:
        print("\n" + "=" * 50)
        print("🚨 CLINICAL NLP AI ENGINE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        raise HTTPException(
            status_code=500, 
            detail=f"AI processing failed: {str(e)}"
        )

@app.post("/api/encounters/finalize", status_code=status.HTTP_201_CREATED)
def finalize_encounter(payload: EncounterCreate, db: Session = Depends(get_db)):
    encounter = ClinicalEncounter(**payload.model_dump())
    db.add(encounter)
    db.commit()
    db.refresh(encounter)
    return {"message": "Encounter finalized successfully", "encounter_id": encounter.id}
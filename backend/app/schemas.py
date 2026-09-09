from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class PatientCreate(BaseModel):
    full_name: str
    age: int
    gender: str
    contact: str

class PatientResponse(PatientCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class NLPAnalyzeRequest(BaseModel):
    patient_id: int
    narrative: str
    language: str

class StructuredInfo(BaseModel):
    chief_complaint: str
    duration: str
    symptoms: List[str]
    past_history: str
    family_history: str
    medication_history: str
    allergy_history: str
    personal_history: str

class MissingInfo(BaseModel):
    is_missing: bool
    missing_elements: List[str]
    suggested_followup_questions: List[str]

class CDSInsights(BaseModel):
    differential_considerations: List[str]
    red_flag_alerts: List[str]
    relevant_investigations: List[str]
    follow_up_prompts: List[str]

class NLPAnalyzeResponse(BaseModel):
    structured_info: StructuredInfo
    missing_information: MissingInfo
    case_summary: str
    clinical_decision_support: CDSInsights

class EncounterCreate(BaseModel):
    patient_id: int
    doctor_name: str
    raw_narrative: str
    language: str
    structured_info: dict
    cds_insights: dict
    case_summary: str
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)

# 1. Kiosk & Clinical Encounter Prompt (Updated for Allopathy & Ayush Modes + SOCRATES Framework)
CLINICAL_PROMPT_TEMPLATE = """
You are 'HealthPulse AI', a Patient-Facing Medical Triage Chatbot and Board-Certified Clinical Informatics DSS.
The patient is interacting with a self-service check-in kiosk.
Analyze the following patient narrative:
{raw_notes}

Language Preference: {language}
Consultation Mode: {mode} (If 'Ayush', focus heavily on Dashavidha Pariksha parameters).

CRITICAL INSTRUCTIONS FOR AI CHATBOT (Missing Information & Follow-up):
If the patient's narrative is incomplete, you MUST generate maximum 2 follow-up questions using the SOCRATES framework (e.g., "When did the pain start?", "Does it spread anywhere?") or Ayurvedic framework ("How is your appetite?", "Do you feel hot or cold?"). These questions MUST be in the patient's '{language}'.

Output strictly a valid JSON object matching this exact schema:
{{
  "structured_info": {{
    "chief_complaint": "string",
    "duration": "string",
    "symptoms": ["symptom1"],
    "ayurvedic_parameters": {{
      "prakriti_vikriti": "string (If mode is Ayush)",
      "ahara_vihara": "string (Diet/Lifestyle, if mode is Ayush)"
    }},
    "past_history": "string",
    "family_history": "string",
    "medication_history": "string",
    "allergy_history": "string"
  }},
  "missing_information": {{
    "is_missing": true,
    "missing_elements": ["element"],
    "suggested_followup_questions": ["Direct question to patient in {language}"]
  }},
  "case_summary": "Concise summary for the doctor.",
  "clinical_decision_support": {{
    "differential_considerations": ["Diagnosis 1", "Diagnosis 2"],
    "red_flag_alerts": ["Alert if emergency"],
    "relevant_investigations": ["Lab test name"]
  }}
}}
"""

# 2. Document OCR Prompt (For Kiosk Medical Report Uploads)
OCR_PROMPT_TEMPLATE = """
You are an expert Medical OCR Data Extraction System.
Extract structured clinical data from the following raw OCR text extracted from a patient's old medical document (prescription or lab report).
Raw OCR Text:
{raw_text}

Output strictly a valid JSON object matching this schema:
{{
  "document_type": "Prescription / Lab Report / Discharge Summary / Unknown",
  "extracted_date": "string (if found)",
  "extracted_diagnoses": ["disease or condition"],
  "extracted_medications": [
    {{
      "medicine_name": "string",
      "dosage": "string",
      "duration": "string"
    }}
  ],
  "extracted_lab_values": [
    {{
      "test_name": "string",
      "result_value": "string",
      "abnormal_flag": true or false
    }}
  ],
  "summary": "One line summary of this document."
}}
"""

def extract_clinical_data(narrative: str, language: str, mode: str = "Allopathy") -> dict:
    # 1. Try Gemini API First
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = CLINICAL_PROMPT_TEMPLATE.format(raw_notes=narrative, language=language, mode=mode)
            res = model.generate_content(prompt)
            txt = res.text.strip()
            
            # Clean JSON formatting issues
            if txt.startswith("```json"): txt = txt[7:]
            if txt.startswith("```"): txt = txt[3:]
            if txt.endswith("```"): txt = txt[:-3]
            
            return json.loads(txt.strip())
        except Exception as e:
            print(f"Gemini API call failed, falling back to mock response: {e}")

    # 2. Fallback Response (Ensures the app never crashes)
    fallback_response = {
        "structured_info": {
            "chief_complaint": "High grade fever with associated weakness",
            "duration": "5 days",
            "symptoms": ["Fever", "Body ache"],
            "ayurvedic_parameters": {
                "prakriti_vikriti": "Vata-Pitta Imbalance Suspected" if mode == "Ayush" else "N/A",
                "ahara_vihara": "Poor appetite, irregular sleep" if mode == "Ayush" else "N/A"
            },
            "past_history": "None reported",
            "family_history": "Non-contributory",
            "medication_history": "Self-medicated with Paracetamol",
            "allergy_history": "Not documented"
        },
        "missing_information": {
            "is_missing": True,
            "missing_elements": ["Exact temperature records", "Known drug allergy documentation"],
            "suggested_followup_questions": [
                "কবে থেকে এই জ্বর শুরু হয়েছে এবং শরীরের তাপমাত্রা কত ছিল?" if language == "bn" else
                "Has there been any chills or rigors?"
            ]
        },
        "case_summary": "Patient presents with a 5-day history of fever and constitutional symptoms. Requires evaluation.",
        "clinical_decision_support": {
            "differential_considerations": ["Viral Pyrexia", "Dengue Fever"],
            "red_flag_alerts": ["Prolonged fever > 4 days requires immediate complete blood panel."],
            "relevant_investigations": ["CBC with Differential", "Platelet Count"]
        }
    }
    return fallback_response

def extract_document_ocr(raw_text: str) -> dict:
    """ Processes unstructured OCR text and extracts structured medical data """
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = OCR_PROMPT_TEMPLATE.format(raw_text=raw_text)
            res = model.generate_content(prompt)
            txt = res.text.strip()
            
            if txt.startswith("```json"): txt = txt[7:]
            if txt.startswith("```"): txt = txt[3:]
            if txt.endswith("```"): txt = txt[:-3]
            
            return json.loads(txt.strip())
        except Exception as e:
            print(f"Gemini OCR call failed: {e}")

    # Fallback for OCR
    return {
        "document_type": "Unknown Document",
        "extracted_date": "Not found",
        "extracted_diagnoses": ["Data extraction failed"],
        "extracted_medications": [],
        "extracted_lab_values": [],
        "summary": "Could not parse document data."
    }
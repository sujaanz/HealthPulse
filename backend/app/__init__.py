import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT_TEMPLATE = """
You are a Board-Certified Clinical Informatics Physician and Decision Support System.
Analyze the following patient clinical narrative (which may be in English, Hindi, Bengali, or code-switched dialect).

Patient Case Input:
{raw_notes}

Language Used: {language}

Output a strictly valid JSON object matching this schema:
{{
  "structured_info": {{
    "chief_complaint": "string",
    "duration": "string",
    "symptoms": ["list of symptoms"],
    "past_history": "string",
    "family_history": "string",
    "medication_history": "string",
    "allergy_history": "string",
    "personal_history": "string"
  }},
  "missing_information": {{
    "is_missing": true,
    "missing_elements": ["unspecified durations, allergy status, etc."],
    "suggested_followup_questions": ["questions doctor should ask"]
  }},
  "case_summary": "Concise 2-3 sentence clinical overview.",
  "clinical_decision_support": {{
    "differential_considerations": ["Diagnosis 1", "Diagnosis 2"],
    "red_flag_alerts": ["Urgent alert or empty"],
    "relevant_investigations": ["ECG", "Troponin", "CBC"],
    "follow_up_prompts": ["Follow-up schedule"]
  }}
}}
"""

def extract_clinical_data(narrative: str, language: str) -> dict:
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json", "temperature": 0.2}
    )
    prompt = PROMPT_TEMPLATE.format(raw_notes=narrative, language=language)
    response = model.generate_content(prompt)
    return json.loads(response.text)
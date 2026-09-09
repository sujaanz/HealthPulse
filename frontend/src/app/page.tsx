"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import {
  LayoutDashboard, Users, Calendar, ClipboardList, FileText, BarChart3, Settings,
  Mic, Square, Search, Printer, Download, AlertTriangle, Activity, ChevronRight,
  CheckCircle, Save, RefreshCw, ShieldCheck, Stethoscope, LogOut, ShieldAlert,
  Lock, Mail, Eye, EyeOff, X, FileSpreadsheet, ArrowLeft, UserPlus, PenTool,
  FileJson, Camera, FileUp, Moon, Sun, Send, MessageSquare, Baby, Pill, Utensils,
  Play, Pause, BedDouble, Wifi, Video, VideoOff, Volume2, QrCode, TrendingUp,
  Scan, CreditCard, Bot, User, Hash, Building, Key, UserCheck, XCircle, Plus, Edit,
  IndianRupee, Megaphone
} from "lucide-react";

export default function HealthPulseSystem() {
  const initialPatients = [
    {
      id: "PID-2024-00124", fullName: "Rahul Sharma", gender: "Male", dob: "1988-03-21", age: "36",
      abhaId: "91-1122-3344-5566", phone: "+91 98111 22334", email: "rahul.sharma@example.com",
      allergies: "Sulfonamides", chronicConditions: "Hypertension (Stage 1)",
      recentDiagnosis: "Viral Pyrexia (ICD-11: 1D20)", appointmentTime: "09:30 AM", triageStatus: "Stable"
    },
    {
      id: "PID-2024-00125", fullName: "Priya Das", gender: "Female", dob: "1995-05-14", age: "29",
      abhaId: "91-4821-3920-1124", phone: "+91 98765 43210", email: "priya.das@healthpulse.com",
      allergies: "Penicillin, Aspirin-induced dyspepsia", chronicConditions: "Mild Gastritis",
      recentDiagnosis: "Acute Viral Pyrexia", appointmentTime: "10:00 AM", triageStatus: "Moderate"
    },
    {
      id: "PID-2024-00126", fullName: "Amit Verma", gender: "Male", dob: "1975-11-02", age: "49",
      abhaId: "91-9988-7766-5544", phone: "+91 98222 33445", email: "amit.verma@example.com",
      allergies: "None reported", chronicConditions: "Type 2 Diabetes Mellitus",
      recentDiagnosis: "Dyspepsia (ICD-11: MD90)", appointmentTime: "10:30 AM", triageStatus: "Stable"
    },
    {
      id: "PID-2024-00127", fullName: "Aarav Roy", gender: "Male", dob: "2018-08-19", age: "6",
      abhaId: "91-3344-5566-7788", phone: "+91 98333 44556", email: "aarav.roy@example.com",
      allergies: "Dust / Pollen", chronicConditions: "None",
      recentDiagnosis: "Pediatric Febrile Illness", appointmentTime: "11:00 AM", triageStatus: "Priority"
    }
  ];

  // Core State
  const [darkMode, setDarkMode] = useState(false);
  const [patientList, setPatientList] = useState<any[]>(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(initialPatients[1]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("medicase_master_patients_v5");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPatientList(parsed);
          setSelectedPatient(parsed[0]);
          return;
        }
      }
    } catch (e) { console.error(e); }
    setPatientList(initialPatients);
    setSelectedPatient(initialPatients[1]);
  }, []);

  const updatePatientsPersistence = (newList: any[]) => {
    setPatientList(newList);
    try { localStorage.setItem("medicase_master_patients_v5", JSON.stringify(newList)); } 
    catch (e) { console.error(e); }
  };

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authRoleTab, setAuthRoleTab] = useState<"doctor" | "patient" | "admin">("doctor");
  const [authEmail, setAuthEmail] = useState("dr.ananya@healthpulse.com");
  const [authPassword, setAuthPassword] = useState("doctor123");
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Screen Navigation (Expanded for Admin)
  const [currentScreen, setCurrentScreen] = useState<
    "dashboard" | "patients" | "registration" | "casetaking" | "suggestions" | "history" | "report" | "appointments" | "settings" | "audit" | "patient-portal" | "patient-view-rx" | "login" | "signup" | "forgot-password" | "user-management" | "profile" | "inventory" | "bed-management" | "announcements"
  >("login");

  // Signup & Admin States
  const [signupRole, setSignupRole] = useState("patient");
  const [pendingDoctors, setPendingDoctors] = useState([
    { id: "REQ-001", name: "Dr. Vikram Singh", spec: "Neurologist", reg: "WBMC-55441", date: "Today", status: "Pending" },
    { id: "REQ-002", name: "Dr. Sunita Rao", spec: "Pediatrician", reg: "WBMC-99221", date: "Yesterday", status: "Pending" }
  ]);
  const [bookDoctor, setBookDoctor] = useState("");
  const [globalAnnouncement, setGlobalAnnouncement] = useState("");

  // Multilingual Rx State (bn / hi / en)
  const [rxLanguage, setRxLanguage] = useState<"en" | "bn" | "hi">("bn");
  const [patientPortalLang, setPatientPortalLang] = useState<"en" | "bn" | "hi">("bn");
  const [isSpeakingRx, setIsSpeakingRx] = useState(false);

  // Modals State
  const [showXRayModal, setShowXRayModal] = useState(false);
  const [xRayScanning, setXRayScanning] = useState(false);
  const [xRayResult, setXRayResult] = useState<any>(null);

  const [showNurseBotModal, setShowNurseBotModal] = useState(false);
  const [nurseMessages, setNurseMessages] = useState([
    { sender: "bot", text: "Hello! I am your HealthPulse AI Nurse. How is your fever today? Any headache or nausea?" }
  ]);
  const [nurseInput, setNurseInput] = useState("");

  const [showHealthCardModal, setShowHealthCardModal] = useState(false);
  const [showTeleModal, setShowTeleModal] = useState(false);
  const [teleVideoMuted, setTeleVideoMuted] = useState(false);
  const [showQrCheckinModal, setShowQrCheckinModal] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Patient Modals
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [reminderToggles, setReminderToggles] = useState({ morning: true, afternoon: true, night: false });
  const [bookDate, setBookDate] = useState("2024-06-20");
  const [bookTime, setBookTime] = useState("10:30 AM");

  // Vitals & NEWS2 Triage
  const [vitals, setVitals] = useState({
    temperature: 100.4, pulse: 98, bpSystolic: 120, bpDiastolic: 80, respiratoryRate: 18, oxygenSaturation: 98
  });

  const calculateTriage = () => {
    let score = 0;
    if (vitals.temperature > 102 || vitals.temperature < 96) score += 2;
    else if (vitals.temperature > 100.4) score += 1;

    if (vitals.pulse > 110 || vitals.pulse < 50) score += 2;
    else if (vitals.pulse > 95) score += 1;

    if (vitals.bpSystolic < 100 || vitals.bpSystolic > 160) score += 2;
    if (vitals.oxygenSaturation < 94) score += 3;

    if (score >= 4) return { label: "CRITICAL ALERT (Red)", color: "bg-red-500/10 text-red-600 border-red-500/30", badge: "bg-red-600", bedAlert: true };
    if (score >= 2) return { label: "MODERATE RISK (Amber)", color: "bg-amber-500/10 text-amber-600 border-amber-500/30", badge: "bg-amber-500", bedAlert: false };
    return { label: "NORMAL STABILITY (Green)", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", badge: "bg-emerald-600", bedAlert: false };
  };

  const currentTriage = calculateTriage();

  // Speaker Diarization
  const [dialogueMode, setDialogueMode] = useState(false);
  const [dialogues] = useState([
    { speaker: "Doctor", text: "How long have you had this fever, and is there any body pain?" },
    { speaker: "Patient", text: "Since 3 days doctor. Severe headache, bodyache and feeling weakness. No cough." }
  ]);

  // Differential Matrix
  const differentialMatrix = [
    { disease: "Acute Dengue Infection", probability: 78, icd: "1D20", rationale: "High fever + Retro-orbital headache + Thrombocytopenia" },
    { disease: "Chikungunya Fever", probability: 14, icd: "1D21", rationale: "Intense symmetrical myalgia/arthralgia" },
    { disease: "Viral Pharyngitis", probability: 8, icd: "1C62", rationale: "Absence of significant lower respiratory symptoms" }
  ];

  // Generic Substitutes Matrix
  const [inventoryList, setInventoryList] = useState([
    { id: "MED-01", brand: "Dolo 650 (Paracetamol)", generic: "Tab. Paracetamol IP 650mg", stock: 420, price: "₹9.50" },
    { id: "MED-02", brand: "Pantocid 40 (Pantoprazole)", generic: "Cap. Pantoprazole 40mg", stock: 180, price: "₹28.00" },
    { id: "MED-03", brand: "Augmentin 625 Duo", generic: "Amoxicillin + Clavulanic Acid", stock: 55, price: "₹120.00" },
    { id: "MED-04", brand: "Azee 500", generic: "Azithromycin 500mg", stock: 12, price: "₹65.00" }
  ]);

  const genericMatrix = inventoryList.slice(0,2).map(item => ({
    brand: item.brand, brandPrice: "₹" + (parseFloat(item.price.replace("₹","")) * 3.5).toFixed(2),
    generic: item.generic, genericPrice: item.price, savings: "High Cost Saving", stock: `In Stock (${item.stock} units)`
  }));

  // Hospital Beds Mock Data
  const [bedStatus, setBedStatus] = useState([
    { id: "ICU-01", type: "ICU", status: "Occupied", patient: "PID-2024-00124" },
    { id: "ICU-02", type: "ICU", status: "Available", patient: null },
    { id: "GEN-01", type: "General Ward", status: "Occupied", patient: "PID-2024-00125" },
    { id: "GEN-02", type: "General Ward", status: "Available", patient: null },
    { id: "EMR-01", type: "Emergency", status: "Available", patient: null },
  ]);

  // Trends
  const historicalTrends = [
    { date: "Day 1", platelets: 210, temp: 102.0 },
    { date: "Day 2", platelets: 180, temp: 101.4 },
    { date: "Day 3", platelets: 135, temp: 100.8 },
    { date: "Day 4", platelets: 155, temp: 99.2 },
    { date: "Day 5 (Today)", platelets: 195, temp: 98.6 }
  ];

  // Signature Canvas & Handlers
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true); setHasSignature(true);
  };
  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = darkMode ? "#93C5FD" : "#0B4EA2"; ctx.lineWidth = 2; ctx.stroke();
  };
  const stopDrawing = () => setIsDrawing(false);
  const clearSignature = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); setHasSignature(false);
  };

  // Prescription Builder Sync
  const [rxBuilder, setRxBuilder] = useState({
    diagnosis: "Viral Pyrexia (ICD-11: 1D20)",
    medicines: [{ name: "Tab. Paracetamol 650mg", dose: "1-1-1 (TDS)", duration: "3 days", instructions: "After food" }]
  });

  const syncPrescription = () => {
    const plan = rxBuilder.medicines.map((m, i) => `${i + 1}. ${m.name} - ${m.dose} for ${m.duration} (${m.instructions})`);
    setAiData(prev => ({ ...prev, provisionalDiagnosis: rxBuilder.diagnosis, treatmentPlan: plan }));
    showToast("Prescription Generated Successfully!");
    setCurrentScreen("report");
  };

  const exportFhirJson = () => {
    const fhirBundle = {
      resourceType: "Bundle", type: "document", timestamp: new Date().toISOString(),
      entry: [
        { resource: { resourceType: "Patient", id: selectedPatient?.id || "PID-001", name: [{ text: selectedPatient?.fullName || "Patient" }], gender: selectedPatient?.gender?.toLowerCase() || "other", identifier: [{ system: "https://healthid.ndhm.gov.in", value: selectedPatient?.abhaId || "" }] } },
        { resource: { resourceType: "Condition", code: { coding: [{ system: "http://id.who.int/icd11/mms", code: "1D20", display: aiData.provisionalDiagnosis }] } } },
        { resource: { resourceType: "MedicationRequest", status: "active", medicationCodeableConcept: { text: aiData.treatmentPlan[0] } } }
      ]
    };
    const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `FHIR_${selectedPatient?.id || "PID"}.json`; a.click();
    showToast("FHIR R4 JSON exported successfully!");
  };

  // New Patient Form
  const [newPatientForm, setNewPatientForm] = useState({
    fullName: "", gender: "Female", dob: "1998-01-01", age: "26", abhaId: "", phone: "", email: "", allergies: "", chronicConditions: ""
  });

  // Clinical Sub-tabs & Notes Map
  const clinicalTabs = [
    "Chief Complaint", "History of Present Illness", "Past Medical History", "Medications",
    "Allergies", "Family History", "Social History", "Review of Systems", "Examination",
    "Provisional Diagnosis", "Notes & Plan", "Prescription Builder"
  ];
  const [activeTab, setActiveTab] = useState("Chief Complaint");
  const [tabNotes, setTabNotes] = useState<{ [key: string]: string }>({
    "Chief Complaint": "High grade fever with associated weakness since 5 days. Severe headache and body pain.",
    "History of Present Illness": "High temperature recorded up to 102°F at night.",
    "Past Medical History": "No major past surgical hospitalizations.",
    "Medications": "Tab Paracetamol taken occasionally.",
    "Allergies": "Aspirin-induced dyspepsia.",
    "Family History": "Father: Hypertensive; Mother: Healthy.",
    "Social History": "Non-smoker.",
    "Review of Systems": "No vomiting, no rash, mild nausea.",
    "Examination": "Vitals: Temp 100.4 F, Pulse 98 bpm, BP 120/80 mmHg.",
    "Provisional Diagnosis": "Suspected Acute Viral Pyrexia.",
    "Notes & Plan": "Hydration, antipyretics, review after 3 days."
  });

  // Dictation State
  const [inputMode, setInputMode] = useState<"Type" | "Speak">("Speak");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  const isPediatric = parseInt(selectedPatient?.age || "25") < 12;

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiData, setAiData] = useState({
    chiefComplaint: "High grade fever with associated weakness",
    duration: "5 days",
    associatedSymptoms: ["Fever / Pyrexia", "Elevated Temperature", "Headache / Cephalea", "Body Pain / Myalgia"],
    absentSymptoms: ["No cough", "No rash"],
    icd11Code: "1D20 (Dengue Suspect)",
    snomedCode: "386661006",
    drugInteractionAlert: "CRITICAL: Patient has documented Aspirin sensitivity. Avoid NSAIDs. Use Paracetamol with PPI cover.",
    foodInteractionAlert: "DIETARY CAUTION: Take Paracetamol with lukewarm water. Avoid milk or calcium-rich food within 2 hours if on antibiotics.",
    missingInfo: [
      "Severity of fever (exact peak temperature)", "Type of fever (continuous / intermittent)",
      "Any nausea, vomiting or abdominal pain?", "Any recent travel or mosquito exposure?"
    ],
    suggestedQuestions: [
      "How high did the thermometer show?", "Is the fever continuous or does it spike at night?", "Are you experiencing any chills or sweating?"
    ],
    provisionalDiagnosis: "Viral Pyrexia (ICD-11: 1D20)",
    treatmentPlan: [
      "1. Tab. Paracetamol 650mg TDS after food for 3 days", "2. Cap. Pantoprazole 40mg once daily before breakfast",
      "3. Adequate oral hydration & bed rest", "4. Complete Blood Count (CBC) with Platelet count if fever persists > 4 days"
    ]
  });

  // Multilingual Rx Translations
  const rxTranslations = {
    en: {
      diagnosis: aiData.provisionalDiagnosis,
      plan: aiData.treatmentPlan,
      speech: `Prescription for ${selectedPatient?.fullName || "Patient"}. Take Paracetamol 650mg 3 times daily after food for 3 days. Take Pantoprazole before breakfast. Drink adequate fluids.`
    },
    bn: {
      diagnosis: isPediatric ? "শিশুদের তীব্র জ্বর ও দুর্বলতা সিন্ড্রোম" : "তীব্র ভাইরাল জ্বর (ডেঙ্গু সতর্কতা সহ)",
      plan: isPediatric
        ? ["১. প্যারাসিটামল সিরাপ (২৫০মিগ্রা/৫মিলি) - ৫ মিলি দিনে ৩ বার খাবারের পর ৩ দিন", "২. ওআরএস বা পর্যাপ্ত পানি ও তরল খাবার পান করান", "৩. জ্বর ১০১ ডিগ্রির বেশি হলে জলপট্টি দিন"]
        : ["১. প্যারাসিটামল ৬৫০মিগ্রা ট্যাবলেট - দিনে ৩ বার খাবারের পর ৩ দিন", "২. প্যান্টোপ্রাজল ৪০মিগ্রা ক্যাপসুল - সকালে খালি পেটে ১ বার খাবার আগে", "৩. পর্যাপ্ত পানি ও তরল খাদ্য গ্রহণ এবং বিশ্রাম নিন", "৪. জ্বর ৪ দিনের বেশি থাকলে রক্ত পরীক্ষা (CBC ও প্লেটলেট) করান"],
      speech: `${selectedPatient?.fullName || "রোগী"} এর প্রেসক্রিপশন। প্যারাসিটামল ৬৫০ ট্যাবলেট দিনে ৩ বার খাবারের পর ৩ দিন খান। প্যান্টোপ্রাজল সকালে খালি পেটে খান। প্রচুর জল ও তরল খাবার খান।`
    },
    hi: {
      diagnosis: isPediatric ? "बाल तीव्र ज्वर सिंड्रोम" : "तीव्र वायरल बुखार ( डेंगू संदिग्ध)",
      plan: isPediatric
        ? ["१. पैरासिटामोल सिरप (250mg/5ml) - ५ मिली दिन में ३ बार खाने के बाद ३ दिन", "२. ओआरएस और पर्याप्त तरल पदार्थ पिलाएं", "३. १०१ डिग्री से अधिक बुखार होने पर गीली पट्टी रखें"]
        : ["१. पैरासिटामोल ६५० मिलीग्राम गोली - दिन में ३ बार खाने के बाद ३ दिन", "२. पैंटोप्राजोल ४० मिलीग्राम कैप्सूल - रोज सुबह नाश्ते से पहले खाली पेट", "३. पर्याप्त मात्रा में पानी पिएं और आराम करें", "४. ४ दिन से अधिक बुखार रहने पर सीबीसी और प्लेटलेट जांच कराएं"],
      speech: `${selectedPatient?.fullName || "मरीज"} की पर्ची। पैरासिटामोल ६५० गोली दिन में तीन बार खाने के बाद लें। पैंटोप्राजोल सुबह खाली पेट लें। खूब पानी पिएं और आराम करें।`
    }
  };

  const speakRx = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showToast("Speech synthesis not supported in this browser."); return;
    }
    if (isSpeakingRx) { window.speechSynthesis.cancel(); setIsSpeakingRx(false); return; }
    const utterance = new SpeechSynthesisUtterance(rxTranslations[rxLanguage].speech);
    utterance.lang = rxLanguage === "bn" ? "bn-IN" : rxLanguage === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9; utterance.onend = () => setIsSpeakingRx(false); utterance.onerror = () => setIsSpeakingRx(false);
    window.speechSynthesis.speak(utterance); setIsSpeakingRx(true);
    showToast(`Reading prescription out loud in ${rxLanguage.toUpperCase()}!`);
  };

  // System Settings Switches
  const [moduleSettings, setModuleSettings] = useState({
    aiCaseSummary: true, cds: true, multilingual: true, icd11Coder: true, drugInteraction: true, auditLogging: true
  });
  const [aiModelVersion, setAiModelVersion] = useState("HealthPulse v2.1 (Clinical Gemini Fine-tuned)");
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  // Role Permissions
  const [permissions, setPermissions] = useState({
    Doctor: { view: true, edit: true, generateData: true, generateReport: true },
    Staff: { view: true, edit: false, generateData: false, generateReport: false },
    Nurse: { view: true, edit: false, generateData: false, generateReport: false },
    Patient: { view: true, edit: false, generateData: false, generateReport: false },
    Admin: { view: true, edit: true, generateData: true, generateReport: true }
  });

  // Audit Logs
  const [auditSearch, setAuditSearch] = useState("");
  const [auditRoleFilter, setAuditRoleFilter] = useState("All");
  const [auditLogs, setAuditLogs] = useState([
    { action: "Chest X-Ray Analyzed by AI", user: "Dr. Ananya Sharma", role: "Doctor", patientId: "PID-2024-00125", time: "Today, 01:10 PM" },
    { action: "AI Nurse Follow-Up Relapse Check", user: "AI Nurse Bot", role: "System", patientId: "PID-2024-00125", time: "Today, 12:55 PM" },
    { action: "Multilingual Voice Rx Synthesized", user: "Dr. Ananya Sharma", role: "Doctor", patientId: "PID-2024-00125", time: "Today, 12:40 PM" },
    { action: "Telemedicine Virtual Consult Connected", user: "Dr. Ananya Sharma", role: "Doctor", patientId: "PID-2024-00125", time: "Today, 11:20 AM" },
    { action: "Instant QR Kiosk Check-In", user: "Reception Desk", role: "Staff", patientId: "PID-2024-00124", time: "Today, 09:30 AM" }
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(""), 3500); };

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition(); recognizer.continuous = true; recognizer.interimResults = false;
      recognizer.onresult = (event: any) => {
        let chunk = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) chunk += event.results[i][0].transcript + " "; }
        if (chunk) setTabNotes((prev) => ({ ...prev, [activeTab]: (prev[activeTab] ? prev[activeTab] + " " : "") + chunk.trim() }));
      };
      recognizer.onerror = () => { setIsRecording(false); clearInterval(timerRef.current); };
      recognizer.onend = () => { setIsRecording(false); clearInterval(timerRef.current); };
      recognitionRef.current = recognizer;
    }
  }, [activeTab]);

  const toggleRecording = () => {
    if (!recognitionRef.current) { alert("Please use Google Chrome for Speech-to-Text Dictation."); return; }
    if (isRecording) {
      recognitionRef.current.stop(); setIsRecording(false); clearInterval(timerRef.current);
    } else {
      recognitionRef.current.lang = "en-IN";
      try {
        recognitionRef.current.start(); setIsRecording(true); setRecordingSeconds(0);
        timerRef.current = setInterval(() => { setRecordingSeconds((sec) => sec + 1); }, 1000);
      } catch (err) { console.error("Recording error:", err); }
    }
  };

  // Safe AI Analysis Handler
  const handleRunAI = async () => {
    setLoadingAI(true);
    const combinedNotes = clinicalTabs.map((t) => `${t}: ${tabNotes[t]}`).join("\n");
    const extractedKeywords = parseClinicalKeywords(combinedNotes);

    try {
      const res = await axios.post("https://healthpulse-4d9z.onrender.com/api/clinical/analyze", { patient_id: 1, narrative: combinedNotes, language: "en-IN" }, { timeout: 2000 });
      if (res.data) {
        setAiData((prev) => ({
          ...prev,
          chiefComplaint: res.data.structured_info?.chief_complaint || extractedKeywords[0] || "Fever",
          duration: res.data.structured_info?.duration || "5 days",
          associatedSymptoms: extractedKeywords,
          provisionalDiagnosis: res.data.clinical_decision_support?.differential_considerations?.[0] || (isPediatric ? "Pediatric Acute Febrile Syndrome" : "Viral Pyrexia (ICD-11: 1D20)")
        }));
      }
    } catch (e) {
      setAiData((prev) => ({
        ...prev, chiefComplaint: extractedKeywords[0] || "Fever", associatedSymptoms: extractedKeywords,
        provisionalDiagnosis: isPediatric ? "Pediatric Acute Febrile Syndrome" : "Viral Pyrexia (ICD-11: 1D20)"
      }));
    } finally {
      setLoadingAI(false); setCurrentScreen("suggestions"); showToast("Deep Clinical Safety & Differential Analysis Complete!");
    }
  };

  const parseClinicalKeywords = (text: string) => {
    const symptomDictionary: { [key: string]: string } = {
      fever: "Fever / Pyrexia", temperature: "Elevated Temperature", headache: "Headache / Cephalea",
      pain: "Body Pain / Myalgia", weakness: "Weakness / Fatigue", cough: "Cough", cold: "Cold / Coryza",
      vomit: "Vomiting", nausea: "Nausea", rash: "Cutaneous Rash"
    };
    const lower = text.toLowerCase(); const detected: string[] = [];
    Object.keys(symptomDictionary).forEach((k) => { if (lower.includes(k) && !detected.includes(symptomDictionary[k])) detected.push(symptomDictionary[k]); });
    return detected.length > 0 ? detected : ["General Malaise"];
  };

  const handleFinalizeCase = async () => {
    try {
      await axios.post("https://healthpulse-4d9z.onrender.com/api/encounters/finalize", {
        patient_id: 1, raw_narrative: tabNotes["Chief Complaint"], structured_info: aiData,
        missing_information: { elements: aiData.missingInfo }, decision_support: { diagnosis: aiData.provisionalDiagnosis, treatment: aiData.treatmentPlan }
      }, { timeout: 2000 });
    } catch (e) {}
    showToast("Case Saved to EHR & ABHA Registry!"); setCurrentScreen("report");
  };

  // X-Ray Analysis Simulator
  const handleXRayScan = (e: any) => {
    const file = e.target.files?.[0]; if (!file) return;
    setXRayScanning(true); setXRayResult(null);
    setTimeout(() => {
      setXRayScanning(false);
      setXRayResult({
        findings: "Subtle bilateral lower lobe opacity detected. No active pneumothorax or pleural effusion.",
        confidence: "82% Probability of Viral Bronchopneumonia",
        recommendation: "Prescribe Azithromycin / Amoxicillin if bacterial superinfection suspected; monitor SpO2."
      });
      setTabNotes((prev) => ({ ...prev, "Examination": (prev["Examination"] ? prev["Examination"] + "\n\n" : "") + "AI CHEST X-RAY: 82% Lower Lobe Viral Opacity" }));
      showToast("X-Ray analyzed! Clinical findings added to Examination.");
    }, 2000);
  };

  // AI Nurse Bot Response Handler
  const handleNurseSend = (e: React.FormEvent) => {
    e.preventDefault(); if (!nurseInput.trim()) return;
    const userText = nurseInput; setNurseMessages((prev) => [...prev, { sender: "patient", text: userText }]); setNurseInput("");
    setTimeout(() => {
      let botReply = "Thank you for the update. Keep taking your prescribed medicines and drink plenty of ORS water.";
      if (userText.toLowerCase().includes("fever") || userText.toLowerCase().includes("vomit") || userText.toLowerCase().includes("pain")) {
        botReply = "⚠️ Warning: Persistent fever or nausea detected. An emergency alert has been sent to Dr. Ananya Sharma's OPD dashboard.";
        showToast("Relapse Alert Sent to Attending Physician!");
      }
      setNurseMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 1000);
  };

  // QR Check-in Simulator
  const handleSimulateQrScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false); setShowQrCheckinModal(false);
      const scannedPat = patientList[0]; setSelectedPatient(scannedPat);
      showToast(`ABHA QR Verified! ${scannedPat.fullName} checked into Queue.`);
      setCurrentScreen("dashboard");
    }, 1500);
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setAuthError("");
    const demoCredentials: { [key: string]: { email: string; pass: string; role: string; name: string } } = {
      doctor: { email: "dr.ananya@healthpulse.com", pass: "doctor123", role: "doctor", name: "Dr. Ananya Sharma" },
      patient: { email: "priya.das@healthpulse.com", pass: "patient123", role: "patient", name: "Priya Das" },
      admin: { email: "admin@healthpulse.com", pass: "admin123", role: "admin", name: "System Admin" }
    };
    const target = demoCredentials[authRoleTab];
    if ((authEmail.trim().toLowerCase() === target.email.toLowerCase() || authEmail.trim() === "9876543210") && authPassword === target.pass) {
      setCurrentUser({ email: target.email, role: target.role, name: target.name }); setIsLoggedIn(true);
      if (target.role === "patient") {
        const foundP = patientList.find((p) => p.email.toLowerCase() === target.email.toLowerCase()) || patientList[1];
        setSelectedPatient(foundP); setCurrentScreen("patient-portal");
      } else if (target.role === "admin") { setCurrentScreen("dashboard"); } else { setCurrentScreen("dashboard"); }
      showToast(`Welcome, ${target.name}! Logged in as ${target.role.toUpperCase()}`);
    } else { setAuthError(`Invalid credentials for ${authRoleTab.toUpperCase()}. Use pre-configured demo values.`); }
  };

  const handleAddNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.fullName) { showToast("Please provide patient name"); return; }
    const generatedAbha = newPatientForm.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: `PID-2024-${Math.floor(10000 + Math.random() * 90000)}`, fullName: newPatientForm.fullName, gender: newPatientForm.gender, dob: newPatientForm.dob, age: newPatientForm.age, abhaId: generatedAbha,
      phone: newPatientForm.phone || "+91 98000 00000", email: newPatientForm.email || `${newPatientForm.fullName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      allergies: newPatientForm.allergies || "None", chronicConditions: newPatientForm.chronicConditions || "None",
      recentDiagnosis: "Pending Consultation", appointmentTime: "11:30 AM", triageStatus: "Stable"
    };
    const updated = [newEntry, ...patientList]; updatePatientsPersistence(updated); setSelectedPatient(newEntry);
    showToast(`Patient ${newEntry.fullName} added successfully! Starting case...`); setCurrentScreen("casetaking");
  };

  const handleStartCaseForPatient = (pat: any) => {
    setSelectedPatient(pat); const patIsChild = parseInt(pat.age || "25") < 12;
    setTabNotes({
      "Chief Complaint": `Clinical evaluation for ${pat.fullName}. Symptoms presented.`, "History of Present Illness": "Recorded duration 3-5 days.",
      "Past Medical History": pat.chronicConditions || "None", "Medications": "None ongoing", "Allergies": pat.allergies || "No known drug allergies",
      "Family History": "Non-contributory", "Social History": patIsChild ? "Pediatric patient, primary school student." : "Non-smoker",
      "Review of Systems": "Normal", "Examination": `Vitals: Temp ${vitals.temperature} F, Pulse ${vitals.pulse} bpm, BP ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg.`,
      "Provisional Diagnosis": pat.recentDiagnosis || "Under Clinical Evaluation", "Notes & Plan": patIsChild ? "Pediatric syrup dosage calculation applied." : "Hydration and symptomatic therapy."
    });
    if (patIsChild) {
      setAiData((prev) => ({
        ...prev, provisionalDiagnosis: "Pediatric Acute Febrile Syndrome",
        treatmentPlan: ["1. Syp. Paracetamol (250mg/5ml) - 5ml TDS for 3 days (Weight adjusted: 15mg/kg/dose)", "2. Oral Rehydration Solution (ORS) 200ml sips frequently", "3. Tepid water sponging if temp > 101°F", "4. Immediate pediatrician review if lethargy occurs"]
      }));
    }
    setCurrentScreen("casetaking"); showToast(`Loaded clinical chart for ${pat.fullName}`);
  };

  const themeClass = darkMode ? "bg-slate-950 text-slate-100" : "bg-[#F4F7FB] text-slate-800";
  const cardTheme = darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800";
  const headerTheme = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";

  // =========================================================================
  // 1. AUTHENTICATION & ONBOARDING SCREENS
  // =========================================================================
  if (!isLoggedIn) {
    if (currentScreen === "signup") {
      return (
        <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${themeClass}`}>
          <div className={`max-w-md w-full rounded-3xl shadow-xl overflow-hidden border ${cardTheme}`}>
            <div className="bg-[#0B4EA2] p-6 text-center"><h1 className="text-2xl font-black tracking-wider text-white">HealthPulse</h1><p className="text-blue-200 text-sm mt-1">Create your new account</p></div>
            <div className="p-6">
              <div className={`flex p-1 rounded-xl mb-6 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                <button onClick={() => setSignupRole('patient')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition ${signupRole === 'patient' ? 'bg-white text-[#0B4EA2] shadow-sm dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}><User size={16} /> Patient</button>
                <button onClick={() => setSignupRole('doctor')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition ${signupRole === 'doctor' ? 'bg-white text-[#0B4EA2] shadow-sm dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}><Stethoscope size={16} /> Doctor</button>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                  <div className="relative"><User className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" placeholder={signupRole === 'doctor' ? "Dr. Full Name" : "Your Full Name"} className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email or Phone Number</label>
                  <div className="relative"><Mail className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" placeholder="Enter email or phone number" className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type={showPassword ? "text" : "password"} placeholder="Create a password" className={`w-full pl-10 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-slate-400 focus:outline-none">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
                {signupRole === 'patient' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 mb-1">Age</label><input type="number" placeholder="e.g. 25" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                        <select className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
                      </div>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">ABHA ID (Optional)</label><input type="text" placeholder="e.g. 12-3456-7890-1234" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div>
                  </>
                )}
                {signupRole === 'doctor' && (
                  <>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Specialization</label><input type="text" placeholder="e.g. Cardiologist" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Medical Reg. Number</label><div className="relative"><Hash className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" placeholder="WBMC-12345" className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Clinic / Hospital Name</label><div className="relative"><Building className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" placeholder="Hospital Name" className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div></div>
                  </>
                )}
                <button className="w-full bg-[#0B4EA2] text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition mt-4 shadow-md">Create Account</button>
              </form>
              <div className="mt-6 text-center border-t border-slate-500/20 pt-4">
                <p className="text-sm text-slate-500 font-semibold">Already have an account? <button onClick={() => setCurrentScreen("login")} className="text-[#0B4EA2] font-bold hover:underline">Log in here</button></p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentScreen === "forgot-password") {
      return (
        <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${themeClass}`}>
          <div className={`max-w-md w-full rounded-3xl shadow-xl overflow-hidden border ${cardTheme}`}>
            <div className="bg-[#0B4EA2] p-6 text-center"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><Key className="text-white" size={24}/></div><h1 className="text-xl font-black tracking-wider text-white">Reset Password</h1><p className="text-blue-200 text-sm mt-1">We'll send a secure OTP to your email or SMS</p></div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast("OTP sent to your registered email/phone!"); setCurrentScreen("login"); }}>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Registered Email or Phone</label>
                  <div className="relative"><User className="absolute left-3 top-2.5 text-slate-400" size={16} /><input type="text" required placeholder="Enter your email or phone number" className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#0B4EA2] ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`} /></div>
                </div>
                <button type="submit" className="w-full bg-[#0B4EA2] text-white font-bold py-3 rounded-xl hover:bg-blue-800 mt-4 shadow-md transition">Send Reset Link</button>
              </form>
              <div className="mt-6 text-center"><button onClick={() => setCurrentScreen("login")} className="text-sm text-slate-500 font-semibold hover:text-[#0B4EA2] flex items-center justify-center gap-1 mx-auto"><ArrowLeft size={14}/> Back to Login</button></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${themeClass}`}>
        <div className={`rounded-3xl shadow-xl border w-full max-w-md p-8 ${cardTheme}`}>
          <div className="text-center mb-6"><div className="inline-flex items-center gap-2 text-2xl font-black text-[#0B4EA2] mb-1"><Activity /> HealthPulse</div><p className="text-xs text-slate-400">Smart Case Taking & Clinical Decision Support System</p></div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button onClick={() => { setAuthRoleTab("doctor"); setAuthEmail("dr.ananya@healthpulse.com"); setAuthPassword("doctor123"); }} className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition ${authRoleTab === "doctor" ? "bg-[#0B4EA2] text-white border-[#0B4EA2]" : darkMode ? "bg-slate-800" : "bg-slate-50"}`}><Stethoscope size={20} /><span className="text-[11px] font-black">DOCTOR</span></button>
            <button onClick={() => { setAuthRoleTab("patient"); setAuthEmail("priya.das@healthpulse.com"); setAuthPassword("patient123"); }} className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition ${authRoleTab === "patient" ? "bg-[#0B4EA2] text-white border-[#0B4EA2]" : darkMode ? "bg-slate-800" : "bg-slate-50"}`}><Users size={20} /><span className="text-[11px] font-black">PATIENT</span></button>
            <button onClick={() => { setAuthRoleTab("admin"); setAuthEmail("admin@healthpulse.com"); setAuthPassword("admin123"); }} className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition ${authRoleTab === "admin" ? "bg-[#0B4EA2] text-white border-[#0B4EA2]" : darkMode ? "bg-slate-800" : "bg-slate-50"}`}><ShieldCheck size={20} /><span className="text-[11px] font-black">ADMIN</span></button>
          </div>
          {authError && <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"><AlertTriangle size={15} /><span>{authError}</span></div>}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1">Email or Phone Number</label>
              <div className="relative"><User className="absolute left-3 top-3 text-slate-400" size={15} /><input type="text" placeholder="Enter email or phone" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className={`w-full text-xs pl-9 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"}`} /></div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1"><label className="block text-xs font-semibold">Password</label><button type="button" onClick={() => setCurrentScreen("forgot-password")} className="text-[10px] font-bold text-[#0B4EA2] hover:underline">Forgot Password?</button></div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={15} />
                <input type={showPassword ? "text" : "password"} required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className={`w-full text-xs pl-9 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-[#0B4EA2] text-white font-bold rounded-xl hover:bg-blue-700 shadow-md text-sm mt-2">Sign In as {authRoleTab.toUpperCase()}</button>
          </form>
          <div className="mt-4 text-center"><p className="text-xs text-slate-500 font-semibold">Don't have an account? <button onClick={() => setCurrentScreen("signup")} className="text-[#0B4EA2] hover:underline font-bold">Sign up here</button></p></div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. PATIENT PORTAL FLOW
  // =========================================================================
  if (currentUser?.role === "patient") {
    if (currentScreen === "patient-view-rx") {
      const playPrescriptionAudio = () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); const rx = rxTranslations[patientPortalLang]; const pName = selectedPatient?.fullName || "Patient";
          let textToRead = ""; let langCode = "en-IN";
          if (patientPortalLang === "bn") { textToRead = `নমস্কার ${pName}। আপনার রোগ নির্ণয় হলো: ${rx.diagnosis}। ওষুধের নিয়মাবলি হলো: ${rx.plan.join("। ")}। দ্রুত সুস্থ হয়ে উঠুন।`; langCode = "bn-IN"; } 
          else if (patientPortalLang === "hi") { textToRead = `नमस्ते ${pName}। आपकी बीमारी है: ${rx.diagnosis}। आपका इलाज है: ${rx.plan.join("। ")}। जल्दी ठीक हो जाईये।`; langCode = "hi-IN"; } 
          else { textToRead = `Hello ${pName}. Your diagnosis is: ${rx.diagnosis}. Your treatment plan is: ${rx.plan.join(". ")}. Get well soon.`; langCode = "en-IN"; }
          const utterance = new SpeechSynthesisUtterance(textToRead); utterance.rate = 0.85; utterance.lang = langCode; window.speechSynthesis.speak(utterance);
        } else { alert("Sorry, your browser does not support text-to-speech."); }
      };

      return (
        <div className={`min-h-screen p-4 md:p-6 font-sans ${themeClass}`}>
          <div className={`max-w-4xl mx-auto mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm ${cardTheme}`}>
            <button onClick={() => setCurrentScreen("patient-portal")} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1.5"><ArrowLeft size={16} /> Back to My Patient Portal</button>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold">Language:</span>
                <select value={patientPortalLang} onChange={(e) => setPatientPortalLang(e.target.value as any)} className={`p-1.5 rounded-lg border text-xs font-semibold ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200"}`}>
                  <option value="bn">বাংলা (Bengali)</option><option value="hi">हिन्दी (Hindi)</option><option value="en">English</option>
                </select>
              </div>
              <button onClick={() => window.print()} className="text-xs font-semibold py-2 px-4 rounded-xl border hover:bg-slate-500/10 flex items-center gap-2"><Printer size={15} /> Print</button>
              <button onClick={() => window.print()} className="text-xs font-semibold py-2 px-4 rounded-xl bg-[#0B4EA2] text-white hover:bg-blue-700 flex items-center gap-2"><Download size={15} /> Download PDF</button>
              <button onClick={playPrescriptionAudio} className="text-xs font-semibold py-2 px-4 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-2 transition shadow-sm"><Volume2 size={15} /> Listen</button>
            </div>
          </div>
          <div className={`max-w-4xl mx-auto p-4 md:p-8 rounded-2xl border shadow-md printable-sheet space-y-5 ${cardTheme}`}>
            <div className="flex flex-col md:flex-row justify-between items-start border-b pb-4 gap-2">
              <div><h2 className="text-lg md:text-xl font-black tracking-wider text-[#0B4EA2]">CASE SUMMARY & PRESCRIPTION ({patientPortalLang.toUpperCase()})</h2><p className="text-xs text-slate-400">HealthPulse Clinical Decision System • Verified Electronic Health Record</p></div>
              <div className="text-left md:text-right text-xs text-slate-400"><p className="font-bold">Case ID: CS-249</p><p>Date: 01/06/2024</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b pb-4">
              <div className="space-y-1"><p><span className="text-slate-400">Patient Name :</span> <span className="font-bold">{selectedPatient?.fullName || "Patient"}</span></p><p><span className="text-slate-400">Age / Gender :</span> {selectedPatient?.age} Years / {selectedPatient?.gender}</p><p><span className="text-slate-400">ABHA Address :</span> <span className="font-mono font-bold text-blue-500">{selectedPatient?.abhaId}</span></p></div>
              <div className="space-y-1"><p className="font-bold">Recorded Vitals</p><p><span className="text-slate-400">Temperature :</span> {vitals.temperature} °F</p><p><span className="text-slate-400">Pulse :</span> {vitals.pulse} bpm</p><p><span className="text-slate-400">Blood Pressure :</span> {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</p></div>
            </div>
            <div className="space-y-4 text-xs">
              <div><h5 className="font-bold mb-1">Diagnosis</h5><p className="text-blue-500 font-bold text-sm">{rxTranslations[patientPortalLang].diagnosis}</p></div>
              <div>
                <h5 className="font-bold mb-1.5">Rx - Prescribed Treatment Plan</h5>
                <ul className="space-y-1 bg-slate-500/5 p-3 rounded-xl border border-slate-500/20 font-medium">{rxTranslations[patientPortalLang].plan.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            </div>
            <div className="flex justify-between items-end pt-8 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-lg bg-white shadow-xs"><QRCodeSVG value={`https://healthpulse-4d9z.onrender.com`} size={64} /></div>
                <div className="text-[10px] text-slate-400 leading-tight"><p className="font-bold text-slate-500">Digitally Verified EHR</p><p>Scan to verify authenticity on ABDM registry.</p></div>
              </div>
              <div className="text-center"><p className="font-serif italic text-base mb-0.5 text-blue-500">Dr. Ananya</p><p className="font-bold text-xs">Dr. Ananya Sharma</p></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen font-sans antialiased ${themeClass}`}>
        <header className={`h-auto md:h-16 py-3 md:py-0 border-b px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs ${headerTheme}`}>
          <div className="flex items-center gap-2 font-bold text-lg text-[#0B4EA2]"><Activity /> HealthPulse • Patient Portal</div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold hidden md:inline">Language:</span>
              <select value={patientPortalLang} onChange={(e) => setPatientPortalLang(e.target.value as any)} className={`p-1.5 rounded-lg border text-xs font-semibold ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200"}`}>
                <option value="bn">বাংলা (Bengali)</option><option value="hi">हिन्दी (Hindi)</option><option value="en">English</option>
              </select>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 text-amber-300" : "bg-slate-100 border-slate-200"}`}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
            {currentScreen !== "profile" && (<button onClick={() => setCurrentScreen("profile")} className="text-xs font-bold text-slate-500 hover:text-blue-500 flex items-center gap-1 border px-3 py-1.5 rounded-lg transition"><User size={14}/> Profile</button>)}
            <div className="text-right hidden sm:block"><p className="text-xs font-bold">{selectedPatient?.fullName}</p><p className="text-[10px] text-emerald-600 font-bold">ABHA Verified Patient</p></div>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">{selectedPatient?.fullName?.charAt(0) || "P"}</div>
            <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }} className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs font-semibold"><LogOut size={16} /> Logout</button>
          </div>
        </header>

        {currentScreen === "patient-portal" && (
          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 rounded-2xl border p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 ${cardTheme}`}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">{selectedPatient?.fullName?.charAt(0)}</div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-bold">{selectedPatient?.fullName}</h3><span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">ABHA Verified</span></div>
                  <p className="text-xs text-slate-400">ABHA ID: <span className="font-mono font-bold text-blue-500">{selectedPatient?.abhaId}</span></p>
                  <p className="text-xs text-slate-400">PID: {selectedPatient?.id} • Age: {selectedPatient?.age}, {selectedPatient?.gender}</p>
                  <div className="flex flex-wrap gap-2 md:gap-4 text-[11px] text-slate-400 pt-1"><span>✉ {selectedPatient?.email}</span><span>📞 {selectedPatient?.phone}</span></div>
                </div>
              </div>

              <div className={`rounded-2xl border p-4 md:p-6 shadow-sm space-y-2.5 ${cardTheme}`}>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Quick Actions</h4>
                <button onClick={() => setCurrentScreen("patient-view-rx")} className="w-full text-left p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-semibold flex items-center justify-between transition text-xs"><span>📄 View Digital Prescription</span><ChevronRight size={14} /></button>
                <button onClick={() => setShowHealthCardModal(true)} className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 font-semibold flex items-center justify-between transition text-xs"><span>💳 Digital Health ID Card</span><ChevronRight size={14} /></button>
                <button onClick={() => setShowNurseBotModal(true)} className="w-full text-left p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 font-semibold flex items-center justify-between transition text-xs"><span>🤖 AI Nurse Follow-Up Bot</span><ChevronRight size={14} /></button>
                <button onClick={() => setShowReminderModal(true)} className="w-full text-left p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-semibold flex items-center justify-between transition text-xs"><span>⏰ Medication Reminders</span><ChevronRight size={14} /></button>
                <button onClick={() => setShowBookModal(true)} className="w-full text-left p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-semibold flex items-center justify-between transition text-xs"><span>📅 Book Follow-Up</span><ChevronRight size={14} /></button>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 md:p-6 shadow-sm ${cardTheme}`}>
              <h4 className="font-bold text-sm mb-1">Chronological Medical Timeline</h4>
              <p className="text-xs text-slate-400 mb-6">Verified Electronic Health Records (ABDM Compliant)</p>
              <div className="space-y-6 border-l-2 border-blue-500/30 pl-4 md:pl-6 ml-2 md:ml-4">
                <div className="relative">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0B4EA2] absolute -left-[23px] md:-left-[31px] top-1 border-2 border-white ring-2 ring-blue-100"></span>
                  <p className="text-xs font-bold text-blue-500">TODAY - {rxTranslations[patientPortalLang].diagnosis}</p>
                  <p className="text-xs text-slate-400 mt-1">Attending Physician: Dr. Ananya Sharma.</p>
                  <div className="flex flex-wrap gap-2 md:gap-4 mt-2">
                    <button onClick={() => setCurrentScreen("patient-view-rx")} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"><Download size={12} /> View & Download Prescription</button>
                    <button onClick={() => setShowLabModal(true)} className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"><FileSpreadsheet size={12} /> View Lab Panel (CBC)</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Profile */}
        {currentScreen === "profile" && (
          <div className="max-w-3xl mx-auto p-4 md:p-8 mt-4">
             <button onClick={() => setCurrentScreen("patient-portal")} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1.5 mb-4"><ArrowLeft size={16} /> Back to Dashboard</button>
             <div className={`rounded-2xl border shadow-sm p-4 md:p-8 space-y-6 ${cardTheme}`}>
               <div className="flex items-center gap-4 border-b pb-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500 text-white font-black text-2xl md:text-3xl flex items-center justify-center flex-shrink-0">{currentUser?.name?.charAt(0) || "U"}</div>
                 <div><h2 className="text-lg md:text-xl font-bold">{currentUser?.name || "User"}</h2><p className="text-xs text-[#0B4EA2] font-bold uppercase tracking-wider">{currentUser?.role || "Patient"}</p><p className="text-xs text-slate-400 mt-1">{currentUser?.email || "email@healthpulse.com"}</p></div>
               </div>
               <form className="space-y-4 text-sm" onSubmit={(e) => { e.preventDefault(); showToast("Profile Details Updated Successfully!"); }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><label className="block text-xs font-bold mb-1 text-slate-500">Full Name</label><input type="text" defaultValue={currentUser?.name} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                   <div><label className="block text-xs font-bold mb-1 text-slate-500">Contact Email</label><input type="email" defaultValue={currentUser?.email} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><label className="block text-xs font-bold mb-1 text-slate-500">Blood Group</label><input type="text" defaultValue="O+" className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                   <div><label className="block text-xs font-bold mb-1 text-slate-500">Emergency Contact</label><input type="text" placeholder="Phone Number" className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                 </div>
                 <div className="pt-4 flex justify-end"><button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Save size={16}/> Save Changes</button></div>
               </form>
             </div>
          </div>
        )}

        {/* Modal: Health Card */}
        {showHealthCardModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
              <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-sm flex items-center gap-2 text-amber-500"><CreditCard size={16} /> Official ABHA Digital Health Card</h3><button onClick={() => setShowHealthCardModal(false)} className="text-slate-400"><X size={18} /></button></div>
              <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-[#0B4EA2] via-blue-700 to-indigo-900 text-white shadow-xl space-y-4 border border-blue-400/30">
                <div className="flex justify-between items-start"><div><p className="text-[10px] tracking-widest uppercase font-bold text-blue-200">National Health Authority</p><h4 className="text-sm md:text-base font-black tracking-wider">Ayushman Bharat (ABHA)</h4></div><span className="text-[10px] md:text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Verified</span></div>
                <div className="flex justify-between items-center pt-2">
                  <div><p className="text-xs text-blue-200">Patient Name</p><p className="text-sm font-bold">{selectedPatient?.fullName}</p><p className="text-[10px] md:text-[11px] text-blue-200 mt-1 font-mono">ID: {selectedPatient?.id}</p></div>
                  <div className="p-1.5 bg-white rounded-xl"><QRCodeSVG value={`ABHA-CARD-${selectedPatient?.abhaId}`} size={60} /></div>
                </div>
                <div className="pt-2 border-t border-white/20 flex justify-between items-center text-[9px] md:text-[10px] font-mono"><span>ABHA: {selectedPatient?.abhaId}</span><span>DOB: {selectedPatient?.dob}</span></div>
              </div>
              <button onClick={() => window.print()} className="w-full py-2.5 bg-[#0B4EA2] text-white font-bold rounded-xl text-xs hover:bg-blue-700 flex items-center justify-center gap-2"><Printer size={14} /> Print Digital Health Card</button>
            </div>
          </div>
        )}

        {/* Modal: AI Nurse */}
        {showNurseBotModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
              <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-sm flex items-center gap-2 text-purple-500"><Bot size={18} /> Post-Consultation AI Nurse Bot</h3><button onClick={() => setShowNurseBotModal(false)} className="text-slate-400"><X size={18} /></button></div>
              <div className="h-64 overflow-y-auto space-y-2 p-2 bg-slate-500/5 rounded-2xl text-xs">
                {nurseMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "bot" ? "justify-start" : "justify-end"}`}>
                    <div className={`p-2.5 rounded-xl max-w-[85%] ${m.sender === "bot" ? "bg-[#0B4EA2] text-white" : "bg-purple-600 text-white"}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleNurseSend} className="flex gap-2">
                <input type="text" placeholder="Type your symptoms..." value={nurseInput} onChange={(e) => setNurseInput(e.target.value)} className={`flex-1 p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-purple-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"}`} />
                <button type="submit" className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700"><Send size={15} /></button>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reminders */}
        {showReminderModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
              <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-sm flex items-center gap-2">⏰ Active Medication Reminders</h3><button onClick={() => setShowReminderModal(false)} className="text-slate-400"><X size={18} /></button></div>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-500/5 rounded-xl border flex justify-between items-center">
                  <div><p className="font-bold">Tab. Paracetamol 650mg</p><p className="text-slate-400">Morning (08:30 AM) • After Food</p></div>
                  <input type="checkbox" checked={reminderToggles.morning} onChange={(e) => setReminderToggles({ ...reminderToggles, morning: e.target.checked })} className="w-4 h-4 text-blue-600 cursor-pointer" />
                </div>
              </div>
              <button onClick={() => { setShowReminderModal(false); showToast("Medication alarms updated on your device!"); }} className="w-full py-2.5 bg-[#0B4EA2] text-white font-bold rounded-xl text-xs hover:bg-blue-700">Save Alarm Preferences</button>
            </div>
          </div>
        )}

        {/* Dynamic Booking Modal */}
        {showBookModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
              <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-sm flex items-center gap-2">📅 Book Follow-up Appointment</h3><button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-700"><X size={18} /></button></div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Select Consulting Physician *</label>
                  <select value={bookDoctor} onChange={(e) => setBookDoctor(e.target.value)} className={`w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}>
                    <option value="">-- Choose Doctor --</option><option value="Dr. Ananya Sharma, MD (General Medicine)">Dr. Ananya Sharma - General Medicine</option><option value="Dr. Vikram Singh (Neurology)">Dr. Vikram Singh - Neurology</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block font-semibold mb-1">Select Date</label><input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} className={`w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-transparent border-slate-200"}`} /></div>
                  <div>
                    <label className="block font-semibold mb-1">Select Slot</label>
                    <select value={bookTime} onChange={(e) => setBookTime(e.target.value)} className={`w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}>
                      <option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={() => { if(!bookDoctor) return showToast("Please select a doctor"); setShowBookModal(false); showToast(`Appointment booked with ${bookDoctor.split('-')[0]}!`); }} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition">Confirm Appointment</button>
            </div>
          </div>
        )}

        {/* Modal: Lab Results */}
        {showLabModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
              <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-sm flex items-center gap-2">🔬 Laboratory Blood Panel (CBC)</h3><button onClick={() => setShowLabModal(false)} className="text-slate-400"><X size={18} /></button></div>
              <div className="space-y-2 text-xs divide-y divide-slate-500/20">
                <div className="flex justify-between py-1.5"><span className="text-slate-400 font-medium">Hemoglobin (Hb)</span><span className="font-bold">12.8 g/dL</span></div>
                <div className="flex justify-between py-1.5"><span className="text-slate-400 font-medium">Platelet Count</span><span className="font-bold text-emerald-500">2.1 Lakhs /mcL</span></div>
              </div>
              <button onClick={() => { setShowLabModal(false); showToast("Lab report downloaded as PDF"); }} className="w-full py-2.5 bg-[#0B4EA2] text-white font-bold rounded-xl text-xs hover:bg-blue-700">Download Verified Lab Report</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. DOCTOR / ADMIN / SHARED PROFILE WORKSPACE
  // =========================================================================
  return (
    <div className={`flex flex-col md:flex-row h-screen font-sans antialiased overflow-hidden ${themeClass}`}>
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in no-print"><CheckCircle size={16} className="text-emerald-400" /><span>{toastMessage}</span></div>
      )}

      {/* Dynamic Sidebar */}
      <aside className="w-full md:w-64 h-auto md:h-full bg-[#0B4EA2] text-white flex flex-col justify-between flex-shrink-0 shadow-lg no-print overflow-y-auto">
        <div>
          <div className="p-4 md:p-5 flex items-center gap-3 border-b border-blue-800/80">
            <div className="w-8 h-8 rounded-lg bg-white text-[#0B4EA2] flex items-center justify-center font-black shadow-inner">✚</div>
            <div>
              <h1 className="font-bold text-base md:text-lg leading-tight tracking-tight">{currentUser?.role === "admin" ? "Admin Console" : "HealthPulse"}</h1>
              <p className="text-[10px] md:text-[11px] text-blue-200 uppercase tracking-widest font-medium">{currentUser?.role === "admin" ? "EHR Governance" : "Smart Case Taking"}</p>
            </div>
          </div>

          <nav className="p-3 flex overflow-x-auto md:flex-col gap-2 md:gap-0 space-y-0 md:space-y-1 text-sm font-medium">
            {currentUser?.role === "doctor" && (
              <>
                <button onClick={() => setCurrentScreen("dashboard")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "dashboard" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><LayoutDashboard size={18} /> Dashboard & Triage</button>
                <button onClick={() => setCurrentScreen("patients")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "patients" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><Users size={18} /> Patients Directory</button>
                <button onClick={() => setCurrentScreen("appointments")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "appointments" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><Calendar size={18} /> Appointments Queue</button>
                <button onClick={() => setCurrentScreen("casetaking")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${["casetaking", "suggestions"].includes(currentScreen) ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><ClipboardList size={18} /> Case Taking & CDS</button>
                <button onClick={() => setCurrentScreen("history")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "history" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><FileText size={18} /> Clinical Records</button>
                <button onClick={() => setCurrentScreen("report")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "report" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><BarChart3 size={18} /> Generated Rx</button>
              </>
            )}

            {currentUser?.role === "admin" && (
              <>
                <button onClick={() => setCurrentScreen("dashboard")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "dashboard" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><LayoutDashboard size={18} /> Admin Overview</button>
                <button onClick={() => setCurrentScreen("user-management")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "user-management" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><Users size={18} /> User Management</button>
                <button onClick={() => setCurrentScreen("inventory")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "inventory" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><Pill size={18} /> Pharmacy Inventory</button>
                <button onClick={() => setCurrentScreen("bed-management")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "bed-management" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><BedDouble size={18} /> Bed & Staff Mgmt</button>
                <button onClick={() => setCurrentScreen("announcements")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "announcements" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><Megaphone size={18} /> Announcements</button>
                <button onClick={() => setCurrentScreen("audit")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "audit" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><ShieldCheck size={18} /> Audit Log Viewer</button>
                <button onClick={() => setCurrentScreen("settings")} className={`w-max md:w-full flex-shrink-0 flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg transition ${currentScreen === "settings" ? "bg-white/15 text-white font-bold" : "text-blue-100 hover:bg-white/5"}`}><Settings size={18} /> System Settings</button>
              </>
            )}
          </nav>
        </div>

        {/* প্রোফাইল ও লগ-আউট অপশন মোবাইলে স্ক্রিনের নিচে ফিক্সড করে দেওয়া হয়েছে */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:relative md:z-auto p-3 md:p-4 border-t border-blue-800 bg-[#083D80] flex items-center justify-between w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentScreen("profile")}>
            <div className="w-9 h-9 rounded-full bg-blue-200 text-[#0B4EA2] font-bold flex items-center justify-center text-sm border-2 border-white shadow-sm">{currentUser?.name?.charAt(0) || "U"}</div>
            <div><p className="text-xs font-bold leading-tight hover:underline">{currentUser?.name || "User"}</p><p className="text-[10px] text-blue-300 capitalize">{currentUser?.role}</p></div>
          </div>
          <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); setCurrentScreen("login"); }} className="text-blue-300 hover:text-white"><LogOut size={16} /></button>
        </div>
      </aside>

      {/* মোবাইলের প্রোফাইল বারের জন্য নিচে pb-20 প্যাডিং দেওয়া হয়েছে */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-20 md:pb-0">
        <header className={`h-auto md:h-16 py-3 md:py-0 border-b px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 flex-shrink-0 shadow-xs no-print ${headerTheme}`}>
          <div>
            <h2 className="text-sm md:text-base font-bold">{currentUser?.role === "admin" ? "HealthPulse Governance Desk" : "HealthPulse Clinical Decision Support"}</h2>
            <p className="text-[11px] md:text-xs text-slate-400">{currentUser?.role === "admin" ? "ABDM, HIPAA Compliance & Access Records" : `Active Patient: ${selectedPatient?.fullName || "Patient"} (${selectedPatient?.id || "PID"})`}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-1.5 md:p-2 rounded-xl border transition ${darkMode ? "bg-slate-800 border-slate-700 text-amber-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}>{darkMode ? <Sun size={14} /> : <Moon size={14} />}</button>
            {currentUser?.role === "doctor" && (
              <>
                <button onClick={() => setShowXRayModal(true)} className="text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1.5 bg-cyan-500/10 text-cyan-600 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 flex items-center gap-1.5 transition"><Scan size={12} className="md:w-[14px] md:h-[14px]"/> <span className="hidden sm:inline">AI Chest</span> X-Ray</button>
                <button onClick={() => setShowQrCheckinModal(true)} className="text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1.5 bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 flex items-center gap-1.5 transition"><QrCode size={12} className="md:w-[14px] md:h-[14px]"/> <span className="hidden sm:inline">Scan Patient ABHA</span> QR</button>
                <button onClick={() => setShowTeleModal(true)} className="text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1.5 bg-purple-500/10 text-purple-600 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 flex items-center gap-1.5 transition"><Video size={12} className="md:w-[14px] md:h-[14px]"/> Tele-Consult</button>
                <button onClick={() => setShowTrendsModal(true)} className="text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 flex items-center gap-1.5 transition hidden lg:flex"><TrendingUp size={14} /> Vitals Analytics</button>
              </>
            )}
            <button onClick={() => showToast("ABDM Sync Active")} className="px-2 py-1.5 md:px-2.5 bg-emerald-500/10 text-emerald-600 text-[10px] md:text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1"><ShieldCheck size={12} className="md:w-[14px] md:h-[14px]"/> ABDM Connected</button>
          </div>
        </header>

        {/* ADMIN DASHBOARD (NEW) */}
        {currentScreen === "dashboard" && currentUser?.role === "admin" && (
          <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border shadow-sm ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">Total Registered Patients</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-2xl font-bold">342</h3><span className="text-xs text-blue-500 font-semibold">+12 Today</span></div>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">Today's Revenue</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-2xl font-bold">₹ 45,200</h3><span className="text-xs text-emerald-500 font-semibold">Online Paid</span></div>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">Active Doctors / Staff</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-2xl font-bold">14</h3><span className="text-xs text-purple-500 font-semibold">On Duty</span></div>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">Available Beds</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-2xl font-bold">8</h3><span className="text-xs text-amber-500 font-semibold">ICU: 2 Empty</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-xl border shadow-sm ${cardTheme}`}>
                <h4 className="font-bold text-sm mb-4">Quick Financial Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg text-xs border border-emerald-500/20">
                    <span className="font-bold text-emerald-600">OPD Collections</span><span className="font-mono">₹ 12,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg text-xs border border-blue-500/20">
                    <span className="font-bold text-blue-600">Pharmacy Sales</span><span className="font-mono">₹ 18,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg text-xs border border-purple-500/20">
                    <span className="font-bold text-purple-600">Lab & Diagnostics</span><span className="font-mono">₹ 14,500</span>
                  </div>
                </div>
              </div>
              <div className={`p-5 rounded-xl border shadow-sm ${cardTheme}`}>
                <h4 className="font-bold text-sm mb-4">System Alerts</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs">
                    <p className="font-bold text-red-500 flex items-center gap-1"><AlertTriangle size={14}/> Low Inventory Alert</p>
                    <p className="text-slate-400 mt-1">Azithromycin 500mg stock is below threshold (12 left).</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs">
                    <p className="font-bold text-amber-500 flex items-center gap-1"><ShieldAlert size={14}/> Pending Doctor Approvals</p>
                    <p className="text-slate-400 mt-1">2 new doctors are awaiting license verification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCTOR DASHBOARD */}
        {currentScreen === "dashboard" && currentUser?.role === "doctor" && (
          <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div onClick={() => setCurrentScreen("appointments")} className={`p-4 rounded-xl border shadow-sm cursor-pointer hover:border-blue-400 transition ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">OPD Queue</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-xl md:text-2xl font-bold">{patientList.length}</h3><span className="text-[10px] md:text-xs text-blue-500 font-semibold">Sorted ➔</span></div>
              </div>
              <div onClick={() => setShowQrCheckinModal(true)} className={`p-4 rounded-xl border shadow-sm cursor-pointer hover:border-blue-400 transition ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">QR Check-In</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-xl md:text-2xl font-bold">Fast-Track</h3><span className="text-[10px] md:text-xs text-amber-500 font-semibold">Scan ➔</span></div>
              </div>
              <div onClick={() => setShowTeleModal(true)} className={`p-4 rounded-xl border shadow-sm cursor-pointer hover:border-blue-400 transition ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">Tele-Consult</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-xl md:text-2xl font-bold">Live Room</h3><span className="text-[10px] md:text-xs text-purple-500 font-semibold">Start ➔</span></div>
              </div>
              <div onClick={() => setCurrentScreen("report")} className={`p-4 rounded-xl border shadow-sm cursor-pointer hover:border-blue-400 transition ${cardTheme}`}>
                <p className="text-xs font-medium text-slate-400">Encounters</p>
                <div className="flex items-baseline justify-between mt-2"><h3 className="text-xl md:text-2xl font-bold">36</h3><span className="text-[10px] md:text-xs text-blue-500 font-semibold">View ➔</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-4 md:p-5 rounded-xl border shadow-sm ${cardTheme}`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">Today's Appointments (Live Triage Queue)</h4>
                  <button onClick={() => setCurrentScreen("registration")} className="text-xs font-semibold text-blue-500 hover:underline">+ Add Patient</button>
                </div>
                <div className="space-y-2.5">
                  {patientList.map((row) => (
                    <div key={row.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-slate-500/10 hover:bg-slate-500/5 gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-xs font-semibold text-slate-400 w-16 flex-shrink-0">{row.appointmentTime}</span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-bold">{row.fullName}</p>
                            {parseInt(row.age) < 12 && (<span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 border border-amber-500/30"><Baby size={12} /> Child</span>)}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${row.triageStatus === "Priority" ? "bg-red-500/20 text-red-500" : row.triageStatus === "Moderate" ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"}`}>{row.triageStatus}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ABHA: {row.abhaId}</p>
                        </div>
                      </div>
                      <button onClick={() => handleStartCaseForPatient(row)} className="w-full sm:w-auto text-xs bg-[#0B4EA2] text-white px-3 py-2 sm:py-1 rounded-md font-semibold hover:bg-blue-700 shadow-xs">Start Case</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 md:p-5 rounded-xl border shadow-sm ${cardTheme}`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">Patient Directory</h4>
                  <button onClick={() => setCurrentScreen("patients")} className="text-xs font-semibold text-blue-500 hover:underline">View All ➔</button>
                </div>
                <div className="space-y-2.5">
                  {patientList.slice(0, 4).map((row) => (
                    <div key={row.id} onClick={() => handleStartCaseForPatient(row)} className="flex items-center justify-between p-3 rounded-lg border border-slate-500/10 hover:bg-blue-500/5 cursor-pointer gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0">{row.fullName.charAt(0)}</div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-xs font-bold">{row.fullName} ({row.age}y)</p>
                            {parseInt(row.age) < 12 && (<span className="text-[9px] bg-amber-500/20 text-amber-600 px-1 py-0.2 rounded font-bold flex items-center gap-0.5"><Baby size={10} /> Child</span>)}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{row.id}</p>
                        </div>
                      </div>
                      <span className="text-[9px] sm:text-[10px] bg-slate-500/10 text-slate-400 font-medium px-2 py-0.5 rounded text-right">{row.recentDiagnosis}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: USER MANAGEMENT (MERGED APPROVALS & ACTIVE USERS) */}
        {currentScreen === "user-management" && currentUser?.role === "admin" && (
          <div className="p-4 md:p-6 space-y-6">
            {/* Pending Approvals Table */}
            <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div>
                <h3 className="text-base font-bold text-amber-500 flex items-center gap-2"><UserCheck size={18}/> Doctor Registrations (Awaiting Approval)</h3>
                <p className="text-xs text-slate-400 mt-1">Verify Medical Council Registration before activating Doctor accounts.</p>
              </div>
              <div className="border border-slate-500/20 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className={`border-b font-bold uppercase text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <tr><th className="p-3">Req ID</th><th className="p-3">Doctor Name</th><th className="p-3">Specialization</th><th className="p-3">Med. Reg Number</th><th className="p-3 text-center">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    {pendingDoctors.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-500/5 transition">
                        <td className="p-3 font-mono text-slate-400">{doc.id}</td><td className="p-3 font-bold">{doc.name}</td><td className="p-3">{doc.spec}</td>
                        <td className="p-3 font-mono font-bold text-amber-500">{doc.reg}</td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button onClick={() => { setPendingDoctors(pendingDoctors.filter(d => d.id !== doc.id)); showToast(`${doc.name} Approved!`); }} className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded font-bold hover:bg-emerald-500/20">Approve</button>
                          <button onClick={() => { setPendingDoctors(pendingDoctors.filter(d => d.id !== doc.id)); showToast(`${doc.name} Rejected!`); }} className="bg-red-500/10 text-red-600 px-3 py-1 rounded font-bold hover:bg-red-500/20">Reject</button>
                        </td>
                      </tr>
                    ))}
                    {pendingDoctors.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No pending approvals at the moment.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Users Table */}
            <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2"><Users size={18}/> Active Users Control</h3>
                <p className="text-xs text-slate-400 mt-1">Manage, Suspend or Delete existing accounts.</p>
              </div>
              <div className="border border-slate-500/20 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className={`border-b font-bold uppercase text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <tr><th className="p-3">User ID</th><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Contact Email</th><th className="p-3 text-center">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    <tr className="hover:bg-slate-500/5 transition">
                      <td className="p-3 font-mono text-slate-400">USR-001</td><td className="p-3 font-bold">Dr. Ananya Sharma</td><td className="p-3"><span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-bold text-[10px]">Doctor</span></td><td className="p-3 text-slate-400">dr.ananya@healthpulse.com</td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button onClick={() => showToast("User Blocked!")} className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded font-bold hover:bg-amber-500/20">Block</button>
                        <button onClick={() => showToast("User Deleted!")} className="bg-red-500/10 text-red-600 px-3 py-1 rounded font-bold hover:bg-red-500/20">Delete</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-500/5 transition">
                      <td className="p-3 font-mono text-slate-400">USR-002</td><td className="p-3 font-bold">Priya Das</td><td className="p-3"><span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold text-[10px]">Patient</span></td><td className="p-3 text-slate-400">priya.das@healthpulse.com</td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button onClick={() => showToast("User Blocked!")} className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded font-bold hover:bg-amber-500/20">Block</button>
                        <button onClick={() => showToast("User Deleted!")} className="bg-red-500/10 text-red-600 px-3 py-1 rounded font-bold hover:bg-red-500/20">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: PHARMACY INVENTORY */}
        {currentScreen === "inventory" && currentUser?.role === "admin" && (
          <div className="p-4 md:p-6 space-y-6">
            <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2"><Pill size={18}/> Pharmacy Inventory Master</h3>
                  <p className="text-xs text-slate-400 mt-1">Monitor real-time hospital medicine stock and pricing.</p>
                </div>
                <button onClick={() => showToast("Add Medicine Modal Opened")} className="w-full md:w-auto text-xs px-4 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center items-center gap-1.5"><Plus size={14}/> Add New Medicine</button>
              </div>
              <div className="border border-slate-500/20 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className={`border-b font-bold uppercase text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <tr><th className="p-3">Drug ID</th><th className="p-3">Brand Name</th><th className="p-3">Generic Name</th><th className="p-3">Base Price</th><th className="p-3 text-center">Stock Level</th><th className="p-3 text-center">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    {inventoryList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-500/5 transition">
                        <td className="p-3 font-mono text-slate-400">{item.id}</td><td className="p-3 font-bold">{item.brand}</td><td className="p-3">{item.generic}</td><td className="p-3 font-mono">{item.price}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded font-bold text-[10px] ${item.stock < 20 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                            {item.stock} Units
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => {
                            const newStock = parseInt(prompt(`Enter new stock for ${item.brand}:`, item.stock.toString()) || item.stock.toString());
                            const updatedList = [...inventoryList]; updatedList[idx].stock = newStock; setInventoryList(updatedList); showToast("Stock Updated!");
                          }} className="text-blue-500 hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"><Edit size={14}/> Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: BED MANAGEMENT */}
        {currentScreen === "bed-management" && currentUser?.role === "admin" && (
          <div className="p-4 md:p-6 space-y-6">
            <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2"><BedDouble size={18}/> Hospital Bed Allocation</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time occupancy tracking for ICU and General Wards.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bedStatus.map((bed, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between h-32 ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{bed.id}</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{bed.type}</p>
                      </div>
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${bed.status === "Available" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                    </div>
                    <div>
                      {bed.status === "Occupied" ? (
                        <p className="text-xs font-semibold text-slate-400">Patient: <span className="text-blue-500 font-mono">{bed.patient}</span></p>
                      ) : (
                        <button onClick={() => showToast("Opening admission form...")} className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-600 font-bold rounded-lg hover:bg-emerald-500/20 w-full sm:w-auto">Admit Patient</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN: GLOBAL ANNOUNCEMENTS */}
        {currentScreen === "announcements" && currentUser?.role === "admin" && (
          <div className="p-4 md:p-6 space-y-6">
            <div className={`max-w-3xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2"><Megaphone size={18}/> Broadcast Announcement</h3>
                <p className="text-xs text-slate-400 mt-1">Send a priority message to all Doctor and Patient portals instantly.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); showToast("Announcement Broadcasted Successfully!"); setGlobalAnnouncement(""); }}>
                <textarea 
                  rows={5} 
                  required
                  placeholder="Type your emergency notice or hospital update here..."
                  value={globalAnnouncement}
                  onChange={(e) => setGlobalAnnouncement(e.target.value)}
                  className={`w-full text-xs p-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0B4EA2] leading-relaxed mb-4 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-[10px] text-slate-400 flex items-center gap-1"><AlertTriangle size={12}/> This message will appear as a pop-up alert for all active users.</p>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-sm flex justify-center items-center gap-2"><Send size={15}/> Send Alert Now</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Casetaking Screen */}
        {currentScreen === "casetaking" && (
          <div className="p-4 md:p-6 flex flex-col gap-4">
            <div className={`p-4 rounded-xl border flex flex-col lg:flex-row items-start lg:items-center justify-between shadow-sm gap-4 ${cardTheme}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                <button onClick={() => setCurrentScreen("dashboard")} className="text-xs font-semibold text-blue-500 hover:underline whitespace-nowrap">← Back</button>
                <div className="flex items-center gap-3 sm:pl-4 sm:border-l border-slate-500/20 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">{selectedPatient?.fullName?.charAt(0)}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold">{selectedPatient?.fullName}</h3>
                      {isPediatric && (<span className="text-[10px] bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-500/30"><Baby size={12} /> Pediatric Patient</span>)}
                    </div>
                    <p className="text-[11px] text-slate-400">{selectedPatient?.age} Years, {selectedPatient?.gender} | PID: {selectedPatient?.id} | Allergies: <span className="text-red-500 font-semibold">{selectedPatient?.allergies}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                <button onClick={() => setShowXRayModal(true)} className="flex-1 lg:flex-none justify-center text-xs font-semibold px-3 py-1.5 bg-cyan-500/10 text-cyan-600 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 flex items-center gap-1.5 transition"><Scan size={14} /> Scan X-Ray</button>
                <button onClick={() => setShowTrendsModal(true)} className="flex-1 lg:flex-none justify-center text-xs font-semibold px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 flex items-center gap-1.5 transition"><TrendingUp size={14} /> Analytics</button>
                <div className={`w-full sm:w-auto justify-center px-3 py-1.5 rounded-xl border flex items-center gap-2 ${currentTriage.color}`}><span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${currentTriage.badge} animate-ping`}></span><span className="text-xs font-bold whitespace-nowrap">{currentTriage.label}</span></div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-xs ${cardTheme}`}>
              <div><label className="text-slate-400 font-semibold block mb-1">Temp (°F)</label><input type="number" step="0.1" value={vitals.temperature} onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 98.6 })} className={`w-full p-2 border rounded-lg font-bold ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} /></div>
              <div><label className="text-slate-400 font-semibold block mb-1">Pulse (bpm)</label><input type="number" value={vitals.pulse} onChange={(e) => setVitals({ ...vitals, pulse: parseInt(e.target.value) || 72 })} className={`w-full p-2 border rounded-lg font-bold ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} /></div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-slate-400 font-semibold block mb-1">BP Sys/Dia</label>
                <div className="flex gap-2">
                  <input type="number" value={vitals.bpSystolic} onChange={(e) => setVitals({ ...vitals, bpSystolic: parseInt(e.target.value) || 120 })} className={`w-1/2 p-2 border rounded-lg font-bold ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  <input type="number" value={vitals.bpDiastolic} onChange={(e) => setVitals({ ...vitals, bpDiastolic: parseInt(e.target.value) || 80 })} className={`w-1/2 p-2 border rounded-lg font-bold ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1"><label className="text-slate-400 font-semibold block mb-1">Oxygen (%)</label><input type="number" value={vitals.oxygenSaturation} onChange={(e) => setVitals({ ...vitals, oxygenSaturation: parseInt(e.target.value) || 99 })} className={`w-full p-2 border rounded-lg font-bold ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
              <div className={`col-span-1 rounded-xl border p-2 shadow-sm flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-0.5 text-xs font-medium ${cardTheme}`}>
                {clinicalTabs.map((item, idx) => (
                  <button key={idx} onClick={() => setActiveTab(item)} className={`whitespace-nowrap lg:whitespace-normal w-auto lg:w-full text-left px-3 py-2.5 rounded-lg transition flex-shrink-0 ${activeTab === item ? "bg-blue-500/15 text-blue-500 font-bold" : "hover:bg-slate-500/5 text-slate-400"}`}>
                    {item}
                  </button>
                ))}
              </div>

              <div className={`col-span-1 lg:col-span-3 rounded-xl border p-4 md:p-6 shadow-sm flex flex-col justify-between ${cardTheme}`}>
                {activeTab === "Prescription Builder" ? (
                  <div className="space-y-5">
                    <h3 className="font-bold text-sm text-[#0B4EA2] border-b pb-2">Digital Rx Generator</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-500">Diagnosis</label>
                      <input type="text" value={rxBuilder.diagnosis} onChange={e => setRxBuilder({...rxBuilder, diagnosis: e.target.value})} className={`w-full text-xs p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2 text-slate-500">Medicines & Dosage</label>
                      {rxBuilder.medicines.map((med, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-2 border-b sm:border-0 pb-3 sm:pb-0 border-slate-500/20">
                          <input type="text" placeholder="Medicine Name" value={med.name} onChange={e => { const newMeds = [...rxBuilder.medicines]; newMeds[idx].name = e.target.value; setRxBuilder({...rxBuilder, medicines: newMeds}); }} className={`w-full sm:flex-1 text-xs p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
                          <input type="text" placeholder="Dose (1-0-1)" value={med.dose} onChange={e => { const newMeds = [...rxBuilder.medicines]; newMeds[idx].dose = e.target.value; setRxBuilder({...rxBuilder, medicines: newMeds}); }} className={`w-full sm:w-24 text-xs p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
                          <input type="text" placeholder="Days" value={med.duration} onChange={e => { const newMeds = [...rxBuilder.medicines]; newMeds[idx].duration = e.target.value; setRxBuilder({...rxBuilder, medicines: newMeds}); }} className={`w-full sm:w-20 text-xs p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
                          <input type="text" placeholder="Notes (After food)" value={med.instructions} onChange={e => { const newMeds = [...rxBuilder.medicines]; newMeds[idx].instructions = e.target.value; setRxBuilder({...rxBuilder, medicines: newMeds}); }} className={`w-full sm:w-32 text-xs p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
                          <button onClick={() => { const newMeds = rxBuilder.medicines.filter((_, i) => i !== idx); setRxBuilder({...rxBuilder, medicines: newMeds}); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center sm:w-auto w-full border border-red-500/20 sm:border-0"><XCircle size={16}/> <span className="sm:hidden ml-2 font-bold">Remove</span></button>
                        </div>
                      ))}
                      <button onClick={() => setRxBuilder({...rxBuilder, medicines: [...rxBuilder.medicines, {name: "", dose: "", duration: "", instructions: ""}]})} className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1 mt-2"><Plus size={14}/> Add Medicine</button>
                    </div>
                    <div className="pt-4 border-t border-slate-500/20 flex justify-end">
                      <button onClick={syncPrescription} className="w-full sm:w-auto px-6 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">Generate Final Prescription ➔</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h3 className="font-bold text-sm">{activeTab}</h3>
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <button onClick={() => setDialogueMode(!dialogueMode)} className={`flex-1 sm:flex-none justify-center text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-semibold transition ${dialogueMode ? "bg-purple-500/20 text-purple-400 border-purple-500/40" : "border-slate-500/20 text-slate-400 hover:bg-slate-500/5"}`}>
                          <MessageSquare size={13} /> {dialogueMode ? "Split: Active" : "Dialogue Split"}
                        </button>
                        <div className={`flex flex-1 sm:flex-none justify-center rounded-lg p-0.5 text-xs font-semibold ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                          <button onClick={() => setInputMode("Type")} className={`w-1/2 sm:w-auto px-3 py-1 rounded-md transition ${inputMode === "Type" ? "bg-[#0B4EA2] text-white shadow-xs" : "text-slate-400"}`}>Type</button>
                          <button onClick={() => setInputMode("Speak")} className={`w-1/2 sm:w-auto px-3 py-1 rounded-md transition ${inputMode === "Speak" ? "bg-[#0B4EA2] text-white shadow-xs" : "text-slate-400"}`}>Speak</button>
                        </div>
                      </div>
                    </div>

                    {dialogueMode && (
                      <div className="mb-4 p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl space-y-2 text-xs">
                        <p className="font-bold text-purple-400 text-[11px] uppercase tracking-wider flex items-center gap-1"><MessageSquare size={12} /> Auto Speaker Diarization Stream</p>
                        {dialogues.map((d, i) => (
                          <div key={i} className="flex gap-2">
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] h-fit ${d.speaker === "Doctor" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>{d.speaker}:</span>
                            <span className="text-slate-300">{d.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {inputMode === "Speak" && (
                      <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-5 mb-5 flex flex-col items-center justify-center">
                        <button onClick={toggleRecording} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-[#0B4EA2] text-white hover:bg-blue-700"}`}>
                          {isRecording ? <Square size={20} /> : <Mic size={20} />}
                        </button>
                        <p className="text-xs font-bold mt-2">00:00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</p>
                        <p className="text-[11px] text-slate-400 text-center">{isRecording ? "Listening & distinguishing speech..." : "Tap mic to dictate"}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-400">Transcribed Clinical Narrative ({activeTab})</label>
                      <textarea rows={6} value={tabNotes[activeTab] || ""} onChange={(e) => setTabNotes({ ...tabNotes, [activeTab]: e.target.value })} className={`w-full text-xs p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed ${darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "border-slate-200"}`} placeholder="Type clinical notes..." />
                    </div>
                  </div>
                )}

                {activeTab !== "Prescription Builder" && (
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-500/20 mt-4 gap-4">
                    <button onClick={() => showToast("Draft Saved")} className="text-xs text-slate-400 hover:text-slate-100 font-semibold flex items-center gap-1 w-full sm:w-auto justify-center"><Save size={14} /> Save Draft</button>
                    <button onClick={handleRunAI} disabled={loadingAI} className="w-full sm:w-auto text-xs px-6 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm">
                      {loadingAI ? "Analyzing Clinical Safety..." : "Save & Run Clinical CDS ➔"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Screen */}
        {currentScreen === "suggestions" && (
          <div className="p-4 md:p-6 space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <h3 className="text-base font-bold">AI Clinical Decision Support (CDS)</h3>
              <div className="flex flex-wrap gap-2">
                {isPediatric && (<span className="text-xs bg-amber-500/20 text-amber-500 font-bold px-3 py-1 rounded-full border border-amber-500/40">Pediatric Dose Engine Active</span>)}
                <span className="text-xs bg-blue-500/10 text-blue-500 font-mono font-bold px-3 py-1 rounded-full border border-blue-500/30">ICD-11: 1D20</span>
              </div>
            </div>
            <div className={`p-4 md:p-5 rounded-xl border shadow-sm space-y-3 ${cardTheme}`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">AI Differential Diagnosis Probability Engine</h4>
              <div className="space-y-3">
                {differentialMatrix.map((diff, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold"><span>{diff.disease} ({diff.icd})</span><span className="font-mono font-bold text-blue-500">{diff.probability}%</span></div>
                    <div className="w-full h-2 rounded-full bg-slate-500/10 overflow-hidden"><div className={`h-full rounded-full ${idx === 0 ? "bg-[#0B4EA2]" : idx === 1 ? "bg-amber-500" : "bg-slate-400"}`} style={{ width: `${diff.probability}%` }}></div></div>
                    <p className="text-[10px] text-slate-400 italic">Clinical Justification: {diff.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
              <button onClick={() => setCurrentScreen("casetaking")} className="w-full sm:w-auto text-xs px-4 py-2 border rounded-lg font-semibold">Edit Manually</button>
              <button onClick={handleFinalizeCase} className="w-full sm:w-auto text-xs px-6 py-2 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700">Accept & Generate Prescription ➔</button>
            </div>
          </div>
        )}

        {/* Report / Rx Generation Screen */}
        {currentScreen === "report" && currentUser?.role === "doctor" && (
          <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className={`col-span-1 p-4 md:p-5 rounded-xl border shadow-sm h-fit space-y-3 no-print ${cardTheme}`}>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-2">Doctor Controls</h4>
                <div className="p-3 bg-slate-500/10 rounded-xl border border-slate-500/20 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">Prescription Language:</span>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {(["bn", "hi", "en"] as const).map((lang) => (
                      <button key={lang} onClick={() => setRxLanguage(lang)} className={`py-1 rounded font-bold transition ${rxLanguage === lang ? "bg-[#0B4EA2] text-white" : "hover:bg-slate-500/20 text-slate-400"}`}>
                        {lang === "bn" ? "বাংলা" : lang === "hi" ? "हिन्दी" : "English"}
                      </button>
                    ))}
                  </div>
                  <button onClick={speakRx} className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${isSpeakingRx ? "bg-red-500 text-white animate-pulse" : "bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20"}`}>
                    <Volume2 size={14} /><span>{isSpeakingRx ? "Stop Speaking" : "Read Prescription (Voice)"}</span>
                  </button>
                </div>
                <button onClick={() => setShowWhatsAppModal(true)} className="w-full text-xs font-semibold py-2.5 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition justify-center"><Send size={15} /> Send to WhatsApp</button>
                <button onClick={() => window.print()} className="w-full text-xs font-semibold py-2.5 px-3 rounded-lg border hover:bg-slate-500/10 flex items-center gap-2 justify-center"><Printer size={15} /> Print Report</button>
                <button onClick={exportFhirJson} className="w-full text-xs font-semibold py-2.5 px-3 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-2 justify-center"><FileJson size={15} /> Export FHIR JSON</button>
                <div className="pt-4 border-t border-slate-500/20 space-y-2">
                  <div className="flex justify-between items-center text-xs"><span className="font-bold flex items-center gap-1"><PenTool size={13} /> Doctor Signature</span><button onClick={clearSignature} className="text-[10px] text-red-500 hover:underline">Clear</button></div>
                  <canvas ref={canvasRef} width={220} height={80} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} className={`border rounded-lg cursor-crosshair w-full ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-300"}`} />
                </div>
                <div className="pt-4 border-t border-slate-500/20 mt-4"><button onClick={() => setCurrentScreen("dashboard")} className="w-full text-xs py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm">Finish &amp; Next Patient</button></div>
              </div>

              <div className={`col-span-1 lg:col-span-3 p-4 md:p-8 rounded-2xl border shadow-md printable-sheet space-y-5 ${cardTheme}`}>
                <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-500/20 pb-4 gap-2">
                  <div><h2 className="text-lg md:text-xl font-black tracking-wider text-[#0B4EA2]">CASE SUMMARY &amp; PRESCRIPTION</h2><p className="text-xs text-slate-400">HealthPulse Clinical Decision System • ABDM Compliant EHR</p></div>
                  <div className="text-left md:text-right text-xs text-slate-400"><p className="font-bold">Case ID: CS-249</p><p>Date: {new Date().toLocaleDateString()}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b border-slate-500/20 pb-4">
                  <div className="space-y-1">
                    <p><span className="text-slate-400">Patient Name :</span> <span className="font-bold">{selectedPatient?.fullName || "Patient"}</span></p>
                    <p><span className="text-slate-400">Age / Gender :</span> {selectedPatient?.age} Years / {selectedPatient?.gender}</p>
                    <p><span className="text-slate-400">ABHA Address :</span> <span className="font-mono font-bold text-blue-500">{selectedPatient?.abhaId}</span></p>
                    <p><span className="text-slate-400">Doctor :</span> {currentUser?.name || "Dr. Ananya Sharma"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">Vitals at Examination</p>
                    <p><span className="text-slate-400">Temperature :</span> {vitals.temperature} °F</p>
                    <p><span className="text-slate-400">Pulse :</span> {vitals.pulse} bpm</p>
                    <p><span className="text-slate-400">Blood Pressure :</span> {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</p>
                  </div>
                </div>
                <div className="space-y-4 text-xs">
                  <div><h5 className="font-bold mb-1">Chief Complaint &amp; History</h5><p className="text-slate-400">{tabNotes["Chief Complaint"]}</p></div>
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div><h5 className="font-bold mb-0.5">Clinical Diagnosis ({rxLanguage.toUpperCase()})</h5><p className="text-blue-500 font-bold text-sm">{rxTranslations[rxLanguage].diagnosis}</p></div>
                    <div className="text-left sm:text-right font-mono"><p className="text-[11px] font-bold">ICD-11: 1D20</p><p className="text-[10px] text-slate-400">SNOMED CT: 386661006</p></div>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1.5">Rx - Prescribed Treatment Plan ({rxLanguage.toUpperCase()})</h5>
                    <ul className="space-y-1 bg-slate-500/5 p-3 rounded-xl border border-slate-500/20 font-medium">
                      {rxTranslations[rxLanguage].plan.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 text-xs"><Pill size={15} /><span>Pharmacy Stock &amp; Alternatives</span></div>
                    <div className="space-y-1.5 text-[11px] overflow-x-auto pb-1">
                      {genericMatrix.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg gap-2 whitespace-nowrap min-w-max w-full">
                          <div><span className="line-through text-slate-400 mr-2">{item.brand}</span><span className="font-bold text-emerald-600">➔ {item.generic}</span></div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded">{item.stock}</span>
                            <span className="font-bold text-emerald-700 bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">{item.savings}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-slate-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-slate-200 rounded-lg bg-white shadow-xs"><QRCodeSVG value={`https://healthpulse-4d9z.onrender.com`} size={50} /></div>
                    <div className="text-[9px] md:text-[10px] text-slate-400 leading-tight"><p className="font-bold text-slate-500">Scan to Access Digital EHR</p><p>View prescription &amp; dosage alarms.</p></div>
                  </div>
                  <div className="text-center">
                    {hasSignature ? (<div className="text-xs italic text-blue-500 font-serif border-b border-slate-500/30 pb-1 mb-1 font-bold">[Digitally Signed by Doctor]</div>) : (<p className="font-serif italic text-base text-blue-500 mb-0.5">Dr. Ananya</p>)}
                    <p className="font-bold text-[10px] md:text-xs">{currentUser?.name || "Dr. Ananya Sharma"}</p><p className="text-[9px] md:text-[10px] text-slate-400">Reg. No: WBMC-84291</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients Directory */}
        {currentScreen === "patients" && (
          <div className="p-4 md:p-6 space-y-4">
            <div className={`p-4 md:p-5 rounded-2xl border shadow-sm space-y-4 ${cardTheme}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div><h3 className="text-base font-bold">Patients Directory</h3><p className="text-xs text-slate-400">Select any patient to review history or initiate encounter</p></div>
                <button onClick={() => setCurrentScreen("registration")} className="w-full sm:w-auto px-4 py-2 bg-[#0B4EA2] text-white font-bold rounded-lg text-xs hover:bg-blue-700 flex justify-center items-center gap-1.5"><UserPlus size={14} /> Register New Patient</button>
              </div>
              <div className="border border-slate-500/20 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className={`border-b font-bold uppercase text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <tr><th className="p-3">Patient ID</th><th className="p-3">Full Name</th><th className="p-3">Age / Gender</th><th className="p-3">Category</th><th className="p-3">ABHA Health ID</th><th className="p-3">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    {patientList.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-500/5 transition">
                        <td className="p-3 font-mono font-bold text-slate-400">{pat.id}</td><td className="p-3 font-bold">{pat.fullName}</td><td className="p-3 text-slate-400">{pat.age} Yrs / {pat.gender}</td>
                        <td className="p-3">{parseInt(pat.age) < 12 ? (<span className="text-[10px] bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit"><Baby size={12} /> Child</span>) : (<span className="text-[10px] bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded-full font-medium">Adult</span>)}</td>
                        <td className="p-3 font-mono text-blue-500 font-semibold">{pat.abhaId}</td>
                        <td className="p-3"><button onClick={() => handleStartCaseForPatient(pat)} className="text-xs px-3 py-1 bg-blue-500/10 text-blue-500 font-bold rounded-md hover:bg-blue-500/20 border border-blue-500/20">Open Case</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Register New Patient Form */}
        {currentScreen === "registration" && (
          <div className="p-4 md:p-6">
            <div className={`max-w-4xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div>
                <h3 className="text-base font-bold">Register New Patient (ABDM Compliant)</h3>
                <p className="text-xs text-slate-400">Fill comprehensive details to register and immediately start clinical documentation</p>
              </div>

              <form onSubmit={handleAddNewPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Name *</label>
                    <input type="text" required placeholder="e.g. Ankit Roy" value={newPatientForm.fullName} onChange={(e) => setNewPatientForm({ ...newPatientForm, fullName: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Ayushman Bharat (ABHA) ID</label>
                    <input type="text" placeholder="e.g. 91-0000-1111-2222 (Auto-generates if empty)" value={newPatientForm.abhaId} onChange={(e) => setNewPatientForm({ ...newPatientForm, abhaId: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg font-mono text-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Gender *</label>
                    <select value={newPatientForm.gender} onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                      <option>Female</option><option>Male</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Age *</label>
                    <input type="number" required placeholder="e.g. 25" value={newPatientForm.age} onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Phone Number</label>
                    <input type="text" placeholder="+91 98000 00000" value={newPatientForm.phone} onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Email Address (Optional)</label>
                  <input type="email" placeholder="patient@example.com" value={newPatientForm.email} onChange={(e) => setNewPatientForm({ ...newPatientForm, email: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Known Allergies</label>
                    <input type="text" placeholder="e.g. Penicillin, Dust, None" value={newPatientForm.allergies} onChange={(e) => setNewPatientForm({ ...newPatientForm, allergies: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Chronic Conditions (Past History)</label>
                    <input type="text" placeholder="e.g. Diabetes, Hypertension, None" value={newPatientForm.chronicConditions} onChange={(e) => setNewPatientForm({ ...newPatientForm, chronicConditions: e.target.value })} className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "border-slate-200"}`} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-500/20 mt-4">
                  <button type="button" onClick={() => setCurrentScreen("patients")} className="w-full sm:w-auto px-4 py-2.5 border rounded-lg text-xs font-semibold hover:bg-slate-500/10 text-center">Cancel</button>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition shadow-sm text-center">Save & Start Clinical Case</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointments Queue Screen */}
        {currentScreen === "appointments" && (
          <div className="p-4 md:p-6 space-y-4">
            <div className={`p-4 md:p-5 rounded-xl border shadow-sm space-y-3 ${cardTheme}`}>
              <h3 className="text-base font-bold mb-2">Clinic Appointments Today</h3>
              <div className="space-y-3 text-xs">
                {patientList.map((p) => (
                  <div key={p.id} className="p-3 border border-slate-500/10 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-500/5 transition gap-3">
                    <div>
                      <p className="font-bold">{p.appointmentTime} - {p.fullName}</p>
                      <p className="text-slate-400 font-mono mt-0.5">ABHA: {p.abhaId} | {p.chronicConditions}</p>
                    </div>
                    <button onClick={() => handleStartCaseForPatient(p)} className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-[#0B4EA2] text-white font-semibold rounded-md hover:bg-blue-700 text-xs text-center">Call &amp; Start Case</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Encounter Records Screen */}
        {currentScreen === "history" && (
          <div className="p-4 md:p-6 space-y-4">
            <div className={`p-4 md:p-5 rounded-xl border shadow-sm ${cardTheme}`}>
              <h3 className="text-base font-bold mb-3">Encounter Records</h3>
              <div className="space-y-3 text-xs">
                {patientList.map((p) => (
                  <div key={p.id} className="p-3 border border-slate-500/10 rounded-lg hover:bg-slate-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="font-bold">{p.fullName} ({p.id})</p>
                      <p className="text-slate-400 mt-0.5">Diagnosis: {p.recentDiagnosis}</p>
                    </div>
                    <button onClick={() => handleStartCaseForPatient(p)} className="text-blue-500 font-semibold hover:underline w-full sm:w-auto text-left sm:text-right mt-1 sm:mt-0">Review History ➔</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Audit Log Viewer */}
        {currentScreen === "audit" && (
          <div className="p-4 md:p-6 space-y-6">
            <div className={`max-w-6xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-5 ${cardTheme}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold">Secure Audit Logs</h3>
                  <p className="text-xs text-slate-400">ABDM &amp; HIPAA compliant immutable security access records</p>
                </div>
                <button onClick={() => showToast("Exporting CSV logs...")} className="w-full sm:w-auto text-xs font-semibold px-4 py-2 border border-slate-500/20 rounded-lg hover:bg-slate-500/10 flex justify-center items-center gap-1.5 transition">
                  <Download size={14} /> Export Logs
                </button>
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2">
                <div className="relative w-full lg:w-1/2">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text" placeholder="Search logs by action, user or ID..." value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 md:py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto">
                  <span className="font-bold text-slate-400">Role:</span>
                  {(["All", "Doctor", "Staff", "Admin"] as const).map((r) => (
                    <button key={r} onClick={() => setAuditRoleFilter(r)} className={`px-3 py-1.5 md:py-1 rounded-lg border text-xs font-semibold transition ${auditRoleFilter === r ? "bg-[#0B4EA2] text-white border-[#0B4EA2]" : "border-slate-500/20 text-slate-400 hover:bg-slate-500/10"}`}>{r}</button>
                  ))}
                </div>
              </div>

              <div className="border border-slate-500/20 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className={`border-b font-bold uppercase text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                    <tr><th className="p-3">Action</th><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Patient ID</th><th className="p-3">Timestamp</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    {auditLogs
                      .filter((l) => (auditRoleFilter === "All" || l.role === auditRoleFilter) && (l.action.toLowerCase().includes(auditSearch.toLowerCase()) || l.user.toLowerCase().includes(auditSearch.toLowerCase())))
                      .map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-500/5 transition">
                          <td className="p-3 font-semibold">{row.action}</td><td className="p-3 text-slate-400">{row.user}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">{row.role}</span></td>
                          <td className="p-3 text-slate-400 font-mono">{row.patientId}</td><td className="p-3 text-slate-400 font-mono">{row.time}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admin Settings Screen */}
        {currentScreen === "settings" && (
          <div className="p-4 md:p-6">
            <div className={`max-w-5xl mx-auto rounded-2xl border shadow-sm p-4 md:p-6 space-y-6 ${cardTheme}`}>
              <div><h3 className="text-base font-bold">System Configuration &amp; Governance</h3><p className="text-xs text-slate-400">Manage clinical CDS modules, AI parameters, and role-based permissions</p></div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-400">Modules Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {[
                    { key: "aiCaseSummary", label: "Enable AI Case Summary" }, { key: "cds", label: "Enable Clinical Decision Support" },
                    { key: "multilingual", label: "Enable Multilingual Support" }, { key: "icd11Coder", label: "Enable ICD-11 Auto Coder" },
                    { key: "drugInteraction", label: "Enable Drug Safety Checker" }, { key: "auditLogging", label: "Enforce Tamper-proof Logging" }
                  ].map((mod) => (
                    <label key={mod.key} className="flex items-center justify-between p-3 border border-slate-500/20 rounded-xl bg-slate-500/5 cursor-pointer hover:bg-slate-500/10 transition">
                      <span className="font-semibold pr-2">{mod.label}</span>
                      <input type="checkbox" checked={(moduleSettings as any)[mod.key]} onChange={(e) => setModuleSettings({ ...moduleSettings, [mod.key]: e.target.checked })} className="w-4 h-4 text-blue-600 rounded cursor-pointer flex-shrink-0" />
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-500/20 pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Model Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Select AI Model Version</label>
                    <select value={aiModelVersion} onChange={(e) => setAiModelVersion(e.target.value)} className={`w-full p-2.5 border rounded-xl text-xs focus:ring-1 focus:ring-blue-500 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                      <option>HealthPulse v2.1 (Clinical Gemini Fine-tuned)</option><option>Llama 3 70B Clinical</option><option>GPT-4o Healthcare Mini</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold mb-1"><span>Confidence Threshold</span><span className="font-bold text-blue-500">{confidenceThreshold}%</span></div>
                    <input type="range" min="50" max="99" value={confidenceThreshold} onChange={(e) => setConfidenceThreshold(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-500/20 pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role Permissions Matrix</h4>
                <div className="border border-slate-500/20 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-center whitespace-nowrap">
                    <thead className={`border-b font-bold uppercase text-[10px] ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                      <tr><th className="p-2.5 text-left pl-4">Role</th><th className="p-2.5">View Patient Data</th><th className="p-2.5">Edit Data</th><th className="p-2.5">Generate Data</th><th className="p-2.5">Generate Report</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-500/10">
                      {(["Doctor", "Staff", "Nurse", "Patient", "Admin"] as const).map((roleName) => (
                        <tr key={roleName} className="hover:bg-slate-500/5 transition">
                          <td className="p-2.5 text-left pl-4 font-bold">{roleName}</td>
                          <td className="p-2.5"><input type="checkbox" checked={permissions[roleName].view} onChange={(e) => setPermissions({ ...permissions, [roleName]: { ...permissions[roleName], view: e.target.checked } }) } className="w-4 h-4 md:w-3.5 md:h-3.5 text-blue-600 rounded cursor-pointer" /></td>
                          <td className="p-2.5"><input type="checkbox" checked={permissions[roleName].edit} onChange={(e) => setPermissions({ ...permissions, [roleName]: { ...permissions[roleName], edit: e.target.checked } }) } className="w-4 h-4 md:w-3.5 md:h-3.5 text-blue-600 rounded cursor-pointer" /></td>
                          <td className="p-2.5"><input type="checkbox" checked={permissions[roleName].generateData} onChange={(e) => setPermissions({ ...permissions, [roleName]: { ...permissions[roleName], generateData: e.target.checked } }) } className="w-4 h-4 md:w-3.5 md:h-3.5 text-blue-600 rounded cursor-pointer" /></td>
                          <td className="p-2.5"><input type="checkbox" checked={permissions[roleName].generateReport} onChange={(e) => setPermissions({ ...permissions, [roleName]: { ...permissions[roleName], generateReport: e.target.checked } }) } className="w-4 h-4 md:w-3.5 md:h-3.5 text-blue-600 rounded cursor-pointer" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="border-t border-slate-500/20 pt-5 flex flex-col md:flex-row items-start md:items-center justify-between text-xs gap-4">
                <div><h5 className="font-bold">Security &amp; Privacy Standard</h5><p className="text-slate-400">AES-256 GCM Local Database Encryption Enabled</p></div>
                <button onClick={() => showToast("All System Configurations Saved!")} className="w-full md:w-auto px-6 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700 transition text-center">Save All Configuration</button>
              </div>
            </div>
          </div>
        )}

        {/* Universal Profile Settings Screen */}
        {currentScreen === "profile" && (
          <div className="p-4 md:p-6">
             <div className={`max-w-2xl mx-auto rounded-2xl border shadow-sm p-4 md:p-8 space-y-6 ${cardTheme}`}>
               <button onClick={() => setCurrentScreen(currentUser?.role === "admin" ? "dashboard" : "dashboard")} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1.5 border-b border-slate-500/20 pb-4 w-full">
                 <ArrowLeft size={16} /> Back to Dashboard
               </button>
               <div className="flex items-center gap-4 border-b pb-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500 text-white font-black text-2xl md:text-3xl flex items-center justify-center flex-shrink-0">
                    {currentUser?.name?.charAt(0) || "U"}
                 </div>
                 <div>
                   <h2 className="text-lg md:text-xl font-bold">{currentUser?.name || "User"}</h2>
                   <p className="text-xs text-[#0B4EA2] font-bold uppercase tracking-wider">{currentUser?.role || "Doctor"}</p>
                   <p className="text-xs text-slate-400 mt-1">{currentUser?.email || "email@healthpulse.com"}</p>
                 </div>
               </div>
               <form className="space-y-4 text-sm" onSubmit={(e) => { e.preventDefault(); showToast("Profile Details Updated Successfully!"); }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><label className="block text-xs font-bold mb-1 text-slate-500">Full Name</label><input type="text" defaultValue={currentUser?.name} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                   <div><label className="block text-xs font-bold mb-1 text-slate-500">Contact Email</label><input type="email" defaultValue={currentUser?.email} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                 </div>
                 {currentUser?.role === "doctor" && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="block text-xs font-bold mb-1 text-slate-500">Specialization</label><input type="text" defaultValue="General Medicine" className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                     <div><label className="block text-xs font-bold mb-1 text-slate-500">Clinic Name</label><input type="text" defaultValue="HealthPulse Care" className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                   </div>
                 )}
                 {currentUser?.role === "patient" && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="block text-xs font-bold mb-1 text-slate-500">Blood Group</label><input type="text" defaultValue="O+" className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                     <div><label className="block text-xs font-bold mb-1 text-slate-500">Emergency Contact</label><input type="text" placeholder="Phone Number" className={`w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}/></div>
                   </div>
                 )}
                 <div className="pt-4 flex justify-end">
                   <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-[#0B4EA2] text-white font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Save size={16}/> Save Changes</button>
                 </div>
               </form>
             </div>
          </div>
        )}

      </main>

      {/* ALL MODALS */}

      {/* AI CHEST X-RAY MODAL */}
      {showXRayModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border ${cardTheme}`}>
            <div className="flex justify-between items-center border-b border-slate-500/20 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2 text-cyan-500">
                <Scan size={18} /> AI Chest X-Ray &amp; Pulmonary Vision
              </h3>
              <button onClick={() => setShowXRayModal(false)} className="text-slate-400 hover:text-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-cyan-500 transition">
              <FileUp size={32} className="text-cyan-500" />
              <p className="text-xs font-bold">Upload Patient Chest Radiograph (X-Ray / CT)</p>
              <p className="text-[10px] text-slate-400">DICOM, JPEG, PNG supported</p>
              <input type="file" accept="image/*" onChange={handleXRayScan} className="text-xs mt-2 w-full md:w-auto file:mr-2 file:py-1 file:px-3 file:rounded-lg file:bg-cyan-500/20 file:text-cyan-600 file:border-0 cursor-pointer" />
            </div>

            {xRayScanning && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-2 text-cyan-500 text-xs">
                <RefreshCw size={14} className="animate-spin flex-shrink-0" />
                <span>Convolutional Neural Net scanning lung fields &amp; pleura...</span>
              </div>
            )}

            {xRayResult && (
              <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-cyan-600">
                  <CheckCircle size={15} />
                  <span>{xRayResult.confidence}</span>
                </div>
                <p className="text-slate-300"><b>Findings:</b> {xRayResult.findings}</p>
                <p className="text-slate-400 text-[11px]"><b>Recommendation:</b> {xRayResult.recommendation}</p>
              </div>
            )}

            <button onClick={() => setShowXRayModal(false)} className="w-full py-2.5 bg-[#0B4EA2] text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition mt-2">
              Close Radiograph Analysis
            </button>
          </div>
        </div>
      )}

      {/* TELEMEDICINE MODAL */}
      {showTeleModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl shadow-2xl max-w-2xl w-full p-4 md:p-6 space-y-4 border ${cardTheme}`}>
            <div className="flex justify-between items-center border-b border-slate-500/20 pb-3">
              <h3 className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
                <Video size={16} /> Live Tele-Consultation: {selectedPatient?.fullName || "Patient"}
              </h3>
              <button onClick={() => setShowTeleModal(false)} className="text-slate-400 hover:text-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2 relative bg-slate-950 rounded-2xl h-52 md:h-64 overflow-hidden border border-slate-800 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-lg animate-pulse">
                    {selectedPatient?.fullName?.charAt(0) || "P"}
                  </div>
                  <p className="text-xs font-bold text-white">{selectedPatient?.fullName || "Patient"} (Connected)</p>
                  <p className="text-[10px] text-emerald-400 font-mono">WebRTC Encrypted Stream • Latency 24ms</p>
                </div>
              </div>

              <div className="col-span-1 bg-slate-500/10 rounded-2xl p-4 border border-slate-500/20 flex flex-row md:flex-col justify-between md:justify-start gap-4 md:gap-0 md:space-y-3 text-xs">
                <p className="font-bold text-slate-400 uppercase text-[10px] w-full hidden md:block">Real-Time Vitals</p>
                <div className="flex-1 md:flex-none">
                  <span className="text-slate-400 block md:inline text-[10px] md:text-xs">Pulse:</span>
                  <p className="text-sm md:text-base font-bold text-emerald-500 font-mono">98 bpm</p>
                </div>
                <div className="flex-1 md:flex-none border-l md:border-0 border-slate-500/20 pl-4 md:pl-0">
                  <span className="text-slate-400 block md:inline text-[10px] md:text-xs">SpO2:</span>
                  <p className="text-sm md:text-base font-bold text-blue-500 font-mono">98%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => { setShowTeleModal(false); showToast("Telemedicine consultation concluded."); }} className="w-full md:w-auto px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition text-center">
                End Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR CHECK-IN MODAL */}
      {showQrCheckinModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
            <div className="flex justify-between items-center border-b border-slate-500/20 pb-3">
              <h3 className="font-bold text-sm text-amber-500 flex items-center gap-1.5">
                <QrCode size={16} /> Hospital Kiosk: ABHA QR Check-In
              </h3>
              <button onClick={() => setShowQrCheckinModal(false)} className="text-slate-400 hover:text-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="border-2 border-dashed border-amber-500/30 bg-amber-500/5 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <QRCodeSVG value="ABHA-CHECKIN-PID-2024-00124" size={120} />
              </div>
              <p className="text-xs font-bold mt-2">Scan Patient ABHA Mobile App QR</p>
              <p className="text-[11px] text-slate-400">Instant OPD queue check-in &amp; medical history sync</p>
            </div>

            {qrScanning ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-amber-500 text-xs">
                <RefreshCw size={14} className="animate-spin flex-shrink-0" />
                <span>Reading ABHA Registry...</span>
              </div>
            ) : (
              <button onClick={handleSimulateQrScan} className="w-full py-2.5 bg-[#0B4EA2] text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition mt-2">
                Simulate QR Scan (Check-In)
              </button>
            )}
          </div>
        </div>
      )}

      {/* VITALS TRENDS MODAL */}
      {showTrendsModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl shadow-2xl max-w-xl w-full p-4 md:p-6 space-y-4 border ${cardTheme}`}>
            <div className="flex justify-between items-center border-b border-slate-500/20 pb-3">
              <h3 className="font-bold text-sm text-blue-500 flex items-center gap-1.5">
                <TrendingUp size={16} /> Longitudinal Platelet &amp; Vitals Trends
              </h3>
              <button onClick={() => setShowTrendsModal(false)} className="text-slate-400 hover:text-slate-100">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Recovery trajectory for <span className="font-bold text-slate-200">{selectedPatient?.fullName || "Patient"}</span>:
            </p>

            <div className="space-y-3 pt-2">
              <div className="border border-slate-500/20 rounded-xl p-3 bg-slate-500/5 space-y-2">
                <span className="text-xs font-bold text-blue-400 block text-center md:text-left">Platelet Trajectory (Normal: 150k - 450k)</span>
                <div className="flex items-end gap-1 md:gap-3 h-28 pt-4 px-1 md:px-2 overflow-x-auto">
                  {historicalTrends.map((h, i) => (
                    <div key={i} className="flex-1 min-w-[40px] flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] md:text-[10px] font-mono text-emerald-400 font-bold">{h.platelets}k</span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${h.platelets < 150 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ height: `${(h.platelets / 250) * 100}%` }}
                      ></div>
                      <span className="text-[8px] md:text-[9px] text-slate-400 whitespace-nowrap">{h.date.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setShowTrendsModal(false)} className="w-full py-2.5 bg-[#0B4EA2] text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition mt-2">
              Close Analytics View
            </button>
          </div>
        </div>
      )}

      {/* WHATSAPP MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border ${cardTheme}`}>
            <div className="flex justify-between items-center border-b border-slate-500/20 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-500">
                <Send size={16} /> Instant WhatsApp EHR Dispatch
              </h3>
              <button onClick={() => setShowWhatsAppModal(false)} className="text-slate-400 hover:text-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs space-y-2">
              <p className="text-slate-400">Sending to: <span className="font-mono font-bold text-emerald-500">{selectedPatient?.phone}</span></p>
              <div className="bg-emerald-950 text-emerald-100 p-3 rounded-xl font-mono text-[11px] leading-relaxed border border-emerald-800 max-h-40 overflow-y-auto">
                <p className="font-bold mb-1">Hello {selectedPatient?.fullName || "Patient"},</p>
                <p>Prescription in {rxLanguage.toUpperCase()}:</p>
                {rxTranslations[rxLanguage].plan.map((t, idx) => (
                  <p key={idx} className="mt-1">- {t}</p>
                ))}
              </div>
            </div>

            <button onClick={() => { setShowWhatsAppModal(false); showToast(`Prescription sent to ${selectedPatient?.fullName || "Patient"}'s WhatsApp!`); }} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition mt-2">
              Send WhatsApp Message Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
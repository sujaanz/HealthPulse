"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SpeechInput from "../../components/SpeechInput";

const translations: Record<string, any> = {
  "bn-IN": {
    kioskTitle: "HealthPulse Smart Kiosk",
    mainTitle: "Patient Intake & Case Taking",
    subtitle: "Provide symptoms or upload records for AI Clinical Decision Support.",
    modeLabel: "System Mode",
    langLabel: "Consultation Language",
    narrativeLabel: "Patient Clinical Narrative (Spoken or Typed)",
    narrativePlaceholder: "রোগীর লক্ষণ, স্থায়িত্ব এবং শারীরিক অবস্থার বিবরণ এখানে বলুন বা লিখুন...",
    ayushPlaceholder: "রোগীর লক্ষণ, প্রকৃতি এবং আহার-বিহার সম্পর্কে বিস্তারিত লিখুন...",
    submitBtn: "Run Clinical Analysis & CDS",
    loadingText: "Processing AI Analysis...",
    ocrTitle: "Scan / Parse Old Medical Report",
    ocrSubtitle: "Paste past prescription or lab report text for automated data extraction.",
    ocrPlaceholder: "Paste report text here (e.g., Hb: 11.5 g/dl, Blood sugar elevated...)",
    ocrBtn: "Extract & Attach via AI OCR",
    ocrLoading: "Extracting Data...",
    ocrSuccess: "✅ OCR Extracted Successfully"
  },
  "en-IN": {
    kioskTitle: "HealthPulse Smart Kiosk",
    mainTitle: "Patient Intake & Case Taking",
    subtitle: "Provide symptoms or upload records for AI Clinical Decision Support.",
    modeLabel: "System Mode",
    langLabel: "Consultation Language",
    narrativeLabel: "Patient Clinical Narrative (Spoken or Typed)",
    narrativePlaceholder: "Describe patient symptoms, duration, and clinical condition...",
    ayushPlaceholder: "Describe patient symptoms, constitution, and diet/lifestyle...",
    submitBtn: "Run Clinical Analysis & CDS",
    loadingText: "Processing AI Analysis...",
    ocrTitle: "Scan / Parse Old Medical Report",
    ocrSubtitle: "Paste past prescription or lab report text for automated data extraction.",
    ocrPlaceholder: "Paste report text here (e.g., Hb: 11.5 g/dl, Blood sugar elevated...)",
    ocrBtn: "Extract & Attach via AI OCR",
    ocrLoading: "Extracting Data...",
    ocrSuccess: "✅ OCR Extracted Successfully"
  },
  "hi-IN": {
    kioskTitle: "HealthPulse Smart Kiosk",
    mainTitle: "Patient Intake & Case Taking",
    subtitle: "Provide symptoms or upload records for AI Clinical Decision Support.",
    modeLabel: "System Mode",
    langLabel: "Consultation Language",
    narrativeLabel: "Patient Clinical Narrative (Spoken or Typed)",
    narrativePlaceholder: "रोगी के लक्षणों, अवधि और नैदानिक स्थिति का वर्णन करें...",
    ayushPlaceholder: "रोगी के लक्षणों, प्रकृति और आहार-विहार का वर्णन करें...",
    submitBtn: "Run Clinical Analysis & CDS",
    loadingText: "Processing AI Analysis...",
    ocrTitle: "Scan / Parse Old Medical Report",
    ocrSubtitle: "Paste past prescription or lab report text for automated data extraction.",
    ocrPlaceholder: "Paste report text here (e.g., Hb: 11.5 g/dl, Blood sugar elevated...)",
    ocrBtn: "Extract & Attach via AI OCR",
    ocrLoading: "Extracting Data...",
    ocrSuccess: "✅ OCR Extracted Successfully"
  }
};

export default function CaseEntryPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("bn-IN");
  const [mode, setMode] = useState("Allopathy");
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);

  const [rawOcrText, setRawOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const t = translations[language] || translations["en-IN"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrative.trim()) return alert("Clinical narrative cannot be empty");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/clinical/analyze", {
        patient_id: 1,
        narrative,
        language,
        mode
      });
      
      sessionStorage.setItem("working_analysis", JSON.stringify({
        raw_narrative: narrative,
        language,
        mode,
        patient_id: 1,
        ...res.data
      }));
      router.push("/review");
    } catch (err) {
      alert("Error connecting to backend API (http://localhost:8000). Check if backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOcrAnalyze = async () => {
    if (!rawOcrText.trim()) return alert("Please enter or paste report text for OCR analysis.");
    setOcrLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/clinical/ocr", {
        raw_text: rawOcrText
      });
      setOcrResult(res.data);
      setNarrative((prev) => 
        prev ? `${prev}\n[OCR Report Summary: ${res.data.summary}]` : `[OCR Report Summary: ${res.data.summary}]`
      );
    } catch (err) {
      alert("OCR processing failed. Ensure backend is running.");
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Modern Header Banner */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              {t.kioskTitle}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.mainTitle}</h1>
            <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-md shadow-slate-200">
            Mode: <span className="text-indigo-400 font-extrabold">{mode}</span>
          </div>
        </div>

        {/* Main Card Workspace */}
        <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-8">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">{t.langLabel}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer shadow-inner"
              >
                <option value="bn-IN">Bengali (বাংলা)</option>
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">Hindi (हिन्दी)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">{t.modeLabel}</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer shadow-inner"
              >
                <option value="Allopathy">Allopathy</option>
                <option value="Ayush">Ayush / Ayurveda</option>
              </select>
            </div>
          </div>

          {/* Voice Input Section with Sleek Modern Container */}
          <div className="bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/30 border border-indigo-100/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">Voice Dictation</h4>
                <p className="text-xs text-slate-500">Click to speak symptoms directly into the narrative.</p>
              </div>
            </div>
            <div className="[&>button]:bg-indigo-600 [&>button]:hover:bg-indigo-700 [&>button]:text-white [&>button]:px-4 [&>button]:py-2.5 [&>button]:rounded-xl [&>button]:font-bold [&>button]:text-xs [&>button]:shadow-md [&>button]:shadow-indigo-100 [&>button]:transition-all">
              <SpeechInput 
                language={language} 
                onTranscriptChange={(txt: string) => setNarrative((prev: string) => prev ? prev + " " + txt : txt)} 
              />
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2.5">
                {t.narrativeLabel}
              </label>
              
              <textarea
                rows={6}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder={mode === "Ayush" ? t.ayushPlaceholder : t.narrativePlaceholder}
                className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl p-4 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all leading-relaxed shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-base font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.loadingText}
                </span>
              ) : (
                `Run ${mode} Clinical Analysis & CDS`
              )}
            </button>
          </form>

          {/* OCR Feature Card */}
          <div className="border border-slate-200/80 bg-slate-50/70 rounded-2xl p-6 space-y-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                📄
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{t.ocrTitle}</h3>
                <p className="text-xs text-slate-500">{t.ocrSubtitle}</p>
              </div>
            </div>

            <textarea
              rows={2}
              value={rawOcrText}
              onChange={(e) => setRawOcrText(e.target.value)}
              placeholder={t.ocrPlaceholder}
              className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition-all shadow-inner"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleOcrAnalyze}
                disabled={ocrLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50 cursor-pointer"
              >
                {ocrLoading ? t.ocrLoading : t.ocrBtn}
              </button>
            </div>

            {ocrResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1.5 shadow-sm">
                <p className="font-extrabold flex items-center gap-1.5 text-emerald-800">{t.ocrSuccess}</p>
                <p><strong>Type:</strong> {ocrResult.document_type}</p>
                <p><strong>Summary:</strong> {ocrResult.summary}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
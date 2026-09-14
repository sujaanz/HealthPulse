"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SpeechInput from "../../components/SpeechInput";

export default function CaseEntryPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("bn-IN");
  const [mode, setMode] = useState("Allopathy"); // Allopathy or Ayush mode
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);

  // States for Document OCR Feature
  const [rawOcrText, setRawOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

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

  // Handler for OCR Analysis
  const handleOcrAnalyze = async () => {
    if (!rawOcrText.trim()) return alert("Please enter or paste report text for OCR analysis.");
    setOcrLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/clinical/ocr", {
        raw_text: rawOcrText
      });
      setOcrResult(res.data);
      // Automatically append OCR summary to the main clinical narrative
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4 md:mt-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-3 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Patient Intake & Case Taking</h2>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-200">
            AI Automated CDS ({mode} Mode)
          </span>
        </div>

        {/* Language and Mode Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            >
              <option value="bn-IN">Bengali (বাংলা)</option>
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">System Mode:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full font-medium text-indigo-600"
            >
              <option value="Allopathy">Allopathy (অ্যালোপ্যাথি)</option>
              <option value="Ayush">Ayush / Ayurveda (আয়ুর্বেদ)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <SpeechInput 
            language={language} 
            onTranscriptChange={(txt) => setNarrative((prev) => prev ? prev + " " + txt : txt)} 
          />
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Patient Clinical Narrative (Spoken or Typed)
            </label>
            <textarea
              rows={5}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder={mode === "Ayush" ? "রোগীর লক্ষণ এবং আহার-বিহার, জীবনযাত্রা সম্পর্কে লিখুন..." : "রোগীর সমস্যার বিবরণ বলুন বা লিখুন..."}
              className="w-full border rounded-lg p-3 text-slate-800 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white text-sm md:text-base font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 px-2 text-center shadow-md mb-6"
          >
            {loading ? "Processing Clinical NLP & AI Decision Support..." : `Run ${mode} Clinical Analysis & CDS`}
          </button>
        </form>

        {/* OCR / Old Medical Report Scanner Section */}
        <div className="border-t pt-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            📄 Scan / Parse Old Medical Report (OCR Feature)
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            পুরোনো প্রেসক্রিপশন বা ল্যাব রিপোর্টের টেক্সট এখানে পেস্ট করুন। এআই স্বয়ংক্রিয়ভাবে সেখান থেকে জরুরি ডেটা বের করে কেস ন্যারেশনের সাথে জুড়ে দেবে।
          </p>
          <textarea
            rows={3}
            value={rawOcrText}
            onChange={(e) => setRawOcrText(e.target.value)}
            placeholder="উদাহরণ: Hb: 11.5 g/dl, Paracetamol 650mg prescribed for 3 days..."
            className="w-full border rounded-md p-2.5 text-xs text-slate-800 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3 bg-white"
          />
          <button
            type="button"
            onClick={handleOcrAnalyze}
            disabled={ocrLoading}
            className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
          >
            {ocrLoading ? "Extracting Report Data..." : "Extract & Attach Report via AI OCR"}
          </button>

          {/* Display OCR Result Preview if available */}
          {ocrResult && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900">
              <p className="font-bold mb-1">✅ OCR Extracted Successfully:</p>
              <p><strong>Type:</strong> {ocrResult.document_type}</p>
              <p><strong>Summary:</strong> {ocrResult.summary}</p>
              {ocrResult.extracted_medications?.length > 0 && (
                <p><strong>Medicines Found:</strong> {ocrResult.extracted_medications.map((m: any) => m.medicine_name).join(", ")}</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SpeechInput from "../../components/SpeechInput";

export default function CaseEntryPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("bn-IN");
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrative.trim()) return alert("Clinical narrative cannot be empty");

    setLoading(true);
    try {
      const res = await axios.post("https://healthpulse-4d9z.onrender.com/api/clinical/analyze", {
        patient_id: 1,
        narrative,
        language
      });
      sessionStorage.setItem("working_analysis", JSON.stringify({
        raw_narrative: narrative,
        language,
        patient_id: 1,
        ...res.data
      }));
      router.push("/review");
    } catch (err) {
      alert("Error connecting to backend API (https://healthpulse-4d9z.onrender.com). Check if backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4 md:mt-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-3 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Patient Intake & Case Taking</h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold border">
            AI Automated CDS
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-semibold text-slate-700">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            >
              <option value="bn-IN">Bengali (বাংলা)</option>
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <SpeechInput 
              language={language} 
              onTranscriptChange={(txt) => setNarrative((prev) => prev ? prev + " " + txt : txt)} 
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Patient Clinical Narrative (Spoken or Typed)
            </label>
            <textarea
              rows={7}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="রোগীর সমস্যার বিবরণ বলুন বা লিখুন..."
              className="w-full border rounded-lg p-3 text-slate-800 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white text-sm md:text-base font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 px-2 text-center"
          >
            {loading ? "Processing Clinical NLP & AI Decision Support..." : "Run Clinical NLP & Decision Support"}
          </button>
        </form>
      </div>
    </div>
  );
}
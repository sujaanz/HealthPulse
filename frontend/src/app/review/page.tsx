"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("working_analysis");
    if (!raw) {
      router.push("/case-entry");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) return <div className="p-6 text-center text-slate-600">Loading Case Review...</div>;

  const handleFieldChange = (field: string, val: string) => {
    setData({
      ...data,
      structured_info: {
        ...data.structured_info,
        [field]: val,
      },
    });
  };

  const finalizeCase = async () => {
    setSaving(true);
    try {
      await axios.post("http://localhost:8000/api/encounters/finalize", {
        patient_id: data.patient_id,
        doctor_name: "Dr. Ballav",
        raw_narrative: data.raw_narrative,
        language: data.language,
        structured_info: data.structured_info,
        cds_insights: data.clinical_decision_support,
        case_summary: data.case_summary,
      });
      alert("Case approved and permanently committed to database!");
      sessionStorage.removeItem("working_analysis");
      router.push("/case-entry");
    } catch (err) {
      alert("Failed to finalize encounter. Make sure backend is running.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Doctor Review Gate (Editable)</h3>

        {data.missing_information?.is_missing && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-5 rounded-r">
            <h4 className="font-bold text-amber-800 text-sm">Missing Information Detected:</h4>
            <ul className="list-disc pl-5 text-xs text-amber-700 mt-1">
              {data.missing_information.missing_elements.map((el: string, i: number) => (
                <li key={i}>{el}</li>
              ))}
            </ul>
            <div className="mt-2 text-xs font-semibold text-amber-900 bg-amber-100 p-2 rounded">
              Suggested Questions: {data.missing_information.suggested_followup_questions.join(" | ")}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Chief Complaint</label>
            <input
              type="text"
              value={data.structured_info.chief_complaint || ""}
              onChange={(e) => handleFieldChange("chief_complaint", e.target.value)}
              className="w-full border rounded-md p-2 text-sm mt-1 border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Duration</label>
            <input
              type="text"
              value={data.structured_info.duration || ""}
              onChange={(e) => handleFieldChange("duration", e.target.value)}
              className="w-full border rounded-md p-2 text-sm mt-1 border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Allergy History</label>
            <input
              type="text"
              value={data.structured_info.allergy_history || ""}
              onChange={(e) => handleFieldChange("allergy_history", e.target.value)}
              className="w-full border rounded-md p-2 text-sm mt-1 border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Case Summary</label>
            <textarea
              rows={3}
              value={data.case_summary || ""}
              onChange={(e) => setData({ ...data, case_summary: e.target.value })}
              className="w-full border rounded-md p-2 text-sm mt-1 border-slate-300"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={finalizeCase}
            disabled={saving}
            className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {saving ? "Finalizing..." : "Approve & Finalize Case"}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit space-y-4">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Clinical Decision Support</h3>
        
        {data.clinical_decision_support?.red_flag_alerts?.length > 0 && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-xs">
            <span className="font-bold block mb-1">🚨 RED FLAGS:</span>
            <ul className="list-disc pl-4 space-y-1">
              {data.clinical_decision_support.red_flag_alerts.map((rf: string, i: number) => (
                <li key={i}>{rf}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Differential Diagnoses</span>
          <div className="flex flex-wrap gap-1">
            {data.clinical_decision_support?.differential_considerations?.map((d: string, i: number) => (
              <span key={i} className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-md font-medium">
                {d}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Recommended Labs</span>
          <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
            {data.clinical_decision_support?.relevant_investigations?.map((inv: string, i: number) => (
              <li key={i}>{inv}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
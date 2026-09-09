"use client";
import React, { useState, useEffect } from "react";

interface SpeechProps {
  language: string;
  onTranscriptChange: (text: string) => void;
}

export default function SpeechInput({ language, onTranscriptChange }: SpeechProps) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = false; // false to prevent repeats

      recognizer.onresult = (event: any) => {
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          }
        }
        if (finalChunk) {
          onTranscriptChange(finalChunk.trim());
        }
      };

      recognizer.onerror = () => setListening(false);
      recognizer.onend = () => setListening(false);
      setRecognition(recognizer);
    }
  }, [onTranscriptChange]);

  const toggleListening = () => {
    if (!recognition) return alert("Speech API not supported. Please use Google Chrome.");
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.lang = language;
      recognition.start();
      setListening(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`w-full sm:w-auto px-4 py-2.5 md:py-2 text-sm md:text-base rounded-lg font-medium transition flex items-center justify-center gap-2 ${
        listening 
          ? "bg-red-600 text-white animate-pulse" 
          : "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
      }`}
    >
      <span>{listening ? "⏹ Stop Recording" : "🎤 Start Voice Input"}</span>
    </button>
  );
}
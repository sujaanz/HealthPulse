import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthPulse CDS",
  description: "AI Clinical Decision Support System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 min-h-screen text-slate-800">{children}</body>
    </html>
  );
}
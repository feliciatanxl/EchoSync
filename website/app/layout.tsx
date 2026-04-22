import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoSync — AI-Powered Community Wellbeing & Safety System",
  description:
    "Shifting care from reactive response to proactive protection. EchoSync leverages secure IoT sensors and cloud-based AI to protect Singapore's seniors — PDPA compliant, zero-stigma, privacy-first.",
  keywords: [
    "EchoSync",
    "healthcare",
    "Smart Nation",
    "Singapore",
    "elderly care",
    "AI monitoring",
    "IoT safety",
    "PDPA compliant",
    "HDB",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

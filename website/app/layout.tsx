import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoSync — AI-Assisted Home Safety for Seniors Living Alone",
  description:
    "EchoSync is a privacy-first pre-arrival intelligence and first response ecosystem that detects possible home emergencies earlier using ambient sensing, Edge AI verification, caregiver support, and SCDF-style response routing.",
  keywords: [
    "EchoSync",
    "SCDF",
    "Dell Technologies",
    "elderly care",
    "AI emergency response",
    "Edge AI",
    "IoT safety",
    "HDB",
    "caregiver verification",
    "myResponder",
  ],
};

import AIChatBot from "@/components/AIChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <AIChatBot />
      </body>
    </html>
  );
}

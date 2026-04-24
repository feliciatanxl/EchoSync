import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EchoSync | Command Center — B2G Healthcare Monitoring Portal",
  description:
    "AI-powered community wellbeing and safety system. Real-time monitoring dashboard for Singapore's Smart Nation healthcare infrastructure. PDPA compliant.",
  keywords: [
    "EchoSync",
    "healthcare monitoring",
    "B2G",
    "Smart Nation",
    "Singapore",
    "AI safety",
    "elderly care",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import DashboardLayout from "@/components/DashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-deep text-text-primary">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProfileSection from "@/components/echosync/ProfileSection";
import StatusGrid from "@/components/echosync/StatusGrid";
import AlertMessage from "@/components/echosync/AlertMessage";
import ActionList from "@/components/echosync/ActionList";
import EmergencyNote from "@/components/echosync/EmergencyNote";
import BottomNav from "@/components/echosync/BottomNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Warm header */}
      <header className="px-5 pt-12 pb-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium">EchoSync Caregiver</p>
              <h1 className="text-2xl font-bold mt-1 tracking-tight">Hi Mei Ling 👋</h1>
              <p className="text-indigo-100 text-sm mt-1">Here's how Mdm Tan is doing today.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <svg className="w-3.5 h-3.5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-[11px] text-indigo-100 tracking-wide uppercase font-medium">Secure Demo · Hackathon Prototype</span>
          </div>
        </div>
      </header>

      {/* Open flowing content — no stacked boxes */}
      <div className="px-5 -mt-5 relative z-10">
        <ProfileSection />
      </div>

      <div className="px-5 mt-6">
        <StatusGrid />
      </div>

      <div className="px-5 mt-6">
        <AlertMessage />
      </div>

      <div className="px-5 mt-6">
        <ActionList />
      </div>

      <div className="px-5 mt-5">
        <EmergencyNote />
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
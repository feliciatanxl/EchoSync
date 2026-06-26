import React from "react";
import { motion } from "framer-motion";

export default function ProfileSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 p-5"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-600">TS</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-slate-900">Mdm Tan Siew Lan</h2>
          <p className="text-xs text-slate-500 mt-0.5">Blk 302 Ang Mo Kio Ave 3, #08-112</p>
          <p className="text-xs text-slate-400 mt-0.5">Living Room Ceiling Hub</p>
        </div>
      </div>

      {/* Inline monitoring status — no separate box */}
      <div className="mt-4 flex items-center gap-2.5 pt-4 border-t border-slate-100">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-700">All normal — monitoring quietly</p>
          <p className="text-xs text-slate-400 mt-0.5">Last activity 9:42 AM · Node online</p>
        </div>
      </div>
    </motion.div>
  );
}
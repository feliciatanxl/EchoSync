import React from "react";
import { motion } from "framer-motion";

export default function AlertMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex items-start gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-sm font-semibold text-slate-900">No active alerts</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Mdm Tan's EchoSync device is monitoring normally. Last check-in 30 seconds ago.
        </p>
        <p className="text-[11px] text-slate-400 mt-1.5">Updated 09:45 pm</p>
      </div>
    </motion.div>
  );
}
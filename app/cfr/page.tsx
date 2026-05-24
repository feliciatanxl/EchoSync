'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  MapPin,
  Navigation,
  Zap,
  Phone,
  HeartPulse,
  CheckCircle2,
  Activity,
  Shield,
} from 'lucide-react';

type ResponseState = 'ALERT_RECEIVED' | 'NAVIGATING' | 'ON_SCENE_CPR' | 'COMPLETED';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CFRPage() {
  const [responseState, setResponseState] = useState<ResponseState>('ALERT_RECEIVED');
  const [aedRetrieved, setAedRetrieved] = useState(false);
  const [cprCycles, setCprCycles] = useState(0);
  const [aedApplied, setAedApplied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Mount guard for hydration
  useEffect(() => setMounted(true), []);

  // Timer — ticks every second when NOT on ALERT_RECEIVED
  useEffect(() => {
    if (responseState === 'ALERT_RECEIVED') return;
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [responseState]);

  // Reset helper
  const resetAll = useCallback(() => {
    setResponseState('ALERT_RECEIVED');
    setCprCycles(0);
    setAedRetrieved(false);
    setAedApplied(false);
    setElapsed(0);
  }, []);

  if (!mounted) return null;

  // ═══════════════════════════════════════════════
  //  SCREEN 1 — ALERT_RECEIVED
  // ═══════════════════════════════════════════════
  const renderAlertReceived = () => (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* ── Top Alert Banner ── */}
      <div className="pt-10 pb-6 px-6 text-center bg-gradient-to-b from-rose-950/60 to-transparent">
        <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500/40 flex items-center justify-center mx-auto mb-4 animate-status-blink">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
          EMERGENCY ALERT
        </h1>
        <p className="text-sm text-slate-400">
          Suspected cardiac arrest / heavy fall
        </p>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pb-6 space-y-4">
        {/* Location Card */}
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">
                  Blk 124 #04-12, Lor 1 Toa Payoh
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Navigation className="w-3 h-3 text-teal-400" />
                  <span className="text-xs text-slate-400">120m from you</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Row — Floor + ETA */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700/50 p-3 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Floor
            </p>
            <p className="text-xl font-extrabold text-white">L4</p>
          </div>
          <div className="rounded-xl bg-slate-800/80 border border-slate-700/50 p-3 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              ETA
            </p>
            <p className="text-xl font-extrabold text-teal-400">~2 min</p>
          </div>
        </div>

        {/* AED Card */}
        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/20 p-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">AED Available Nearby</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 ml-[42px]">
            Blk 124 Void Deck — 40m from incident
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => setResponseState('NAVIGATING')}
            className="w-full py-4 rounded-2xl bg-rose-600 text-white text-base font-extrabold tracking-wide
                       shadow-[0_0_30px_rgba(225,29,72,0.35)] hover:bg-rose-500 hover:shadow-[0_0_40px_rgba(225,29,72,0.5)]
                       hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            ACCEPT &amp; RESPOND
          </button>
          <button
            className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-sm font-semibold
                       hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════
  //  SCREEN 2 — NAVIGATING
  // ═══════════════════════════════════════════════
  const renderNavigating = () => (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* ── Top Header ── */}
      <div className="px-5 pt-6 pb-4">
        <div className="rounded-2xl bg-slate-800/80 border border-teal-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-400" />
                </div>
                {/* Pulsing dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-teal-400">Responding</p>
                <p className="text-xs text-slate-400">
                  Elapsed:{' '}
                  <span className="font-mono font-bold text-white">{formatTime(elapsed)}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Incident
              </p>
              <p className="text-sm font-bold text-white">#INC-089</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pb-6 space-y-4">
        {/* Navigation Card */}
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/50 p-5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">
            Navigation
          </p>
          <div className="flex flex-col items-center py-4">
            <div className="w-20 h-20 rounded-full bg-teal-500/10 border-2 border-teal-500/30 flex items-center justify-center mb-4">
              <Navigation className="w-10 h-10 text-teal-400 -rotate-45" />
            </div>
            <p className="text-3xl font-extrabold text-white">120m</p>
            <p className="text-sm text-slate-400 mt-1">Head Northeast</p>
            <p className="text-xs text-slate-500 mt-1.5">
              Blk 124 #04-12 • L4
            </p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-700/30 mt-2">
            <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <p className="text-xs text-slate-400">
              Take Lift A to Level 4. Unit #04-12 is on the right.
            </p>
          </div>
        </div>

        {/* AED Retrieval Card */}
        <div
          className={`rounded-2xl border p-4 transition-all duration-500 ${
            aedRetrieved
              ? 'bg-emerald-950/20 border-emerald-500/20'
              : 'bg-slate-800/80 border-slate-700/50'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <Zap className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              AED Retrieval
            </p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">Blk 124 Void Deck</p>
              <p className="text-xs text-slate-400">AED Cabinet near Lift Lobby A • 40m</p>
            </div>
            {aedRetrieved && (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-step-complete" />
            )}
          </div>
          {!aedRetrieved ? (
            <button
              onClick={() => setAedRetrieved(true)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold
                         hover:bg-emerald-500 active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              Confirm AED Retrieved
            </button>
          ) : (
            <p className="text-sm text-emerald-400 font-semibold text-center py-1 animate-fade-in">
              ✓ AED Retrieved — Proceed to unit
            </p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => setResponseState('ON_SCENE_CPR')}
            className="w-full py-4 rounded-2xl bg-rose-600 text-white text-base font-extrabold tracking-wide
                       shadow-[0_0_30px_rgba(225,29,72,0.35)] hover:bg-rose-500 hover:shadow-[0_0_40px_rgba(225,29,72,0.5)]
                       hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            ARRIVED ON SCENE
          </button>
          <button
            className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold
                       flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            Call SCDF 995
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════
  //  SCREEN 3 — ON_SCENE_CPR
  // ═══════════════════════════════════════════════
  const renderOnSceneCPR = () => (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* ── Top Header ── */}
      <div className="px-5 pt-6 pb-4">
        <div className="rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center animate-status-blink">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              {/* Pulsing ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-rose-500/20" />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-rose-400">ON SCENE — CPR Mode</p>
              <p className="text-xs text-slate-400">
                SCDF ambulance ETA:{' '}
                <span className="font-bold text-white">6 min</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pb-6 space-y-4">
        {/* CPR Guidance Card */}
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/50 p-5">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">
            CPR Guidance
          </p>
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-700/30">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="text-[13px] font-bold text-white">Check responsiveness</p>
                <p className="text-[11px] text-slate-400">Tap shoulders, call out loudly</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-700/30">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="text-[13px] font-bold text-white">Begin chest compressions</p>
                <p className="text-[11px] text-slate-400">
                  30 compressions, 2 breaths • Rate: 100–120/min
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-700/30">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="text-[13px] font-bold text-white">Apply AED</p>
                <p className="text-[11px] text-slate-400">
                  Follow AED voice prompts. Ensure pads placed correctly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* CPR Cycle Counter */}
          <button
            onClick={() => setCprCycles((prev) => prev + 1)}
            className="w-full py-4 rounded-2xl bg-rose-600 text-white text-[15px] font-extrabold
                       shadow-[0_0_20px_rgba(225,29,72,0.25)] hover:bg-rose-500
                       active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            CPR Cycle Complete ({cprCycles})
          </button>

          {/* AED Pads Applied */}
          {!aedApplied ? (
            <button
              onClick={() => setAedApplied(true)}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold
                         flex items-center justify-center gap-2 hover:bg-emerald-500
                         active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              <Zap className="w-5 h-5" />
              AED Pads Applied
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400
                            text-sm font-bold flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              ✓ AED Active — Follow Prompts
            </div>
          )}

          {/* Pulse Detected */}
          <button
            className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-[13px] font-semibold
                       flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Pulse Detected — Update Status
          </button>

          {/* Hand Over */}
          <button
            onClick={() => setResponseState('COMPLETED')}
            className="w-full py-3.5 rounded-2xl bg-teal-600 text-white text-sm font-bold
                       hover:bg-teal-500 active:scale-[0.97] transition-all duration-200 mt-2 cursor-pointer"
          >
            SCDF Arrived — Hand Over
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════
  //  SCREEN 4 — COMPLETED
  // ═══════════════════════════════════════════════
  const renderCompleted = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 animate-fade-in">
      {/* Checkmark */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
      </div>

      <h1 className="text-2xl font-extrabold text-white mb-2 text-center">Response Complete</h1>
      <p className="text-sm text-slate-400 text-center max-w-xs mb-8">
        Thank you for your response. SCDF has taken over the incident.
      </p>

      {/* Stats Card */}
      <div className="w-full rounded-2xl bg-slate-800/80 border border-slate-700/50 p-5 space-y-3.5 mb-8">
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-400">Incident</span>
          <span className="font-semibold text-white">#INC-2026-089</span>
        </div>
        <div className="h-px bg-slate-700/40" />
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-400">Response Time</span>
          <span className="font-bold text-teal-400 font-mono">{formatTime(elapsed)}</span>
        </div>
        <div className="h-px bg-slate-700/40" />
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-400">CPR Cycles</span>
          <span className="font-semibold text-white">{cprCycles}</span>
        </div>
        <div className="h-px bg-slate-700/40" />
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-400">AED Used</span>
          <span className={`font-semibold ${aedApplied ? 'text-emerald-400' : 'text-slate-400'}`}>
            {aedApplied ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="h-px bg-slate-700/40" />
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-400">Handover</span>
          <span className="font-semibold text-emerald-400">SCDF Paramedics</span>
        </div>
      </div>

      {/* Return Button */}
      <button
        onClick={resetAll}
        className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold
                   hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        Return to Standby
      </button>

      <p className="text-[11px] text-slate-600 mt-6 text-center">
        Your response data is recorded for SCDF audit purposes. • PDPA Aligned
      </p>
    </div>
  );

  // ═══════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════
  const screens: Record<ResponseState, () => React.JSX.Element> = {
    ALERT_RECEIVED: renderAlertReceived,
    NAVIGATING: renderNavigating,
    ON_SCENE_CPR: renderOnSceneCPR,
    COMPLETED: renderCompleted,
  };

  return (
    <div className="max-w-md mx-auto w-full min-h-screen bg-slate-950 text-white shadow-2xl relative overflow-hidden">
      {screens[responseState]()}
    </div>
  );
}

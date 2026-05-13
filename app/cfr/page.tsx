'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle, MapPin, Clock, Heart, CheckCircle2,
  Navigation, Phone, Shield, ArrowRight, ChevronRight, Activity
} from 'lucide-react';
import { useElapsedTime } from '@/lib/useSimulation';

type CFRScreen = 'incoming' | 'active' | 'cpr' | 'complete';

export default function CFRPage() {
  const [screen, setScreen] = useState<CFRScreen>('incoming');
  const [mounted, setMounted] = useState(false);
  const { formatted: elapsed } = useElapsedTime(0);
  const [cprCount, setCprCount] = useState(0);
  const [aedRetrieved, setAedRetrieved] = useState(false);
  const [aedApplied, setAedApplied] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // ---- INCOMING ALERT SCREEN ----
  if (screen === 'incoming') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 max-w-lg mx-auto">
        {/* Alert Card */}
        <div className="w-full glass-elevated rounded-3xl border-2 border-alert-high/40 overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-fade-in">
          {/* Header */}
          <div className="bg-alert-high/10 border-b border-alert-high/20 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-alert-high text-white flex items-center justify-center mx-auto mb-4 animate-status-blink">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">EMERGENCY ALERT</h1>
            <p className="text-[14px] text-text-secondary">Suspected cardiac arrest / heavy fall</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-deep border border-border/40">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-alert-high" />
                <div>
                  <p className="text-[14px] font-bold text-text-primary">Blk 124 #04-12</p>
                  <p className="text-[12px] text-text-muted">Lor 1 Toa Payoh</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-accent">120m</p>
                <p className="text-[11px] text-text-muted">from you</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-bg-deep border border-border/40 text-center">
                <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Floor</p>
                <p className="text-[18px] font-bold text-text-primary">L4</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-deep border border-border/40 text-center">
                <p className="text-[10px] text-text-muted uppercase font-bold mb-1">ETA</p>
                <p className="text-[18px] font-bold text-accent">~2 min</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-alert-low/10 border border-alert-low/20">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-alert-low" />
                <span className="text-[12px] font-bold text-alert-low">AED Available Nearby</span>
              </div>
              <p className="text-[11px] text-text-muted">Blk 124 Void Deck — 40m from incident</p>
            </div>
          </div>

          {/* Accept Button */}
          <div className="p-6 pt-2 space-y-3">
            <button
              onClick={() => setScreen('active')}
              className="w-full py-4 rounded-2xl bg-alert-high text-white text-[16px] font-bold hover:bg-alert-high/90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              ACCEPT & RESPOND
            </button>
            <button className="w-full py-3 rounded-2xl bg-bg-surface border border-border text-text-muted text-[14px] font-medium">
              Decline
            </button>
          </div>
        </div>

        <p className="text-[11px] text-text-muted mt-6 text-center">
          EchoSync CFR Alert • myResponder Integration • SCDF Coordination
        </p>
      </div>
    );
  }

  // ---- ACTIVE RESPONSE SCREEN ----
  if (screen === 'active') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col p-4 max-w-lg mx-auto animate-fade-in">
        {/* Status Header */}
        <div className="glass-elevated rounded-2xl border border-accent/30 p-4 mb-4 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent text-bg-deep">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-accent">Responding</p>
                <p className="text-[12px] text-text-muted">Elapsed: <span className="font-mono font-bold text-text-primary">{elapsed}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-text-muted uppercase">Incident</p>
              <p className="text-[13px] font-bold text-text-primary">#INC-089</p>
            </div>
          </div>
        </div>

        {/* Navigation Guidance */}
        <div className="glass-elevated rounded-2xl border border-border p-5 mb-4">
          <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">Navigation</h3>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 border-2 border-accent/30">
                <ArrowRight className="w-10 h-10 text-accent transform -rotate-45" />
              </div>
              <p className="text-[24px] font-bold text-text-primary">120m</p>
              <p className="text-[13px] text-text-muted">Head Northeast</p>
              <p className="text-[12px] text-text-secondary mt-1">Blk 124 #04-12 • L4</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-deep border border-border/30 text-[12px]">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <p className="text-text-secondary">Take Lift A to Level 4. Unit #04-12 is on the right.</p>
          </div>
        </div>

        {/* AED Pickup */}
        <div className={`glass-elevated rounded-2xl border p-5 mb-4 transition-all ${
          aedRetrieved ? 'border-alert-low/30 bg-alert-low/5' : 'border-alert-medium/30 bg-alert-medium/5'
        }`}>
          <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-alert-low" />
            AED Retrieval
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-bold text-text-primary">Blk 124 Void Deck</p>
              <p className="text-[11px] text-text-muted">AED Cabinet near Lift Lobby A • 40m</p>
            </div>
            {aedRetrieved ? (
              <CheckCircle2 className="w-6 h-6 text-alert-low" />
            ) : (
              <span className="text-[12px] font-bold text-alert-medium">Retrieve Now</span>
            )}
          </div>
          {!aedRetrieved && (
            <button
              onClick={() => setAedRetrieved(true)}
              className="w-full py-3 rounded-xl bg-alert-low text-bg-deep text-[14px] font-bold hover:bg-alert-low/80 active:scale-[0.98] transition-all"
            >
              Confirm AED Retrieved
            </button>
          )}
          {aedRetrieved && (
            <p className="text-[12px] text-alert-low font-medium text-center">✓ AED Retrieved — Proceed to unit</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={() => setScreen('cpr')}
            className="w-full py-4 rounded-2xl bg-alert-high text-white text-[15px] font-bold hover:bg-alert-high/90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            ARRIVED ON SCENE
          </button>
          <button className="w-full py-3 rounded-2xl bg-bg-surface border border-border text-text-primary text-[13px] font-semibold flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            Call SCDF 995
          </button>
        </div>
      </div>
    );
  }

  // ---- CPR STATUS UPDATE SCREEN ----
  if (screen === 'cpr') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col p-4 max-w-lg mx-auto animate-fade-in">
        {/* On Scene Header */}
        <div className="glass-elevated rounded-2xl border border-alert-high/30 p-4 mb-4 bg-alert-high/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-alert-high text-white animate-status-blink">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-alert-high">ON SCENE — CPR Mode</p>
              <p className="text-[12px] text-text-muted">SCDF ambulance ETA: <span className="font-bold text-text-primary">6 min</span></p>
            </div>
          </div>
        </div>

        {/* CPR Instructions */}
        <div className="glass-elevated rounded-2xl border border-border p-5 mb-4">
          <h3 className="text-[11px] font-bold text-alert-high uppercase tracking-widest mb-4">CPR Guidance</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-deep border border-border/30">
              <span className="w-6 h-6 rounded-full bg-alert-high text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="text-[13px] font-bold text-text-primary">Check responsiveness</p>
                <p className="text-[11px] text-text-muted">Tap shoulders, call out loudly</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-deep border border-border/30">
              <span className="w-6 h-6 rounded-full bg-alert-high text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="text-[13px] font-bold text-text-primary">Begin chest compressions</p>
                <p className="text-[11px] text-text-muted">30 compressions, 2 breaths • Rate: 100–120/min</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-deep border border-border/30">
              <span className="w-6 h-6 rounded-full bg-alert-low text-bg-deep text-[11px] font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="text-[13px] font-bold text-text-primary">Apply AED</p>
                <p className="text-[11px] text-text-muted">Follow AED voice prompts. Ensure pads placed correctly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setCprCount(prev => prev + 1)}
            className="w-full py-4 rounded-2xl bg-alert-high text-white text-[15px] font-bold active:scale-[0.97] transition-all relative overflow-hidden"
          >
            <span>CPR Cycle Complete ({cprCount})</span>
          </button>

          {!aedApplied ? (
            <button
              onClick={() => setAedApplied(true)}
              className="w-full py-3.5 rounded-2xl bg-alert-low text-bg-deep text-[14px] font-bold active:scale-[0.97] transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                AED Pads Applied
              </div>
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-2xl bg-alert-low/10 border border-alert-low/30 text-alert-low text-[14px] font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              AED Active — Follow Prompts
            </div>
          )}

          <button className="w-full py-3 rounded-2xl bg-bg-surface border border-border text-text-primary text-[13px] font-semibold flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            Pulse Detected — Update Status
          </button>

          <button
            onClick={() => setScreen('complete')}
            className="w-full py-3 rounded-2xl bg-accent text-bg-deep text-[14px] font-bold active:scale-[0.97] transition-all mt-4"
          >
            SCDF Arrived — Hand Over
          </button>
        </div>
      </div>
    );
  }

  // ---- COMPLETION SCREEN ----
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 max-w-lg mx-auto animate-fade-in">
      <div className="w-full glass-elevated rounded-3xl border border-alert-low/30 p-8 text-center bg-alert-low/5">
        <div className="w-20 h-20 rounded-2xl bg-alert-low text-bg-deep flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Response Complete</h1>
        <p className="text-[14px] text-text-muted mb-6">
          Thank you for your response. SCDF has taken over the incident.
        </p>

        <div className="space-y-3 text-left bg-bg-deep rounded-2xl p-5 border border-border/40 mb-6">
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">Incident</span>
            <span className="text-text-primary font-semibold">#INC-2026-089</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">Response Time</span>
            <span className="text-accent font-bold">{elapsed}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">CPR Cycles</span>
            <span className="text-text-primary font-semibold">{cprCount}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">AED Used</span>
            <span className="text-text-primary font-semibold">{aedApplied ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">Handover</span>
            <span className="text-alert-low font-semibold">SCDF Paramedics</span>
          </div>
        </div>

        <button
          onClick={() => {
            setScreen('incoming');
            setCprCount(0);
            setAedRetrieved(false);
            setAedApplied(false);
          }}
          className="w-full py-3 rounded-2xl bg-bg-surface border border-border text-text-primary text-[14px] font-semibold"
        >
          Return to Standby
        </button>
      </div>

      <p className="text-[11px] text-text-muted mt-6 text-center">
        Your response data is recorded for SCDF audit purposes. • PDPA Aligned
      </p>
    </div>
  );
}

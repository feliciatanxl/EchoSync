'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Activity, 
  Shield, 
  Radio, 
  Navigation, 
  PhoneCall, 
  Users, 
  Truck, 
  CheckCircle2, 
  ChevronRight,
  Info,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function IncidentTriagePage() {
  const [activeStage, setActiveStage] = useState<'triage' | 'responding' | 'resolved'>('triage');
  const [roverDispatched, setRoverDispatched] = useState(false);
  const [scdfEscalated, setScdfEscalated] = useState(false);
  const [caregiverNotified, setCaregiverNotified] = useState(false);

  // Simulated live timer
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-bg-deep font-sans">
      {/* Emergency Header */}
      <div className={`p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-500 ${
        activeStage === 'resolved' ? 'bg-success/10 border-success/20' : 'bg-alert-high/10 border-alert-high/20 animate-pulse'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${activeStage === 'resolved' ? 'bg-success text-bg-deep' : 'bg-alert-high text-bg-deep'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary tracking-tight">Active Incident: Heavy Fall Detected</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                activeStage === 'resolved' ? 'bg-success/20 text-success' : 'bg-alert-high text-bg-deep animate-bounce'
              }`}>
                {activeStage === 'resolved' ? 'Resolved' : 'CRITICAL'}
              </span>
            </div>
            <p className="text-[13px] text-text-muted mt-0.5">Incident ID: #FALL-9921 • Blk 213, Toa Payoh Lorong 8</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Time Elapsed</p>
            <p className={`text-2xl font-mono font-bold ${activeStage === 'resolved' ? 'text-success' : 'text-alert-high'}`}>
              {formatTime(elapsedTime)}
            </p>
          </div>
          {activeStage === 'resolved' ? (
            <Link href="/incidents" className="px-6 py-2.5 rounded-xl bg-bg-surface border border-border text-[13px] font-bold text-text-primary hover:bg-bg-hover transition-all">
              Return to Logs
            </Link>
          ) : (
            <button 
              onClick={() => setActiveStage('resolved')}
              className="px-6 py-2.5 rounded-xl bg-success text-bg-deep text-[13px] font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-[0.98]"
            >
              Mark as Resolved
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto xl:overflow-hidden flex flex-col xl:flex-row p-4 md:p-6 gap-6">
        {/* Left Column: Triage & Evidence */}
        <div className="w-full xl:w-[380px] space-y-6 xl:overflow-y-auto pr-2 flex-shrink-0">
          {/* AI Triage Card */}
          <div className="bg-bg-surface border border-border/60 rounded-3xl p-6">
            <h3 className="text-[11px] font-bold text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              AI Fusion Triage
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-bg-deep border border-border/40">
                <p className="text-[12px] text-text-muted leading-relaxed">
                  <span className="text-text-primary font-bold">Fused Evidence:</span> Multiple acoustic signatures (sharp thud) verified by thermal motion anomaly (horizontal orientation detected).
                </p>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-text-muted">Confidence Score</span>
                <span className="text-success font-bold">98.4%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '98.4%' }} />
              </div>
            </div>
          </div>

          {/* Resident Quick Info */}
          <div className="bg-bg-surface border border-border/60 rounded-3xl p-6">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Resident Profile
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-xl font-bold text-bg-deep">
                HT
              </div>
              <div>
                <p className="text-base font-bold text-text-primary">Mdm. Ho Teck Ghee</p>
                <p className="text-[12px] text-text-muted">Unit: #12-441 • High Risk</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded-xl bg-bg-deep border border-border/20">
                <p className="text-text-muted mb-1">Mobility</p>
                <p className="text-text-primary font-bold">Limited (Walker)</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-deep border border-border/20">
                <p className="text-text-muted mb-1">Medication</p>
                <p className="text-text-primary font-bold">Hyper-T</p>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-bg-surface border border-border/60 rounded-3xl p-6">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">Node Reliability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Radio className="w-3.5 h-3.5 text-success" />
                  Thermal Node 01
                </div>
                <span className="text-success font-medium italic">Online</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Radio className="w-3.5 h-3.5 text-success" />
                  Acoustic Node 04
                </div>
                <span className="text-success font-medium italic">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Live Feed / Activity */}
        <div className="flex-1 min-h-[400px] bg-bg-surface border border-border/60 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="p-6 border-b border-border/40 flex items-center justify-between bg-bg-elevated/30">
            <h3 className="text-[13px] font-bold text-text-primary flex items-center gap-2">
              <Radio className="w-4 h-4 text-alert-high animate-pulse" />
              Live Response Feed
            </h3>
            <span className="px-2 py-1 rounded bg-bg-deep text-[10px] font-bold text-text-muted">REAL-TIME SYNC</span>
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto font-mono">
            {/* Log Entries */}
            <div className="flex gap-4">
              <span className="text-[11px] text-text-muted whitespace-nowrap">23:45:12</span>
              <p className="text-[13px] text-alert-high font-bold italic">SYSTEM: [CRITICAL] Heavy Fall Detected in Living Room Zone B.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-[11px] text-text-muted whitespace-nowrap">23:45:14</span>
              <p className="text-[13px] text-accent">AI_TRIAGE: Confirmed Horizontal Orientation. Alert Escalated to Command Center.</p>
            </div>
            {caregiverNotified && (
              <div className="flex gap-4 animate-fade-in">
                <span className="text-[11px] text-text-muted whitespace-nowrap">23:45:30</span>
                <p className="text-[13px] text-text-primary underline">OPERATOR: Triggered Caregiver Notification (SMS/Call Sequence).</p>
              </div>
            )}
            {roverDispatched && (
              <div className="flex gap-4 animate-fade-in">
                <span className="text-[11px] text-text-muted whitespace-nowrap">23:45:45</span>
                <p className="text-[13px] text-success">SYSTEM: EchoRover #04 deployed from Lobby Dock. Estimated ETA: 45s.</p>
              </div>
            )}
            {scdfEscalated && (
              <div className="flex gap-4 animate-fade-in">
                <span className="text-[11px] text-text-muted whitespace-nowrap">23:46:02</span>
                <p className="text-[13px] text-alert-high font-black">OPERATOR: ESCALATED TO SCDF. Dispatch Case ID: #AMB-SG-8812.</p>
              </div>
            )}
            <div className="border-l-2 border-accent/20 h-full ml-[65px] opacity-20" />
          </div>

          {/* Bottom Prompt */}
          <div className="p-6 bg-bg-deep/50 border-t border-border/40">
            <div className="flex items-center gap-3 text-[12px] text-text-muted italic">
              <Info className="w-4 h-4 text-accent" />
              AI Suggestion: Resident has history of BP issues. Recommend Rover visual assessment before escalating to ambulance.
            </div>
          </div>
        </div>

        {/* Right Column: Response Workflow Action Page */}
        <div className="w-full xl:w-[340px] flex flex-col gap-4 flex-shrink-0">
          <div className="bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
            
            <h3 className="text-[13px] font-bold text-text-primary mb-6 flex items-center gap-2 relative z-10">
              <Navigation className="w-4 h-4 text-accent" />
              Response Actions
            </h3>

            <div className="space-y-3 relative z-10 flex-1">
              {/* Notify Caregiver */}
              <button 
                onClick={() => setCaregiverNotified(true)}
                disabled={caregiverNotified}
                className={`w-full group p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                  caregiverNotified 
                    ? 'bg-success/10 border-success/30 text-success' 
                    : 'bg-bg-elevated border-border hover:border-accent hover:bg-bg-hover text-text-primary'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-colors ${caregiverNotified ? 'bg-success/20' : 'bg-bg-surface group-hover:bg-accent/10 group-hover:text-accent text-text-muted'}`}>
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold">Notify Caregiver</p>
                  <p className="text-[10px] opacity-70 italic">{caregiverNotified ? 'Sequence Initiated' : 'Next of Kin / Daughter'}</p>
                </div>
                {caregiverNotified && <CheckCircle2 className="w-4 h-4 ml-auto" />}
              </button>

              {/* Notify Nearby Volunteer */}
              <button className="w-full group p-4 rounded-2xl bg-bg-elevated border border-border hover:border-accent hover:bg-bg-hover transition-all duration-300 flex items-center gap-4 text-text-primary">
                <div className="p-2.5 rounded-xl bg-bg-surface text-text-muted group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold">Broadcast to Volunteers</p>
                  <p className="text-[10px] opacity-70 italic">3 Nearby (Blk 213)</p>
                </div>
              </button>

              {/* Dispatch EchoRover */}
              <button 
                onClick={() => setRoverDispatched(true)}
                disabled={roverDispatched}
                className={`w-full group p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                  roverDispatched 
                    ? 'bg-accent/10 border-accent/30 text-accent' 
                    : 'bg-bg-elevated border-border hover:border-accent hover:bg-bg-hover text-text-primary'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-colors ${roverDispatched ? 'bg-accent text-bg-deep' : 'bg-bg-surface group-hover:bg-accent/10 group-hover:text-accent text-text-muted'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold">Dispatch EchoRover</p>
                  <p className="text-[10px] opacity-70 italic">{roverDispatched ? 'In Transit (ETA 45s)' : 'Autonomous Deployment'}</p>
                </div>
                {roverDispatched && <CheckCircle2 className="w-4 h-4 ml-auto" />}
              </button>

              {/* Escalate to SCDF */}
              <button 
                onClick={() => setScdfEscalated(true)}
                disabled={scdfEscalated}
                className={`w-full group p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                  scdfEscalated 
                    ? 'bg-alert-high/10 border-alert-high/30 text-alert-high' 
                    : 'bg-alert-high/10 border-alert-high/20 hover:bg-alert-high text-alert-high hover:text-bg-deep'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-colors ${scdfEscalated ? 'bg-alert-high text-bg-deep shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-bg-surface text-alert-high group-hover:bg-bg-deep'}`}>
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold uppercase tracking-tight">Escalate to SCDF</p>
                  <p className="text-[10px] opacity-70 italic">{scdfEscalated ? 'Ambulance Dispatched' : 'Emergency Dispatch'}</p>
                </div>
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-border/20">
              <button className="w-full flex items-center justify-center gap-2 text-[12px] font-bold text-text-muted hover:text-text-primary transition-colors py-2">
                <History className="w-4 h-4" />
                View Resident Logs
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

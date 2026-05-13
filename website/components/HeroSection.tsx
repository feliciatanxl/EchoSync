'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Shield, Activity, Wifi, X, Building, Mail, User, CheckCircle2, AlertTriangle, Heart, Radio, Clock, Users } from 'lucide-react';

// ---- Workflow Step Animation (Pure CSS + state) ----
interface WFStep {
  label: string;
  detail: string;
  icon: React.ElementType;
}

const workflowSteps: WFStep[] = [
  { label: 'Anomaly Detected', detail: 'Impact 82dB + thermal anomaly', icon: AlertTriangle },
  { label: 'Confidence Verified', detail: 'AI classification: 94.2%', icon: Activity },
  { label: 'CFR Notified', detail: '4 responders alerted nearby', icon: Users },
  { label: 'AED Coordinated', detail: 'Void Deck unit assigned (40m)', icon: Heart },
  { label: 'SCDF En Route', detail: 'Ambulance ETA 8 min', icon: Radio },
  { label: 'Response Active', detail: 'CPR in progress, AED applied', icon: Shield },
];

function useWorkflowAnimation(stepCount: number, stepMs: number = 2200, pauseMs: number = 3000) {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<'run' | 'pause'>('run');

  useEffect(() => {
    const id = setInterval(() => {
      if (phase === 'pause') {
        setActive(0);
        setPhase('run');
        return;
      }
      setActive(prev => {
        if (prev >= stepCount - 1) {
          setPhase('pause');
          return prev;
        }
        return prev + 1;
      });
    }, phase === 'pause' ? pauseMs : stepMs);
    return () => clearInterval(id);
  }, [phase, stepCount, stepMs, pauseMs]);

  return active;
}

export default function HeroSection() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const activeStep = useWorkflowAnimation(workflowSteps.length);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #ffffff 0%, #f0fdfa 25%, #f0f9ff 50%, #f8fafc 75%, #ffffff 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(13, 148, 136, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(13, 148, 136, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-20 right-[15%] w-[500px] h-[500px] rounded-full bg-primary-soft/40 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full bg-secondary-soft/30 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-ghost border border-primary/10 mb-8 animate-fade-up"
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              <span className="text-[12px] font-semibold text-primary tracking-wide uppercase">
                Singapore Smart Nation Initiative
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-text-heading leading-[1.1] tracking-tight mb-6 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              AI-Assisted{' '}
              <span className="gradient-text">Pre-Arrival Intelligence</span>{' '}
              for Emergency Response.
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg sm:text-xl text-text-muted leading-relaxed mb-10 max-w-xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              EchoSync detects unwitnessed medical emergencies in HDB environments,
              coordinates Community First Responders, and provides SCDF operators
              with actionable pre-arrival intelligence — all without cameras.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: '0.3s' }}
            >
              <button
                onClick={() => setIsDemoModalOpen(true)}
                id="hero-request-demo"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
                }}
              >
                Request a Demo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#technology"
                id="hero-learn-more"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-primary border-2 border-primary/20 hover:border-primary/40 hover:bg-primary-ghost transition-all duration-300 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-border animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { label: 'PDPA Aligned', icon: '🛡️' },
                { label: 'Zero Cameras', icon: '👁️' },
                { label: 'Edge AI Processing', icon: '⚡' },
                { label: 'Human-in-the-Loop', icon: '👤' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-[13px] text-text-muted"
                >
                  <span className="text-base">{badge.icon}</span>
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated Emergency Response Workflow */}
          <div
            className="hidden lg:flex justify-center items-center animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative">
              {/* Main Workflow Card */}
              <div className="w-[440px] rounded-3xl bg-white border border-border shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-light bg-bg-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-heading">
                          Live Response Simulation
                        </p>
                        <p className="text-[11px] text-text-light">
                          Blk 124, Toa Payoh
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/8">
                      <div className="w-1.5 h-1.5 rounded-full bg-danger" style={{ animation: 'pulse-soft 1.5s ease-in-out infinite' }} />
                      <span className="text-[10px] font-semibold text-danger">
                        SIMULATING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="p-5">
                  <div className="space-y-1">
                    {workflowSteps.map((step, i) => {
                      const Icon = step.icon;
                      const status = i < activeStep ? 'completed' : i === activeStep ? 'active' : 'pending';
                      return (
                        <div key={i} className="flex items-start gap-3 relative">
                          {/* Vertical Line */}
                          {i < workflowSteps.length - 1 && (
                            <div
                              className="absolute left-[13px] top-[28px] w-0.5 h-[calc(100%-4px)] transition-colors duration-500"
                              style={{ background: status === 'completed' ? '#0d9488' : status === 'active' ? 'rgba(13,148,136,0.3)' : '#e2e8f0' }}
                            />
                          )}
                          {/* Dot */}
                          <div
                            className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500"
                            style={{
                              background: status === 'completed' ? '#0d9488' : status === 'active' ? 'rgba(13,148,136,0.12)' : '#f8fafc',
                              border: status === 'active' ? '2px solid #0d9488' : status === 'pending' ? '1px solid #e2e8f0' : 'none',
                              boxShadow: status === 'active' ? '0 0 0 4px rgba(13,148,136,0.15)' : 'none',
                            }}
                          >
                            {status === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : status === 'active' ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            ) : null}
                          </div>
                          {/* Content */}
                          <div
                            className="pb-4 transition-all duration-500"
                            style={{ opacity: status === 'pending' ? 0.35 : 1 }}
                          >
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-semibold" style={{ color: status === 'active' ? '#0d9488' : '#0f172a' }}>
                                {step.label}
                              </p>
                              {status === 'active' && (
                                <Icon className="w-3.5 h-3.5 text-primary" />
                              )}
                            </div>
                            <p className="text-[11px] text-text-light">{step.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-light border border-border-light">
                    <div className="text-center flex-1">
                      <p className="text-[18px] font-bold text-primary">&lt;42s</p>
                      <p className="text-[9px] text-text-light uppercase font-medium">Detection</p>
                    </div>
                    <div className="w-px h-8 bg-border-light" />
                    <div className="text-center flex-1">
                      <p className="text-[18px] font-bold text-text-heading">94.2%</p>
                      <p className="text-[9px] text-text-light uppercase font-medium">Confidence</p>
                    </div>
                    <div className="w-px h-8 bg-border-light" />
                    <div className="text-center flex-1">
                      <p className="text-[18px] font-bold text-success">4 min</p>
                      <p className="text-[9px] text-text-light uppercase font-medium">CFR ETA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl bg-white border border-border shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-heading">
                      P1 Alert
                    </p>
                    <p className="text-[9px] text-text-light">Heavy Fall Detected</p>
                  </div>
                </div>
              </div>

              {/* Floating badge — bottom left */}
              <div
                className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-2xl bg-white border border-border shadow-lg animate-float"
                style={{ animationDelay: '2s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-heading">
                      CFR Responding
                    </p>
                    <p className="text-[9px] text-text-light">AED Retrieved • 120m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Request Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div 
            className="absolute inset-0 bg-white/40 backdrop-blur-md transition-opacity"
            onClick={() => {
              setIsDemoModalOpen(false);
              setIsSubmitted(false);
            }}
          />
          
          <div className="relative w-full max-w-[480px] bg-white border border-border/80 shadow-2xl rounded-3xl overflow-hidden animate-fade-in flex flex-col">
            {isSubmitted ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text-heading">Request Received</h3>
                <p className="text-[15px] text-text-muted leading-relaxed">
                  Thank you. An EchoSync deployment specialist will contact your agency within 24 hours to schedule the live walkthrough.
                </p>
                <button 
                  onClick={() => setIsDemoModalOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-bg-light border border-border font-semibold text-text-heading hover:bg-white hover:border-primary/30 transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-bg-light">
                  <h2 className="text-xl font-bold text-text-heading tracking-tight">Request Live Demo</h2>
                  <button 
                    onClick={() => setIsDemoModalOpen(false)}
                    className="p-2 rounded-xl text-text-muted hover:text-text-heading hover:bg-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Agency / Ministry Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                        <input type="text" placeholder="e.g., SCDF, HDB, MOH" className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Official Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                        <input type="email" placeholder="e.g., john_doe@scdf.gov.sg" className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Primary Area of Interest</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading focus:outline-none focus:border-primary/50 focus:bg-white transition-colors appearance-none">
                        <option>SCDF Pre-Arrival Intelligence</option>
                        <option>HDB Pilot Deployment</option>
                        <option>CFR Coordination Platform</option>
                        <option>Emergency Response Optimization</option>
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSubmitted(true)}
                    className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-300 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
                    }}
                  >
                    Submit Request
                  </button>
                  <p className="text-[11px] text-center text-text-light mt-4">
                    Your data is secure. View our <a href="#privacy" onClick={() => setIsDemoModalOpen(false)} className="text-primary hover:underline">PDPA Privacy Policy</a>.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

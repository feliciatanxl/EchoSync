'use client';

import { useState } from 'react';
import { ArrowRight, Play, Shield, Activity, Wifi, X, Building, Mail, User } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Soft gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #ffffff 0%, #f0fdfa 25%, #f0f9ff 50%, #f8fafc 75%, #ffffff 100%)',
          }}
        />
        {/* Subtle grid pattern */}
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
        {/* Floating decorative orbs */}
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
              Shifting Care from{' '}
              <span className="gradient-text">Reactive Response</span>{' '}
              to{' '}
              <span className="gradient-text">Proactive Protection.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg sm:text-xl text-text-muted leading-relaxed mb-10 max-w-xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              EchoSync leverages secure IoT sensors and cloud-based AI to detect
              emergencies and health decline in real time — protecting
              Singapore&apos;s seniors without compromising their privacy.
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
              <button
                onClick={() => setIsVideoModalOpen(true)}
                id="hero-learn-more"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-primary border-2 border-primary/20 hover:border-primary/40 hover:bg-primary-ghost transition-all duration-300 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-border animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { label: 'PDPA Compliant', icon: '🛡️' },
                { label: 'End-to-End Encrypted', icon: '🔒' },
                { label: 'Zero Optical Cameras', icon: '👁️' },
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

          {/* Right: Visual */}
          <div
            className="hidden lg:flex justify-center items-center animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative">
              {/* Main card */}
              <div className="w-[420px] h-[460px] rounded-3xl bg-white border border-border shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border-light bg-bg-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-heading">
                          Live Monitoring
                        </p>
                        <p className="text-[11px] text-text-light">
                          Blk 123, Toa Payoh
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
                      <span className="text-[10px] font-semibold text-success">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Status rows */}
                  {[
                    {
                      icon: Activity,
                      label: 'Vitals Monitor',
                      status: 'Normal',
                      color: '#10b981',
                      detail: 'Heart rate: 72 bpm',
                    },
                    {
                      icon: Wifi,
                      label: 'Motion Sensor',
                      status: 'Active',
                      color: '#0d9488',
                      detail: 'Last movement: 3 min ago',
                    },
                    {
                      icon: Shield,
                      label: 'Acoustic Monitor',
                      status: 'Listening',
                      color: '#3b82f6',
                      detail: 'Ambient: 32 dB',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-4 p-3.5 rounded-xl bg-bg-light border border-border-light hover:border-primary/15 transition-all duration-300"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.color}10` }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: item.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold text-text-heading">
                              {item.label}
                            </p>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                color: item.color,
                                background: `${item.color}12`,
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-light mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Mini chart placeholder */}
                  <div className="p-4 rounded-xl bg-bg-light border border-border-light">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                        Activity Pattern — Today
                      </p>
                      <p className="text-[11px] text-text-light">98% Normal</p>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 88, 72, 95, 68, 82, 58, 77, 92, 65].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all duration-300"
                            style={{
                              height: `${h}%`,
                              background:
                                h > 85
                                  ? 'linear-gradient(to top, #0d9488, #14b8a6)'
                                  : '#e2e8f0',
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl bg-white border border-border shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇸🇬</span>
                  <div>
                    <p className="text-[11px] font-bold text-text-heading">
                      1,247 Nodes
                    </p>
                    <p className="text-[9px] text-text-light">Active Nationwide</p>
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
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-heading">
                      &lt;42s Response
                    </p>
                    <p className="text-[9px] text-text-light">Avg. Detection Time</p>
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
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-white/40 backdrop-blur-md transition-opacity"
            onClick={() => {
              setIsDemoModalOpen(false);
              setIsSubmitted(false);
            }}
          />
          
          {/* Modal Content */}
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
                {/* Header */}
                <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-bg-light">
                  <h2 className="text-xl font-bold text-text-heading tracking-tight">Request Live Demo</h2>
                  <button 
                    onClick={() => setIsDemoModalOpen(false)}
                    className="p-2 rounded-xl text-text-muted hover:text-text-heading hover:bg-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Form */}
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    {/* Agency Name */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Agency / Ministry Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                        <input type="text" placeholder="e.g., Housing & Development Board" className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    {/* Official Email */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Official Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                        <input type="email" placeholder="e.g., john_doe@hdb.gov.sg" className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    {/* Area of Interest */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Primary Area of Interest</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading focus:outline-none focus:border-primary/50 focus:bg-white transition-colors appearance-none">
                        <option>Smart Nation IoT Integration</option>
                        <option>Elderly Care Monitoring System</option>
                        <option>Automated Emergency Dispatch (SCDF)</option>
                        <option>Other Enterprise Solutions</option>
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

      {/* Video Modal (Placeholder) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-text-heading/90 backdrop-blur-xl transition-opacity"
            onClick={() => setIsVideoModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-fade-up">
            {/* Header / Close */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10 bg-gradient-to-b from-black/60 to-transparent">
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Simulated 16:9 Video Player */}
            <div className="relative w-full aspect-video bg-bg-deep flex items-center justify-center overflow-hidden">
              {/* Fake Video Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                {/* Tech background animation */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,170,0.15)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
                  <div className="w-full h-full border-[0.5px] border-accent/20" style={{ backgroundImage: 'linear-gradient(rgba(0,212,170,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
                
                {/* Central Logo & Text */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-bright flex items-center justify-center shadow-[0_0_40px_rgba(0,212,170,0.4)] mb-6 animate-pulse-soft">
                    <Shield className="w-10 h-10 text-bg-deep" />
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight mb-3 font-sans">EchoSync Conceptual Vision</h3>
                  <p className="text-text-muted text-lg font-medium tracking-wide">Video Production in Progress</p>
                </div>
              </div>

              {/* Fake Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center gap-4 z-10">
                <button className="text-white hover:text-accent transition-colors">
                  <Play className="w-6 h-6 fill-current" />
                </button>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative cursor-pointer group">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-accent" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs font-medium text-white/80 tabular-nums">0:45 / 2:30</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

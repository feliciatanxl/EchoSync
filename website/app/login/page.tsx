'use client';

import { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login then redirect to portal
    setTimeout(() => {
      window.location.href = 'http://localhost:3000';
    }, 1500);
  };

  const openAIChat = () => {
    window.dispatchEvent(new CustomEvent('open-echo-ai'));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-soft/30 blur-[120px] animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary-soft/20 blur-[100px] animate-pulse-soft pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Header */}
      <div className="p-6 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-text-muted hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to website
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px] animate-fade-up">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
              <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-text-heading tracking-tight">Portal Login</h1>
            <p className="text-[14px] text-text-muted mt-2">
              B2G Command Center & Operator Access
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-border/60 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-ghost/10 to-transparent pointer-events-none" />
            
            <form onSubmit={handleLogin} className="relative z-10 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-text-heading">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="email" 
                    required
                    placeholder="e.g., dispatcher_01@hdb.gov.sg"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-text-heading">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-all shadow-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-heading transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                  <label htmlFor="remember" className="text-[12px] font-medium text-text-muted cursor-pointer">Remember Me</label>
                </div>
                <Link href="/forgot-password" className="text-[12px] font-bold text-primary hover:underline transition-colors">Forgot Password</Link>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center relative z-10">
              <p className="text-[12px] text-text-muted mb-4 uppercase tracking-widest font-bold">Government SSO</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-light border border-border hover:bg-white hover:border-primary/30 transition-all text-[13px] font-bold text-text-heading">
                  <span className="text-red-500 font-black italic">Singpass</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-light border border-border hover:bg-white hover:border-primary/30 transition-all text-[13px] font-bold text-text-heading">
                  <span className="text-blue-600 font-black italic">CorpPass</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-[11px] text-text-muted">
              Need technical assistance? Ask <button 
                onClick={openAIChat}
                className="font-bold text-primary cursor-pointer hover:underline bg-transparent border-none p-0"
              >
                EchoAI Assistant
              </button>.
            </p>
            <p className="text-[11px] text-text-muted">
              Unauthorized access to this system is prohibited under the 
              <br />
              <span className="font-bold">Computer Misuse Act (Cap 50A)</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

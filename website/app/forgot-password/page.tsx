'use client';

import { useState } from 'react';
import { Shield, Mail, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending reset link
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
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
          href="/login" 
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-text-muted hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to login
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
            <h1 className="text-2xl font-bold text-text-heading tracking-tight">Recover Account</h1>
            <p className="text-[14px] text-text-muted mt-2">
              Enter your official email to receive a password reset link.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-border/60 shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-ghost/10 to-transparent pointer-events-none" />
            
            {isSubmitted ? (
              <div className="relative z-10 text-center py-4 space-y-6">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-text-heading">Check your email</h3>
                  <p className="text-[14px] text-text-muted leading-relaxed">
                    We&apos;ve sent a password reset link to your official inbox.
                  </p>
                </div>
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-3.5 rounded-xl text-[14px] font-bold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                  }}
                >
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
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
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-[11px] text-text-muted">
              Need technical assistance? <button 
                onClick={openAIChat}
                className="font-bold text-primary cursor-pointer hover:underline bg-transparent border-none p-0"
              >
                Ask EchoAI
              </button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  Building
} from 'lucide-react';

type ViewState = 'login' | 'forgot-password';

export default function LoginPage() {
  const [view, setView] = useState<ViewState>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication and redirect
    window.location.href = 'https://echosync-website-brown.vercel.app/dashboard-v2'; // Assuming main app is on port 3000
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate reset link sent
    alert(`Password reset link sent to ${email}`);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Animated View Container */}
        <div className="relative overflow-hidden bg-white py-10 px-6 sm:px-10 shadow-xl sm:rounded-2xl border border-slate-100 transition-all duration-500">
          
          {/* Header Shield Icon */}
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-md shadow-teal-500/20">
              <Shield className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>
          </div>

          {/* ═══════════════════════════════════════
              LOGIN VIEW
              ═══════════════════════════════════════ */}
          {view === 'login' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Portal Login
                </h2>
                <p className="mt-2 text-sm text-slate-500 font-medium">
                  B2G Command Center & Operator Access
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Official Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors bg-slate-50/50"
                      placeholder="e.g., dispatcher_01@hdb.gov.sg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors bg-slate-50/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 transition-colors"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                      Remember Me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setView('forgot-password')}
                      className="font-semibold text-teal-600 hover:text-teal-500 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-teal-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/35 hover:brightness-110 active:scale-[0.98]"
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      GOVERNMENT SSO
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-sm hover:bg-slate-50 transition-colors active:scale-[0.98]">
                    <Fingerprint className="h-4 w-4" />
                    Singpass
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-slate-50 transition-colors active:scale-[0.98]">
                    <Building className="h-4 w-4" />
                    CorpPass
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              FORGOT PASSWORD VIEW
              ═══════════════════════════════════════ */}
          {view === 'forgot-password' && (
            <div className="animate-fade-in">
              <button
                onClick={() => setView('login')}
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <div className="text-center mb-8 mt-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Recover Account
                </h2>
                <p className="mt-2 text-sm text-slate-500 font-medium px-4">
                  Enter your official email to receive a password reset link.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleReset}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Official Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors bg-slate-50/50"
                      placeholder="e.g., dispatcher_01@hdb.gov.sg"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-teal-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/35 hover:brightness-110 active:scale-[0.98]"
                  >
                    Send Reset Link
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════
            FOOTER (BOTH VIEWS)
            ═══════════════════════════════════════ */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm font-medium text-slate-600">
            Need technical assistance?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-500 transition-colors">
              Ask EchoAI Assistant.
            </a>
          </p>
          <p className="text-xs text-slate-400 px-6 leading-relaxed">
            Unauthorized access to this system is prohibited under the Computer Misuse Act (Cap 50A).
          </p>
        </div>

      </div>
    </div>
  );
}

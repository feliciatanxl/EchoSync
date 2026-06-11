'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, MessageSquareText } from 'lucide-react';
import OTPInput from '@/app/myResponder/components/OTPInput';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';

type VerifyResponse = {
  success: boolean;
  error?: string;
};

const RESEND_SECONDS = 60;

export default function AuthOtpPage() {
  const router = useRouter();
  const { state, updateOnboarding } = useApp();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');
  const markedStep = useRef(false);
  const verifying = useRef(false);

  const phone = state.user.phone;
  const maskedPhone = useMemo(() => {
    if (phone.length < 4) {
      return '+65 **** ****';
    }

    return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
  }, [phone]);

  useEffect(() => {
    if (!markedStep.current) {
      markedStep.current = true;
      updateOnboarding({ currentStep: 4 });
    }
  }, [updateOnboarding]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (otp.length !== 6 || verifying.current) {
      return;
    }

    const verifyOtp = async () => {
      verifying.current = true;
      setStatus('submitting');
      setError('');

      try {
        const response = await fetch('/myResponder/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp }),
        });
        const data = (await response.json()) as VerifyResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.error ?? 'Unable to verify OTP.');
        }

        updateOnboarding({ completed: true, currentStep: 4 });
        router.replace('/myResponder/dashboard');
      } catch (caughtError) {
        verifying.current = false;
        setStatus('error');
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to verify OTP.');
        setOtp('');
      }
    };

    void verifyOtp();
  }, [otp, phone, router, updateOnboarding]);

  const resendLabel = secondsLeft > 0 ? `Resend OTP (${secondsLeft}s)` : 'Resend OTP';

  return (
    <main className="mr-page-onboarding mr-animate-fade-in" style={{ background: 'var(--gray-50)' }}>
      <header className="mr-header">
        <button
          onClick={() => router.push('/myResponder/auth-input')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--gray-700)' }}
          aria-label="Go back"
          type="button"
          disabled={status === 'submitting'}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="mr-header-title">Enter OTP</span>
        <MessageSquareText size={22} color="var(--scdf-blue)" />
      </header>

      <StepIndicator currentStep={4} />

      <section className="mr-page-content" style={{ textAlign: 'center' }}>
        <div className="mr-card-flat">
          <MessageSquareText size={38} color="var(--scdf-blue)" />
          <h1 className="mr-title-lg" style={{ marginTop: 12 }}>
            Verify your mobile number
          </h1>
          <p className="mr-body-sm" style={{ color: 'var(--gray-600)', marginTop: 8 }}>
            Enter the 6-digit code sent to {maskedPhone}.
          </p>
        </div>

        <OTPInput value={otp} onChange={setOtp} disabled={status === 'submitting'} />

        {status === 'submitting' ? (
          <p className="mr-body-sm mr-center" style={{ color: 'var(--scdf-blue)', gap: 8 }}>
            <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
            Verifying OTP...
          </p>
        ) : null}

        {error ? (
          <p className="mr-body-sm" style={{ color: 'var(--scdf-red)', marginTop: 4 }}>
            {error}
          </p>
        ) : null}

      </section>

      <footer className="shrink-0 border-t border-slate-100 bg-white/95 p-4">
        <button
          className="mr-btn mr-btn-secondary"
          type="button"
          disabled={secondsLeft > 0 || status === 'submitting'}
          onClick={() => {
            setSecondsLeft(RESEND_SECONDS);
            setOtp('');
            setError('');
            setStatus('idle');
          }}
        >
          {resendLabel}
        </button>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

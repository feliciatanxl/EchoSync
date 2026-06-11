'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Smartphone } from 'lucide-react';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';

const nricFinPattern = /^[STFGM]\d{7}[A-Z]$/;
const phonePattern = /^[89]\d{7}$/;

export default function AuthInputPage() {
  const router = useRouter();
  const { state, updateUser, updateOnboarding } = useApp();
  const [phone, setPhone] = useState(state.user.phone.replace(/^\+65/, ''));
  const [nric, setNric] = useState(state.user.nric);
  const [submitted, setSubmitted] = useState(false);
  const markedStep = useRef(false);

  useEffect(() => {
    if (!markedStep.current) {
      markedStep.current = true;
      updateOnboarding({ currentStep: 4 });
    }
  }, [updateOnboarding]);

  const normalizedNric = useMemo(() => nric.toUpperCase().replace(/[^A-Z0-9]/g, ''), [nric]);
  const normalizedPhone = useMemo(() => phone.replace(/\D/g, '').slice(0, 8), [phone]);
  const phoneValid = phonePattern.test(normalizedPhone);
  const nricValid = nricFinPattern.test(normalizedNric);
  const canContinue = phoneValid && nricValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!canContinue) {
      return;
    }

    updateUser({
      phone: `+65${normalizedPhone}`,
      nric: normalizedNric,
      signedUpFrom: 'Mobile',
    });
    router.push('/myResponder/auth-otp');
  };

  return (
    <main className="mr-page-onboarding mr-animate-fade-in" style={{ background: 'var(--gray-50)' }}>
      <header className="mr-header">
        <button
          onClick={() => router.push('/myResponder/intro')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--gray-700)' }}
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="mr-header-title">Verify identity</span>
        <BadgeCheck size={22} color="var(--scdf-blue)" />
      </header>

      <StepIndicator currentStep={4} />

      <form style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column', overflow: 'hidden' }} onSubmit={handleSubmit} noValidate>
        <section className="mr-page-content">
          <div className="mr-card-flat" style={{ marginBottom: 18 }}>
            <Smartphone size={32} color="var(--scdf-blue)" />
            <h1 className="mr-title-lg" style={{ marginTop: 12 }}>
              Enter your details
            </h1>
            <p className="mr-body-sm" style={{ color: 'var(--gray-600)', marginTop: 6 }}>
              We will send a 6-digit one-time password to your Singapore mobile number.
            </p>
          </div>

          <div className="mr-input-group">
            <label className="mr-input-label" htmlFor="phone">
              Mobile number
            </label>
            <div className="mr-input-phone">
              <span className="mr-input-phone-prefix">+65</span>
              <input
                id="phone"
                value={normalizedPhone}
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={8}
                onChange={(event) => setPhone(event.target.value)}
                aria-invalid={submitted && !phoneValid}
                aria-describedby="phone-error"
                placeholder="8123 4567"
              />
            </div>
            {submitted && !phoneValid ? (
              <p id="phone-error" className="mr-body-sm" style={{ color: 'var(--scdf-red)', marginTop: 6 }}>
                Enter a valid 8-digit Singapore mobile number starting with 8 or 9.
              </p>
            ) : null}
          </div>

          <div className="mr-input-group">
            <label className="mr-input-label" htmlFor="nric">
              NRIC/FIN
            </label>
            <input
              id="nric"
              className={`mr-input${submitted && !nricValid ? ' mr-input-error' : ''}`}
              value={normalizedNric}
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={9}
              onChange={(event) => setNric(event.target.value)}
              aria-invalid={submitted && !nricValid}
              aria-describedby="nric-error"
              placeholder="S1234567A"
            />
            {submitted && !nricValid ? (
              <p id="nric-error" className="mr-body-sm" style={{ color: 'var(--scdf-red)', marginTop: 6 }}>
                Use a valid capital NRIC/FIN format, for example S1234567A.
              </p>
            ) : null}
          </div>
        </section>

        <footer className="shrink-0 border-t border-slate-100 bg-white/95 p-4">
          <button className="mr-btn mr-btn-primary" type="submit">
            Send OTP
          </button>
        </footer>
      </form>
    </main>
  );
}

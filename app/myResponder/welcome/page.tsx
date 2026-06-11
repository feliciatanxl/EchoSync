'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '@/app/myResponder/context/AppContext';

export default function WelcomePage() {
  const router = useRouter();
  const { updateOnboarding } = useApp();
  const markedStep = useRef(false);

  useEffect(() => {
    if (!markedStep.current) {
      markedStep.current = true;
      updateOnboarding({ currentStep: 1 });
    }
  }, [updateOnboarding]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push('/myResponder/intro');
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <button
      type="button"
      className="mr-animate-fade-in"
      onClick={() => router.push('/myResponder/intro')}
      aria-label="Continue to myResponder introduction"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        border: 0,
        background: 'linear-gradient(180deg, var(--scdf-blue) 0%, var(--scdf-dark-blue) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '12% -18% auto',
          height: 360,
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.13) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: 118,
          height: 136,
          borderRadius: '58% 58% 48% 48%',
          background: 'linear-gradient(180deg, #075998 0%, var(--scdf-navy) 100%)',
          border: '2.5px solid var(--scdf-gold)',
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.32)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: 'white',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ShieldCheck size={34} color="var(--scdf-gold)" strokeWidth={2.2} />
        <span style={{ color: 'var(--scdf-gold)', fontSize: 28, fontWeight: 900, letterSpacing: 3 }}>
          SCDF
        </span>
        <span style={{ width: 64, height: 1, background: 'rgba(255, 215, 0, 0.55)' }} />
        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.1 }}>THE LIFE SAVING FORCE</span>
      </div>

      <h1
        style={{
          marginTop: 28,
          color: 'white',
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: 2.6,
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        myRESPONDER
      </h1>
      <p
        style={{
          marginTop: 12,
          color: 'rgba(255,255,255,0.72)',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Tap anywhere to continue
      </p>
    </button>
  );
}

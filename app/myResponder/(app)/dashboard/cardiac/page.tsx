'use client';

import { useRouter } from 'next/navigation';

const steps = [
  {
    num: 1,
    title: 'Check for responsiveness',
    desc: "Tap shoulders, shout 'Are you OK?'",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    num: 2,
    title: 'Call 995',
    desc: 'Call for help immediately',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E53935">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Perform CPR',
    desc: 'Push hard and fast on the center of the chest, 100-120 compressions per minute',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E53935">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    num: 4,
    title: 'Use an AED',
    desc: 'Follow the AED voice prompts, attach pads as shown',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    num: 5,
    title: 'Continue until help arrives',
    desc: "Don't stop CPR until SCDF paramedics take over",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function CardiacPage() {
  const router = useRouter();

  return (
    <div className="mr-page mr-animate-fade-in">
      {/* Header */}
      <header className="mr-header">
        <div className="mr-flex mr-items-center mr-gap-8">
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="mr-header-title" style={{ color: 'var(--scdf-red)' }}>Cardiac Arrest</span>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #E53935, #C62828)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(255,255,255,0.2)" stroke="white"/>
          <path d="M4 12h3l2-4 3 8 2-4h6" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
        <h1 className="mr-title-lg" style={{ color: 'white', textAlign: 'center' }}>
          What to do during a Cardiac Arrest
        </h1>
      </div>

      {/* Steps */}
      <div className="mr-px-16 mr-mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="mr-card mr-flex mr-items-center mr-gap-8"
            style={{
              animationDelay: `${i * 80}ms`,
              animation: `mr-fade-in 0.4s var(--ease-out) ${i * 80}ms both`,
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFEBEE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#E53935',
              flexShrink: 0,
            }}>
              {step.num}
            </div>
            <div style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {step.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p className="mr-title-sm">{step.title}</p>
              <p className="mr-body-sm" style={{ color: 'var(--gray-600)', marginTop: 2 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="mr-px-16 mr-mt-24 mr-mb-16">
        <div style={{
          background: 'linear-gradient(135deg, #E53935, #C62828)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
          </svg>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>
            Call 995 when in doubt
          </p>
        </div>
      </div>
    </div>
  );
}

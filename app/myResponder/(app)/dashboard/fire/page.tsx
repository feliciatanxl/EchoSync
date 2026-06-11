'use client';

import { useRouter } from 'next/navigation';

const steps = [
  {
    num: 1,
    title: 'Assess the situation',
    desc: 'Only fight small, contained fires. Ensure you have a clear escape route.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
    ),
  },
  {
    num: 2,
    title: 'Call 995',
    desc: 'Always ensure 995 has been called before attempting any action',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF9800">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Use water or extinguisher',
    desc: 'Pails/plastic bags to fill water. Use fire extinguisher: Pull, Aim, Squeeze, Sweep (PASS)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6M8 6h8M9 8v10a3 3 0 006 0V8"/>
      </svg>
    ),
  },
  {
    num: 4,
    title: 'Close doors',
    desc: 'Contain the fire by closing doors behind you as you move to safety',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 3v18"/>
        <circle cx="6" cy="12" r="1" fill="#FF9800"/>
      </svg>
    ),
  },
  {
    num: 5,
    title: 'Evacuate if needed',
    desc: 'Leave immediately if fire grows. Use stairs, not lifts. Stay low to avoid smoke.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  },
];

export default function FirePage() {
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
          <span className="mr-header-title" style={{ color: '#FF9800' }}>Fire Fighting</span>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #FF9800, #E65100)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <svg width="72" height="72" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5">
          <path d="M12 23c-3.87 0-7-3.13-7-7 0-2.38 1.19-4.47 3-5.74V4a1 1 0 011.5-.87l.5.29V2a1 1 0 012 0v1.42l.5-.29A1 1 0 0114 4v6.26c1.81 1.27 3 3.36 3 5.74 0 3.87-3.13 7-7 7z"/>
        </svg>
        <h1 className="mr-title-lg" style={{ color: 'white', textAlign: 'center' }}>
          How to fight small fires safely
        </h1>
      </div>

      {/* Steps */}
      <div className="mr-px-16 mr-mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="mr-card mr-flex mr-items-center mr-gap-8"
            style={{
              animation: `mr-fade-in 0.4s var(--ease-out) ${i * 80}ms both`,
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFF3E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#FF9800',
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
          background: 'linear-gradient(135deg, #FF9800, #E65100)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="1" fill="rgba(255,255,255,0.2)"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>
            Your safety is the top priority
          </p>
        </div>
      </div>
    </div>
  );
}

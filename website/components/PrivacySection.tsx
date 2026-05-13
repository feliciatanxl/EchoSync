'use client';

import { Shield, EyeOff, Cpu, UserCheck, Users, Lock, CheckCircle2, Server } from 'lucide-react';

const governanceCards = [
  {
    icon: EyeOff,
    title: 'Zero Optical Cameras',
    description: 'EchoSync uses acoustic, thermal, and vibration sensors only. No cameras, no facial recognition, no visual surveillance of any kind.',
    badge: 'Privacy-First',
    color: '#0d9488',
  },
  {
    icon: Server,
    title: 'No Raw Audio Storage',
    description: 'Audio data is processed at the edge in real time. Only classified event metadata (e.g., "impact detected, 82dB") leaves the device. Raw audio is never stored or transmitted.',
    badge: 'Edge Processing',
    color: '#3b82f6',
  },
  {
    icon: Cpu,
    title: 'On-Device AI Processing',
    description: 'Anomaly classification runs locally on edge nodes. Cloud infrastructure receives only encrypted, anonymized alert payloads for operator review.',
    badge: 'Edge AI',
    color: '#8b5cf6',
  },
  {
    icon: UserCheck,
    title: 'Opt-In Participation',
    description: 'Residents actively consent to participate. Enrollment includes clear data governance briefing. Withdrawal is available at any time with full data deletion.',
    badge: 'Consent-Based',
    color: '#10b981',
  },
  {
    icon: Users,
    title: 'Human-in-the-Loop Verification',
    description: 'Every AI-generated alert is verified by a trained SCDF operator before dispatch. No autonomous emergency actions — humans always make the final call.',
    badge: 'Human Oversight',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Explainable AI Classifications',
    description: 'Each alert includes a natural-language explanation of the AI reasoning: which sensors triggered, what patterns matched, and the confidence score methodology.',
    badge: 'Transparent AI',
    color: '#0891b2',
  },
];

const complianceBadges = [
  { label: 'PDPA Aligned', description: 'Singapore Personal Data Protection Act' },
  { label: 'Edge-First Architecture', description: 'Data processed at source' },
  { label: 'AES-256 Encryption', description: 'End-to-end encrypted transmission' },
  { label: 'Zero-Knowledge Cloud', description: 'No raw data in cloud storage' },
];

export default function PrivacySection() {
  return (
    <section id="privacy" className="section-padding bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-[0.3]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(13,148,136,0.06) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-ghost border border-primary/10 mb-6">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="text-[12px] font-semibold text-primary tracking-wide uppercase">
              Privacy & Governance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-4">
            Built for Trust.{' '}
            <span className="gradient-text">Designed for Governance.</span>
          </h2>
          <p className="text-[16px] text-text-muted leading-relaxed">
            EchoSync is designed to operate within Singapore&apos;s strict public-sector data governance framework.
            Privacy is not an afterthought — it is an architectural principle.
          </p>
        </div>

        {/* Governance Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {governanceCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group p-6 rounded-2xl bg-white border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg cursor-default card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}10` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${card.color}10`, color: card.color }}
                  >
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-text-heading mb-2">{card.title}</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* Compliance Badges */}
        <div className="bg-bg-light rounded-2xl border border-border p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-[15px] font-bold text-text-heading">Compliance & Security Standards</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceBadges.map((badge) => (
              <div key={badge.label} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border-light">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-text-heading">{badge.label}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Flow Diagram */}
        <div className="mt-12 text-center">
          <p className="text-[11px] font-semibold text-text-light uppercase tracking-widest mb-6">Data Processing Flow</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              { label: 'Edge Sensor', sub: 'On-device AI' },
              { label: 'Encrypted Alert', sub: 'Metadata only' },
              { label: 'Operator Review', sub: 'Human verification' },
              { label: 'Dispatch Decision', sub: 'CFR / SCDF' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 sm:gap-4">
                <div className="px-4 py-3 rounded-xl bg-white border border-border shadow-sm text-center min-w-[120px]">
                  <p className="text-[12px] font-bold text-text-heading">{step.label}</p>
                  <p className="text-[10px] text-text-light">{step.sub}</p>
                </div>
                {i < 3 && (
                  <div className="text-text-light text-lg hidden sm:block">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

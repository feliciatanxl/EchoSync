'use client';

import { Thermometer, Volume2, BedDouble, Zap, Bot, MonitorSmartphone } from 'lucide-react';

const techCards = [
  {
    icon: Thermometer,
    title: 'Thermal Imaging & CV',
    desc: 'Detects human heat signatures to assess posture and movement. Computer Vision distinguishes between resting on a bed and a collapse — without optical cameras.',
    tag: 'Home Sensor',
    color: '#0d9488',
  },
  {
    icon: Volume2,
    title: 'Acoustic Sensors & NLP',
    desc: 'Machine Learning evaluates decibel spikes from heavy falls. Natural Language Processing detects verbal distress cues. Private conversations are never recorded.',
    tag: 'Home Sensor',
    color: '#3b82f6',
  },
  {
    icon: BedDouble,
    title: 'Under-Mattress Load Mats',
    desc: 'High-sensitivity pressure sensors track micro-vibrations to detect breathing patterns, heart rate anomalies, respiratory distress, or dangerous immobility.',
    tag: 'Vitals',
    color: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'Utility Integration (SP Group)',
    desc: 'Analyzes water and electricity consumption via API. Triggers wellness checks if usage drops to zero for an abnormal duration — a non-invasive routine check.',
    tag: 'Routine',
    color: '#f59e0b',
  },
  {
    icon: Bot,
    title: 'EchoRover — Autonomous Robot',
    desc: 'Deployed in HDB corridors for first-responder assessment. Carries an onboard AED and medical supplies, establishing two-way intercom before SCDF arrives.',
    tag: 'Community',
    color: '#ef4444',
  },
  {
    icon: MonitorSmartphone,
    title: 'Software Dashboards',
    desc: 'B2G SaaS portal for estate-wide heatmaps and live triage. Family caregiver app for secure status monitoring. Resident interface for reminders and prompts.',
    tag: 'Platform',
    color: '#06b6d4',
  },
];

export default function TechnologySection() {
  return (
    <section id="technology" className="section-padding bg-bg-light relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-4">Technology</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-6">
            Multi-Layer AI Filtering System
          </h2>
          <p className="text-lg text-text-muted leading-relaxed">
            EchoSync fuses acoustic, thermal, physiological, and routine-based data using ML, NLP, and Computer Vision to cross-validate signals and drastically reduce false alarms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card-hover group p-6 rounded-2xl bg-white border border-border hover:border-primary/20">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${card.color}10` }}>
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: card.color, background: `${card.color}10` }}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-text-heading mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works Strip */}
        <div className="mt-16 p-8 rounded-2xl bg-white border border-border">
          <h3 className="text-center text-lg font-bold text-text-heading mb-8">How the Multi-Layer Filter Works</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { step: '1', label: 'Sensor Detection', desc: 'Acoustic thud + thermal anomaly' },
              { step: '2', label: 'AI Cross-Validation', desc: 'ML/NLP/CV confirms the signal' },
              { step: '3', label: 'Tiered Alert', desc: 'Route to neighbour or SCDF' },
              { step: '4', label: 'Response', desc: 'EchoRover + paramedic dispatch' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white font-bold text-[14px] mb-2">{s.step}</div>
                  <p className="text-[13px] font-semibold text-text-heading">{s.label}</p>
                  <p className="text-[11px] text-text-light mt-1">{s.desc}</p>
                </div>
                {i < 3 && <div className="hidden md:block w-16 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

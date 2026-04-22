'use client';

import { Heart, Users, Clock, Target } from 'lucide-react';

const stats = [
  { icon: Users, value: '1 in 5', label: 'Singaporeans aged 65+', detail: 'Projected 1 in 4 by 2030' },
  { icon: Heart, value: '200+', label: 'Pilot nodes deployed', detail: 'Across HDB Silver Zones' },
  { icon: Clock, value: '<60s', label: 'Target detection time', detail: 'From incident to alert' },
  { icon: Target, value: '≥98%', label: 'AI accuracy target', detail: 'Fall vs. false positive' },
];

export default function MissionSection() {
  return (
    <section id="mission" className="section-padding bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-4">Our Mission</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-6">
            Protecting Those Who Built Our Nation
          </h2>
          <p className="text-lg text-text-muted leading-relaxed">
            Singapore&apos;s rapidly aging population demands a proactive approach to elder care. EchoSync ensures no senior living alone faces an emergency undetected.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/8 border border-danger/15 mb-6">
              <span className="text-sm">⚠️</span>
              <span className="text-[12px] font-semibold text-danger">The Challenge</span>
            </div>
            <h3 className="text-2xl font-bold text-text-heading mb-4">Solitary Emergencies Remain Undetected</h3>
            <p className="text-text-muted leading-relaxed mb-6">
              For seniors living alone, a fall or medical episode can go undetected for hours — even days. Existing solutions like panic buttons depend on user activation, failing when they&apos;re unconscious or disoriented.
            </p>
            <ul className="space-y-3">
              {['Panic buttons require conscious activation', 'Wearables suffer low adoption due to stigma', 'No integrated real-time monitoring system exists', 'Intervention remains reactive, not preventive'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                  </div>
                  <span className="text-[14px] text-text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-ghost border border-primary/15 mb-6">
              <span className="text-sm">✨</span>
              <span className="text-[12px] font-semibold text-primary">Our Solution</span>
            </div>
            <h3 className="text-2xl font-bold text-text-heading mb-4">Automated, Non-Invasive Safety</h3>
            <p className="text-text-muted leading-relaxed mb-6">
              EchoSync is a strictly opt-in system that captures environmental data through discreet sensors embedded in ceiling light fixtures. AI analyzes patterns — private conversations are never recorded.
            </p>
            <ul className="space-y-3">
              {['Zero-stigma: Sensors hidden in ceiling lights', 'Fully automated — no wearables needed', 'AI cross-validates signals to reduce false alarms', 'Tiered alerts from neighbours to SCDF dispatch'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-[14px] text-text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-hover p-6 rounded-2xl bg-bg-light border border-border text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-ghost border border-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-text-heading mb-1">{stat.value}</p>
                <p className="text-[13px] font-semibold text-text-body mb-1">{stat.label}</p>
                <p className="text-[12px] text-text-light">{stat.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { ShieldCheck, Lock, Eye, Database, Server, FileCheck } from 'lucide-react';

const privacyFeatures = [
  { icon: Eye, title: 'No Optical Cameras', desc: 'EchoSync never uses optical video cameras. Thermal imaging detects only heat signatures — faces and identities are never captured.' },
  { icon: Lock, title: 'End-to-End Encryption', desc: 'All data transmitted from in-home sensors to cloud servers is encrypted using industry-standard protocols. Unauthorized access is impossible.' },
  { icon: Database, title: 'Edge Processing', desc: 'Audio and thermal data are processed primarily on-device to extract signatures. Raw conversations and footage never leave the home.' },
  { icon: FileCheck, title: 'PDPA Compliant', desc: 'Fully compliant with Singapore\'s Personal Data Protection Act. Strict consent-based governance and access controls at every level.' },
  { icon: Server, title: 'No Raw Storage', desc: 'Raw audio recordings, video footage, and speech content are never stored. Only encrypted data signatures and emergency alerts are transmitted.' },
  { icon: ShieldCheck, title: 'Strictly Opt-In', desc: 'Residents remain in full control. EchoSync is deployed only with explicit, informed consent — ensuring trust and autonomy.' },
];

export default function PrivacySection() {
  return (
    <section id="privacy" className="section-padding bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-4">Privacy & Security</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-6">
              Safety Without Surveillance
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              EchoSync demonstrates how technology can actively protect our most vulnerable while respecting their rights and privacy. Our architecture is designed from the ground up to ensure data is only used to save lives — never to intrude.
            </p>

            {/* PDPA Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary-ghost border border-primary/15">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div>
                <p className="text-[13px] font-bold text-text-heading">PDPA Certified Architecture</p>
                <p className="text-[11px] text-text-muted">Singapore Personal Data Protection Act</p>
              </div>
            </div>
          </div>

          {/* Right: Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {privacyFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="card-hover p-5 rounded-xl bg-bg-light border border-border hover:border-primary/15">
                  <Icon className="w-5 h-5 text-primary mb-3" />
                  <h4 className="text-[14px] font-bold text-text-heading mb-1.5">{feat.title}</h4>
                  <p className="text-[12px] text-text-muted leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { Wifi, Radio, Heart, Monitor, Shield, ArrowRight, Building, Signal } from 'lucide-react';

const deploymentLayers = [
  {
    icon: Radio,
    label: 'Ceiling Sensor Node',
    description: 'Acoustic + thermal + vibration sensors mounted in corridor ceiling. Edge AI processes data locally.',
    position: 'corridor',
    color: '#0d9488',
  },
  {
    icon: Wifi,
    label: 'Lift Lobby Relay',
    description: 'Mesh relay node aggregates signals from corridor sensors. LTE fallback for connectivity resilience.',
    position: 'lobby',
    color: '#3b82f6',
  },
  {
    icon: Heart,
    label: 'AED Coordination Point',
    description: 'Void deck AED cabinet with GPS beacon. Location data shared with CFR navigation guidance.',
    position: 'voiddeck',
    color: '#10b981',
  },
  {
    icon: Monitor,
    label: 'Command Dashboard',
    description: 'SCDF-integrated operator interface. Receives encrypted alert payloads with AI explainability.',
    position: 'dashboard',
    color: '#8b5cf6',
  },
];

export default function DeploymentSection() {
  return (
    <section id="deployment" className="section-padding bg-bg-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-ghost border border-primary/10 mb-6">
            <Building className="w-3.5 h-3.5 text-primary" />
            <span className="text-[12px] font-semibold text-primary tracking-wide uppercase">
              HDB Deployment Architecture
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-4">
            Designed for{' '}
            <span className="gradient-text">HDB Infrastructure.</span>
          </h2>
          <p className="text-[16px] text-text-muted leading-relaxed">
            EchoSync integrates seamlessly into existing HDB common areas — corridors, lift lobbies, and void decks —
            without any structural modification or resident-facing hardware.
          </p>
        </div>

        {/* Deployment Diagram */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: SVG Floor Plan */}
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            <p className="text-[11px] font-bold text-text-light uppercase tracking-widest mb-6 text-center">
              Typical HDB Floor Layout
            </p>
            <svg viewBox="0 0 400 300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect x="0" y="0" width="400" height="300" fill="#f8fafc" rx="12" />

              {/* Corridor */}
              <rect x="40" y="100" width="320" height="50" fill="#e2e8f0" rx="4" stroke="#cbd5e1" strokeWidth="1" />
              <text x="200" y="130" textAnchor="middle" className="text-[11px]" fill="#64748b" fontWeight="600" fontSize="11">CORRIDOR</text>

              {/* Units (top) */}
              {[60, 140, 220, 300].map((x, i) => {
                const unitLabels = ['#04-121', '#04-123', '#04-125', '#04-127'];
                return (
                  <g key={`top-${i}`}>
                    <rect x={x} y="30" width="60" height="60" fill="#ffffff" rx="6" stroke="#e2e8f0" strokeWidth="1" />
                    <text x={x + 30} y="55" textAnchor="middle" fill="#94a3b8" fontWeight="500" fontSize="9">{unitLabels[i]}</text>
                    <text x={x + 30} y="72" textAnchor="middle" fill="#cbd5e1" fontSize="8">Unit</text>
                  </g>
                );
              })}

              {/* Units (bottom) */}
              {[60, 140, 220, 300].map((x, i) => {
                const unitLabels = ['#04-122', '#04-124', '#04-126', '#04-128'];
                return (
                  <g key={`bottom-${i}`}>
                    <rect x={x} y="160" width="60" height="60" fill="#ffffff" rx="6" stroke="#e2e8f0" strokeWidth="1" />
                    <text x={x + 30} y="185" textAnchor="middle" fill="#94a3b8" fontWeight="500" fontSize="9">{unitLabels[i]}</text>
                    <text x={x + 30} y="202" textAnchor="middle" fill="#cbd5e1" fontSize="8">Unit</text>
                  </g>
                );
              })}

              {/* Sensor Nodes (in corridor ceiling) */}
              {[120, 200, 280].map((x, i) => (
                <g key={`sensor-${i}`}>
                  <circle cx={x} cy="125" r="8" fill="#0d948815" stroke="#0d9488" strokeWidth="1.5" />
                  <circle cx={x} cy="125" r="3" fill="#0d9488" />
                  {/* Pulse rings */}
                  <circle cx={x} cy="125" r="12" fill="none" stroke="#0d9488" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))}

              {/* Lift Lobby */}
              <rect x="10" y="100" width="28" height="50" fill="#3b82f610" rx="4" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
              <text x="24" y="122" textAnchor="middle" fill="#3b82f6" fontWeight="700" fontSize="7">LIFT</text>
              <text x="24" y="134" textAnchor="middle" fill="#3b82f6" fontSize="7">LOBBY</text>
              {/* Relay node */}
              <circle cx="24" cy="142" r="5" fill="#3b82f6" />
              <text x="24" y="144.5" textAnchor="middle" fill="white" fontSize="5" fontWeight="700">R</text>

              {/* AED Marker (void deck) */}
              <g>
                <rect x="140" y="245" width="120" height="40" fill="#10b98110" rx="8" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />
                <text x="200" y="263" textAnchor="middle" fill="#10b981" fontWeight="700" fontSize="9">VOID DECK</text>
                <text x="200" y="276" textAnchor="middle" fill="#10b981" fontSize="8">AED Cabinet</text>
                {/* AED icon */}
                <circle cx="165" cy="265" r="8" fill="#10b981" />
                <text x="165" y="268" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">♥</text>
              </g>

              {/* Connection lines */}
              <line x1="120" y1="133" x2="24" y2="142" stroke="#0d9488" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <line x1="200" y1="133" x2="24" y2="142" stroke="#0d9488" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <line x1="280" y1="133" x2="24" y2="142" stroke="#0d9488" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

              {/* Legend */}
              <g transform="translate(270, 250)">
                <circle cx="0" cy="0" r="3" fill="#0d9488" />
                <text x="8" y="3" fill="#64748b" fontSize="8">Sensor Node</text>
                <circle cx="0" cy="14" r="3" fill="#3b82f6" />
                <text x="8" y="17" fill="#64748b" fontSize="8">Relay Node</text>
                <circle cx="0" cy="28" r="3" fill="#10b981" />
                <text x="8" y="31" fill="#64748b" fontSize="8">AED Unit</text>
              </g>
            </svg>
          </div>

          {/* Right: Component Details */}
          <div className="space-y-4">
            {deploymentLayers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div key={layer.label} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-border card-hover cursor-default">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${layer.color}10` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: layer.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-bold text-text-heading">{layer.label}</h3>
                    </div>
                    <p className="text-[13px] text-text-muted leading-relaxed">{layer.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Flow */}
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
          <p className="text-[11px] font-bold text-text-light uppercase tracking-widest mb-6 text-center">
            End-to-End Integration Flow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              { label: 'HDB Corridor', sub: 'Ceiling sensor nodes', icon: Radio },
              { label: 'Lift Lobby Relay', sub: 'Mesh + LTE backup', icon: Signal },
              { label: 'Cloud Gateway', sub: 'Encrypted payload', icon: Shield },
              { label: 'SCDF Dashboard', sub: 'Operator verification', icon: Monitor },
              { label: 'CFR / Ambulance', sub: 'Dispatch coordination', icon: Heart },
            ].map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex flex-col items-center gap-2 min-w-[100px] sm:min-w-[120px]">
                    <div className="w-10 h-10 rounded-xl bg-primary-ghost flex items-center justify-center">
                      <StepIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-bold text-text-heading">{step.label}</p>
                      <p className="text-[9px] text-text-light">{step.sub}</p>
                    </div>
                  </div>
                  {i < 4 && (
                    <ArrowRight className="w-4 h-4 text-text-light hidden sm:block flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

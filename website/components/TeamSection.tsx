'use client';

import { ExternalLink } from 'lucide-react';

const team = [
  {
    name: 'Vivion Oh',
    role: 'Project Lead',
    specialty: 'Business & Financial Technology',
    desc: 'Expert in B2G strategy and system architecture. Leads stakeholder alignment and secure data workflows ensuring PDPA regulatory compliance in government healthcare environments.',
    initials: 'VO',
    gradient: 'from-primary to-cyan',
  },
  {
    name: 'Felicia Tan',
    role: 'Technical Lead',
    specialty: 'Information Technology',
    desc: 'Specialist in AI integration (ML/NLP/CV) and robotics. Ensures reliability of EchoSync\'s emergency alerting logic and EchoRover\'s autonomous navigation systems.',
    initials: 'FT',
    gradient: 'from-secondary to-primary',
  },
  {
    name: 'Chalisa Tan',
    role: 'UI/UX & Backend Lead',
    specialty: 'Information Technology',
    desc: 'Focuses on scalable platform architecture, database management, and AI integration to ensure a seamless, data-driven experience for operators and caregivers.',
    initials: 'CT',
    gradient: 'from-purple-500 to-secondary',
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="section-padding bg-bg-light relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-4">Our Team</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-6">
            Built by NYP IT Techs
          </h2>
          <p className="text-lg text-text-muted leading-relaxed">
            A team of 3 fresh NYP IT Technicians with a passion for innovation, combining expertise in AI, full-stack development, B2G strategy, and healthcare technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="card-hover p-8 rounded-2xl bg-white border border-border text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                <span className="text-xl font-bold text-white">{member.initials}</span>
              </div>
              <h3 className="text-[17px] font-bold text-text-heading">{member.name}</h3>
              <p className="text-[13px] font-semibold text-primary mt-1">{member.role}</p>
              <p className="text-[11px] text-text-light mt-0.5 mb-4">{member.specialty}</p>
              <p className="text-[13px] text-text-muted leading-relaxed">{member.desc}</p>
              <button className="mt-5 p-2 rounded-lg text-text-light hover:text-secondary hover:bg-secondary/8 transition-all cursor-pointer">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, BookOpen, ChevronDown, ChevronRight, Flame, HeartPulse, Play, ShieldCheck, Star } from 'lucide-react';

type SectionKey = 'general' | 'fire' | 'medical';

const trainingSections: Array<{
  key: SectionKey;
  title: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: Array<{ title: string; href: string; meta: string }>;
}> = [
  {
    key: 'general',
    title: 'GENERAL',
    color: '#003B73',
    icon: ShieldCheck,
    items: [{ title: 'Getting started as a CFR', href: '/myResponder/learn', meta: 'Guide • 5 min' }],
  },
  {
    key: 'fire',
    title: 'FIRE-FIGHTING',
    color: '#FF9800',
    icon: Flame,
    items: [{ title: 'Extinguishing Fires', href: '/myResponder/dashboard/fire', meta: 'Guide • 7 min' }],
  },
  {
    key: 'medical',
    title: 'MEDICAL',
    color: '#E53935',
    icon: HeartPulse,
    items: [{ title: 'Introduction to Cardiac Arrest', href: '/myResponder/dashboard/cardiac', meta: 'Guide • 6 min' }],
  },
];

const videos = [
  { title: 'CPR Adult', duration: '02:41', color: '#E53935' },
  { title: 'CPR Infant', duration: '03:12', color: '#003B73' },
  { title: 'Choking Adult', duration: '01:58', color: '#FF9800' },
];

export default function LearnPage() {
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    general: true,
    fire: true,
    medical: true,
  });

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header shrink-0">
        <div>
          <h1 className="text-[20px] font-black tracking-[-0.02em] text-[#003B73]">Learn</h1>
          <p className="text-[12px] font-semibold text-slate-400">Skills education portal</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#E8F0FE] text-[#003B73]">
          <BookOpen size={22} />
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="rounded-[24px] bg-[#003B73] p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-black uppercase tracking-wide text-white/60">My badges</p>
              <h2 className="mt-1 text-[23px] font-black leading-tight">Responder progress</h2>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <Award size={30} color="#FFD700" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {['Starter', 'Fire Ready', 'CPR Aware'].map((badge, index) => (
              <div key={badge} className="rounded-2xl bg-white/12 p-3 text-center">
                <Star className="mx-auto mb-1" size={18} fill={index === 0 ? '#FFD700' : 'transparent'} color="#FFD700" />
                <p className="text-[11px] font-bold leading-tight">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <h2 className="mb-3 text-[13px] font-black uppercase tracking-wide text-slate-400">Training</h2>
        <div className="space-y-3">
          {trainingSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.key} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                  onClick={() => setOpen((current) => ({ ...current, [section.key]: !current[section.key] }))}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${section.color}14`, color: section.color }}>
                      <Icon size={21} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-black tracking-wide text-slate-900">{section.title}</span>
                      <span className="block text-[12px] font-semibold text-slate-400">{section.items.length} module</span>
                    </span>
                  </span>
                  <ChevronDown
                    className={`shrink-0 text-slate-400 transition-transform ${open[section.key] ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>

                {open[section.key] ? (
                  <div className="border-t border-slate-100">
                    {section.items.map((item) => (
                      <Link key={item.title} href={item.href} className="flex items-center justify-between gap-3 px-4 py-3 text-inherit">
                        <span className="min-w-0">
                          <span className="block text-[14px] font-bold text-slate-950">{item.title}</span>
                          <span className="mt-0.5 block text-[12px] font-medium text-slate-400">{item.meta}</span>
                        </span>
                        <ChevronRight size={18} className="shrink-0 text-slate-300" />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="pb-5 pt-4">
        <div className="mb-3 flex items-center justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide text-slate-400">Emergency video guides</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden px-4 pb-2 no-scrollbar">
          {videos.map((video) => (
            <button
              type="button"
              key={video.title}
              className="w-[154px] shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-xs"
            >
              <span className="relative grid h-[92px] place-items-center" style={{ background: `linear-gradient(135deg, ${video.color}, ${video.color}aa)` }}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-slate-900">
                  <Play size={20} fill="currentColor" />
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {video.duration}
                </span>
              </span>
              <span className="block p-3 text-[14px] font-extrabold text-slate-950">{video.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

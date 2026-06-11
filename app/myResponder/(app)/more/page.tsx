'use client';

import Link from 'next/link';
import { ChevronRight, HeartPulse, HelpCircle, Info, MapPinned, MessageSquare, Settings, Smile, Trophy } from 'lucide-react';
import { useApp } from '@/app/myResponder/context/AppContext';

const avatars = ['SC', 'DF', 'CPR', 'AED', 'FR', 'MED', 'FIR', 'RES', 'HDB', '911', '995', 'VOL', 'SG', 'LIF', 'EMS'];

const services = [
  { label: 'Find AEDs', href: '/myResponder/find-aeds', icon: HeartPulse, color: '#43A047' },
  { label: 'Feedback', href: '/myResponder/feedback', icon: MessageSquare, color: '#003B73' },
  { label: 'Wellbeing check-in', href: '/myResponder/more', icon: Smile, color: '#7C3AED' },
  { label: 'Hall of Fame', href: '/myResponder/hall-of-fame', icon: Trophy, color: '#FF9800' },
  { label: 'FAQ', href: '/myResponder/more', icon: HelpCircle, color: '#64748B' },
];

const general = [
  { label: 'Settings', href: '/myResponder/settings', icon: Settings, color: '#475569' },
  { label: 'About app', href: '/myResponder/more', icon: Info, color: '#1565C0' },
];

function Row({ item }: { item: { label: string; href: string; icon: typeof Settings; color: string } }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5 last:border-b-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${item.color}14`, color: item.color }}>
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1 text-[15px] font-bold text-slate-900">{item.label}</span>
      <ChevronRight size={18} className="shrink-0 text-slate-300" />
    </Link>
  );
}

export default function MorePage() {
  const { state } = useApp();

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header">
        <h1 className="mr-header-title">More</h1>
      </header>
      <section className="px-4 pt-4">
        <Link href="/myResponder/profile" className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-xs">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-[#003B73] bg-[#E8F0FE] text-[17px] font-black text-[#003B73]">
            {avatars[state.user.avatar] ?? avatars[0]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[20px] font-black text-slate-950">{state.user.displayName || 'TAN'}</span>
            <span className="mt-1 flex items-center gap-1 text-[13px] font-bold text-[#003B73]">
              Go to profile <ChevronRight size={15} />
            </span>
          </span>
        </Link>
      </section>
      <section>
        <h2 className="mr-section-header">OTHER SERVICES</h2>
        <div className="mx-4 overflow-hidden rounded-2xl shadow-xs">{services.map((item) => <Row key={item.label} item={item} />)}</div>
      </section>
      <section className="pb-5">
        <h2 className="mr-section-header">GENERAL</h2>
        <div className="mx-4 overflow-hidden rounded-2xl shadow-xs">{general.map((item) => <Row key={item.label} item={item} />)}</div>
        <div className="mx-4 mt-4 rounded-2xl bg-white p-4 text-center text-[12px] font-semibold text-slate-400">
          myResponder v4.2.0 • Singapore Civil Defence Force
        </div>
      </section>
    </div>
  );
}

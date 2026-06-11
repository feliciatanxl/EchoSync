'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import { leaderboard } from '@/app/myResponder/data/mockLeaderboard';

type Tier = 'platinum' | 'gold' | 'silver';

const tierStyle: Record<Tier, { medal: string; bg: string }> = {
  platinum: { medal: '#E5E4E2', bg: '#F8FAFC' },
  gold: { medal: '#FFD700', bg: '#FFF8E1' },
  silver: { medal: '#C0C0C0', bg: '#F1F5F9' },
};

export default function HallOfFamePage() {
  const [tier, setTier] = useState<Tier>('platinum');

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header"><h1 className="mr-header-title">Hall of Fame</h1></header>
      <section className="p-4">
        <div className="grid grid-cols-3 rounded-2xl bg-white p-1 shadow-xs">
          {(['platinum', 'gold', 'silver'] as Tier[]).map((item) => (
            <button key={item} type="button" onClick={() => setTier(item)} className={`rounded-xl py-2 text-[12px] font-black uppercase ${tier === item ? 'bg-[#003B73] text-white' : 'text-slate-500'}`}>{item}</button>
          ))}
        </div>
        <div className="mt-4 rounded-[28px] p-5 text-center shadow-xs" style={{ background: tierStyle[tier].bg }}>
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white shadow-md">
            <Award size={54} color={tierStyle[tier].medal} fill={tierStyle[tier].medal} />
          </div>
          <h2 className="mt-3 text-[22px] font-black capitalize text-slate-950">{tier} responders</h2>
          <p className="text-[13px] font-semibold text-slate-500">Recognising our top Community First Responders</p>
        </div>
      </section>
      <section className="space-y-2 px-4 pb-5">
        {leaderboard[tier].map((entry) => (
          <div key={entry.rank} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xs">
            <span className="grid h-10 w-10 place-items-center rounded-full text-[14px] font-black" style={{ background: tierStyle[tier].bg, color: '#003B73' }}>{entry.rank}</span>
            <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-slate-950">{entry.name}</span>
            <span className="text-[13px] font-black text-[#003B73]">{entry.cases} Cases</span>
          </div>
        ))}
      </section>
    </div>
  );
}

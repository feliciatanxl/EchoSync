// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MOCK_HALL_OF_FAME } from '@/lib/mockData';
import { motion } from 'framer-motion';

const TIERS = [
  { key: 'platinum', label: 'Platinum', color: '#8B8FA8', ring: '#22c55e', bg: 'from-slate-300 to-slate-400' },
  { key: 'gold', label: 'Gold', color: '#D4AF37', ring: '#D4AF37', bg: 'from-yellow-300 to-yellow-500' },
  { key: 'silver', label: 'Silver', color: '#A8A9AD', ring: '#A8A9AD', bg: 'from-gray-300 to-gray-400' },
];

const TIER_DESC = {
  platinum: 'The platinum award recognizes the top responders (1st – 12th place) for their exceptional dedication in responding to cardiac arrest and minor fire emergencies in the year of 2025 (As of 15th December 2025).',
  gold: 'The gold award recognizes responders ranked 13th – 50th place for their outstanding dedication in 2025.',
  silver: 'The silver award recognizes responders ranked 51st – 100th place for their commitment in 2025.',
};

export default function HallOfFame() {
  const [activeTier, setActiveTier] = useState('platinum');
  const navigate = useNavigate();
  const tier = TIERS.find((t) => t.key === activeTier);
  const entries = MOCK_HALL_OF_FAME[activeTier];

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      {/* Header */}
      <div className="bg-[#d8edf8] px-4 pt-10 pb-6 relative overflow-hidden">
        <div className="absolute top-2 right-4 text-6xl">🏅</div>
        <button onClick={() => navigate(-1)} className="mb-3">
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-2xl font-black text-[#1e3a8a]">Hall of Fame</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-[220px]">
          We celebrate our top responders for the year. Thank you for your contributions!
        </p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Tier selector */}
        <div className="flex gap-4 justify-center">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTier(t.key)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTier === t.key ? 'scale-110' : 'opacity-60'}`}
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-b ${t.bg} flex items-center justify-center shadow-md ${activeTier === t.key ? 'ring-4' : ''}`}
                style={{ ringColor: t.ring }}
              >
                <div className="text-center">
                  <div className="text-[8px] font-black text-white uppercase">{t.label.toUpperCase()}</div>
                  <div className="text-lg">🏆</div>
                  <div className="text-[8px] text-white/80 uppercase">AWARD</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tier info */}
        <div className="text-center">
          <h2 className="text-lg font-black text-[#1e3a8a]">myResponder Awards 2025 – {tier.label}</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{TIER_DESC[activeTier]}</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-gray-300 w-5">{i + 1}</span>
                <span className="font-bold text-gray-900 text-sm">{entry.name}</span>
              </div>
              <span className="font-bold text-gray-600 text-sm">{entry.cases} Cases</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
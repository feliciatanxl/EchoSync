'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { leaderboard } from '@/app/myResponder/data/mockLeaderboard';

type Tier = 'platinum' | 'gold' | 'silver';

const TIER_COLORS: Record<Tier, { bg: string; text: string }> = {
  platinum: { bg: '#E5E4E2', text: '#3d3d3d' },
  gold: { bg: '#FFD700', text: '#5c4813' },
  silver: { bg: '#C0C0C0', text: '#3d3d3d' },
};

export default function HallOfFamePage() {
  const router = useRouter();
  const [activeTier, setActiveTier] = useState<Tier>('platinum');

  const entries = leaderboard[activeTier];

  return (
    <div className="mr-page mr-animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div className="mr-header">
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--scdf-blue)',
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: 15,
            padding: '4px 0',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
        <span className="mr-header-title">Hall of Fame</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Hero Banner */}
      <div
        style={{
          margin: '16px',
          padding: '28px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 50%, #FF8F00 100%)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -10,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{ fontSize: 48, marginBottom: 8, position: 'relative' }}>🏆</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#5c3a00', letterSpacing: -0.3, position: 'relative' }}>
          Honouring our top responders
        </div>
        <div style={{ fontSize: 13, color: '#7a5000', marginTop: 4, fontWeight: 500, position: 'relative' }}>
          Thank you for making a difference
        </div>
      </div>

      {/* Tier Tabs */}
      <div className="mr-tabs">
        {(['platinum', 'gold', 'silver'] as Tier[]).map((tier) => (
          <button
            key={tier}
            className={`mr-tab ${activeTier === tier ? 'active' : ''}`}
            onClick={() => setActiveTier(tier)}
          >
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div
        style={{
          background: 'white',
          margin: '12px 16px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          animation: 'mr-fade-in 0.3s var(--ease-out)',
        }}
        key={activeTier}
      >
        {entries.map((entry) => {
          const isTopThree = entry.rank <= 3;
          const tierColor = TIER_COLORS[activeTier];
          return (
            <div
              key={entry.rank}
              className="mr-leaderboard-item"
              style={{
                animation: `mr-fade-in 0.3s var(--ease-out) ${entry.rank * 0.04}s both`,
                ...(isTopThree ? { background: 'var(--gray-50)' } : {}),
              }}
            >
              <div
                className="mr-leaderboard-rank"
                style={{
                  background: tierColor.bg,
                  color: tierColor.text,
                  ...(isTopThree
                    ? { width: 38, height: 38, fontSize: 16, boxShadow: 'var(--shadow-sm)' }
                    : {}),
                }}
              >
                {entry.rank}
              </div>
              <div className="mr-leaderboard-name" style={isTopThree ? { fontWeight: 700, fontSize: 16 } : {}}>
                {entry.name}
              </div>
              <div className="mr-leaderboard-cases">
                <span style={{ fontWeight: 800 }}>{entry.cases}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', marginLeft: 4 }}>Cases</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useAppState } from '@/app/myResponder/context/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const AVATARS = ['👨🚒', '👩🚒', '👨⚕️', '👩⚕️', '🧑', '👩', '🐼', '🦊', '🐘', '🦁', '🐕', '🐱'];

export default function MorePage() {
  const { state } = useAppState();
  const router = useRouter();
  const [showAbout, setShowAbout] = useState(false);

  const avatarEmoji = AVATARS[state.user.avatar] || AVATARS[0];

  return (
    <div className="mr-page mr-animate-fade-in">
      {/* Header */}
      <div className="mr-header">
        <span className="mr-header-title">More</span>
      </div>

      {/* Profile Card */}
      <div style={{ padding: '24px 16px 8px' }}>
        <Link
          href="/myResponder/profile"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            padding: '20px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.25s var(--ease-out)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--scdf-light-blue), #dbeafe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 4px 14px rgba(0,59,115,0.15)',
              border: '3px solid var(--scdf-blue)',
              marginBottom: 10,
            }}
          >
            {avatarEmoji}
          </div>
          <span className="mr-title-md" style={{ marginBottom: 4 }}>
            {state.user.displayName}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--scdf-blue)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Go to profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </Link>
      </div>

      {/* OTHER SERVICES */}
      <div className="mr-section-header">OTHER SERVICES</div>
      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', margin: '0 16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <Link href="/myResponder/find-aeds" className="mr-list-row" style={{ animationDelay: '0.05s' }}>
          <div className="mr-list-row-icon" style={{ background: 'var(--scdf-green-light)' }}>💚</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">Find AEDs</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Link>
        <Link href="/myResponder/feedback" className="mr-list-row" style={{ animationDelay: '0.1s' }}>
          <div className="mr-list-row-icon" style={{ background: '#E3F2FD' }}>💬</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">Feedback</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Link>
        <Link href="/myResponder/wellbeing" className="mr-list-row" style={{ animationDelay: '0.15s' }}>
          <div className="mr-list-row-icon" style={{ background: '#E8F5E9' }}>🧘</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">Wellbeing check-in</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Link>
        <Link href="/myResponder/hall-of-fame" className="mr-list-row" style={{ animationDelay: '0.2s' }}>
          <div className="mr-list-row-icon" style={{ background: '#FFF8E1' }}>🏆</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">Hall of Fame</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Link>
        <div
          className="mr-list-row"
          onClick={() => alert('FAQ page coming soon')}
          style={{ borderBottom: 'none', animationDelay: '0.25s' }}
        >
          <div className="mr-list-row-icon" style={{ background: '#F3E5F5' }}>❓</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">FAQ</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>

      {/* GENERAL */}
      <div className="mr-section-header">GENERAL</div>
      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', margin: '0 16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <Link href="/myResponder/settings" className="mr-list-row">
          <div className="mr-list-row-icon" style={{ background: 'var(--gray-100)' }}>⚙️</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">Settings</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Link>
        <div
          className="mr-list-row"
          onClick={() => setShowAbout(true)}
          style={{ borderBottom: 'none' }}
        >
          <div className="mr-list-row-icon" style={{ background: '#E3F2FD' }}>ℹ️</div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title">About app</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />

      {/* About Modal */}
      {showAbout && (
        <div className="mr-modal-backdrop" onClick={() => setShowAbout(false)}>
          <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚒</div>
            <div className="mr-modal-title">About myResponder</div>
            <div className="mr-modal-body">
              <div style={{ marginBottom: 6, fontWeight: 600, color: 'var(--gray-900)' }}>myResponder v4.2.0</div>
              <div>Developed by SCDF</div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-500)' }}>
                © 2026 Singapore Civil Defence Force
              </div>
            </div>
            <div className="mr-modal-actions">
              <button className="mr-modal-btn-primary" onClick={() => setShowAbout(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

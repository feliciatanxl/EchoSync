'use client';

import { useAppState } from '@/app/myResponder/context/AppContext';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

const AVATARS = ['👨🚒', '👩🚒', '👨⚕️', '👩⚕️', '🧑', '👩', '🐼', '🦊', '🐘', '🦁', '🐕', '🐱'];

export default function ProfilePage() {
  const { state, updateUser } = useAppState();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cfr' | 'account'>('cfr');
  const [displayName, setDisplayName] = useState(state.user.displayName);
  const [email, setEmail] = useState(state.user.email);
  const [showToast, setShowToast] = useState(false);

  const avatarEmoji = AVATARS[state.user.avatar] || AVATARS[0];

  // Generate a stable CFR ID
  const cfrId = useMemo(() => {
    const digits = Math.floor(100000 + Math.random() * 900000);
    return `CFR-2026-${digits}`;
  }, []);

  const maskNric = (nric: string) => {
    if (!nric || nric.length < 4) return '****';
    return '●●●●' + nric.slice(-4);
  };

  const handleSave = () => {
    updateUser({ displayName, email });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

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
        <span className="mr-header-title">Profile</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Tabs */}
      <div className="mr-tabs">
        <button
          className={`mr-tab ${activeTab === 'cfr' ? 'active' : ''}`}
          onClick={() => setActiveTab('cfr')}
        >
          My CFR ID
        </button>
        <button
          className={`mr-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          My Account
        </button>
      </div>

      {/* TAB 1: CFR ID */}
      {activeTab === 'cfr' && (
        <div style={{ animation: 'mr-fade-in 0.3s var(--ease-out)' }}>
          <div className="mr-cfr-card">
            {/* Badge text */}
            <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 20 }}>
              Singapore Civil Defence Force
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  border: '3px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {avatarEmoji}
              </div>
            </div>

            {/* Name */}
            <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, letterSpacing: 0.3, marginBottom: 4 }}>
              {state.user.name}
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
              Community First Responder
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '0 -8px 16px' }} />

            {/* CFR ID */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, letterSpacing: 1, marginBottom: 4 }}>CFR ID</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, fontFamily: 'monospace' }}>{cfrId}</div>
            </div>

            {/* Security Banner */}
            <div
              style={{
                marginTop: 20,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 11,
                lineHeight: 1.4,
                textAlign: 'center',
                opacity: 0.8,
              }}
            >
              Please cooperate with our volunteer Community First Responder who is here to help.
            </div>

            {/* SCDF Logo Text */}
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 10, fontWeight: 700, letterSpacing: 3, opacity: 0.5, textTransform: 'uppercase' }}>
              SCDF
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: My Account */}
      {activeTab === 'account' && (
        <div className="mr-page-content" style={{ animation: 'mr-fade-in 0.3s var(--ease-out)' }}>
          {/* Avatar Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'var(--scdf-light-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                border: '3px solid var(--scdf-blue)',
                marginBottom: 12,
                boxShadow: '0 4px 14px rgba(0,59,115,0.15)',
              }}
            >
              {avatarEmoji}
            </div>
            <button
              className="mr-btn mr-btn-secondary mr-btn-sm"
              onClick={() => router.push('/myResponder/setup-step2')}
              style={{ width: 'auto', padding: '8px 20px' }}
            >
              Choose avatar
            </button>
          </div>

          {/* Form Fields */}
          <div className="mr-input-group">
            <label className="mr-input-label">Display Name</label>
            <input
              className="mr-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="mr-input-group">
            <label className="mr-input-label">Email</label>
            <input
              className="mr-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="mr-input-group">
            <label className="mr-input-label">Name</label>
            <input className="mr-input" type="text" value={state.user.name} readOnly />
          </div>

          <div className="mr-input-group">
            <label className="mr-input-label">NRIC</label>
            <input className="mr-input" type="text" value={maskNric(state.user.nric)} readOnly />
          </div>

          <div className="mr-input-group">
            <label className="mr-input-label">Mobile</label>
            <input className="mr-input" type="text" value={state.user.phone} readOnly />
          </div>

          {/* Save Button */}
          <button className="mr-btn mr-btn-primary mr-mt-16" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            background: 'var(--scdf-green)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1100,
            animation: 'mr-scale-in 0.3s var(--ease-spring)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Profile updated successfully!
        </div>
      )}
    </div>
  );
}

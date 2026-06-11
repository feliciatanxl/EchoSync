'use client';

import { useAppState } from '@/app/myResponder/context/AppContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ModalType = 'clear' | 'logout' | null;

export default function SettingsPage() {
  const { state, updatePreferences, resetState } = useAppState();
  const router = useRouter();
  const [modal, setModal] = useState<ModalType>(null);

  const handleConfirm = () => {
    resetState();
    router.push('/myResponder/welcome');
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
        <span className="mr-header-title">Settings</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Alert Settings */}
      <div className="mr-section-header">ALERT SETTINGS</div>
      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', margin: '0 16px', padding: '4px 16px', boxShadow: 'var(--shadow-sm)' }}>
        {/* Bypass Silent */}
        <div style={{ paddingTop: 12, paddingBottom: 12 }}>
          <div className="mr-title-sm" style={{ marginBottom: 10 }}>Bypass silent mode</div>
          <div className="mr-radio-group">
            <label
              className={`mr-radio-item ${state.preferences.bypassSilent ? 'selected' : ''}`}
              onClick={() => updatePreferences({ bypassSilent: true })}
            >
              <input
                type="radio"
                name="bypassSilent"
                checked={state.preferences.bypassSilent}
                onChange={() => updatePreferences({ bypassSilent: true })}
              />
              <span style={{ fontSize: 15, fontWeight: 500 }}>Yes</span>
            </label>
            <label
              className={`mr-radio-item ${!state.preferences.bypassSilent ? 'selected' : ''}`}
              onClick={() => updatePreferences({ bypassSilent: false })}
            >
              <input
                type="radio"
                name="bypassSilent"
                checked={!state.preferences.bypassSilent}
                onChange={() => updatePreferences({ bypassSilent: false })}
              />
              <span style={{ fontSize: 15, fontWeight: 500 }}>No</span>
            </label>
          </div>
        </div>

        {/* Cardiac Toggle */}
        <div className="mr-toggle-wrapper" style={{ borderTop: '1px solid var(--gray-100)' }}>
          <div>
            <div className="mr-title-sm">Cardiac arrest alerts</div>
          </div>
          <div
            className={`mr-toggle-track ${state.preferences.cardiacAlert ? 'active' : ''}`}
            onClick={() => updatePreferences({ cardiacAlert: !state.preferences.cardiacAlert })}
          >
            <div className="mr-toggle-thumb" />
          </div>
        </div>

        {/* Fire Toggle */}
        <div className="mr-toggle-wrapper" style={{ borderTop: '1px solid var(--gray-100)' }}>
          <div>
            <div className="mr-title-sm">Fire alerts</div>
            <div className="mr-body-sm" style={{ color: 'var(--gray-500)', marginTop: 2 }}>
              For minor fire in rubbish bins or chutes only
            </div>
          </div>
          <div
            className={`mr-toggle-track ${state.preferences.fireAlert ? 'active' : ''}`}
            onClick={() => updatePreferences({ fireAlert: !state.preferences.fireAlert })}
          >
            <div className="mr-toggle-thumb" />
          </div>
        </div>
      </div>

      {/* Transport Mode */}
      <div className="mr-section-header">PREFERRED MODE OF TRANSPORT</div>
      <div style={{ padding: '0 16px' }}>
        <div className="mr-transport-selector">
          <div
            className={`mr-transport-option ${state.preferences.transportMode === 'walk' ? 'selected' : ''}`}
            onClick={() => updatePreferences({ transportMode: 'walk' })}
          >
            <div className="mr-transport-option-icon">🚶</div>
            <div className="mr-transport-option-label">Walk</div>
            <div className="mr-transport-option-radius">400m</div>
          </div>
          <div
            className={`mr-transport-option ${state.preferences.transportMode === 'cycle' ? 'selected' : ''}`}
            onClick={() => updatePreferences({ transportMode: 'cycle' })}
          >
            <div className="mr-transport-option-icon">🚴</div>
            <div className="mr-transport-option-label">Cycle</div>
            <div className="mr-transport-option-radius">800m</div>
          </div>
          <div
            className={`mr-transport-option ${state.preferences.transportMode === 'vehicle' ? 'selected' : ''}`}
            onClick={() => updatePreferences({ transportMode: 'vehicle' })}
          >
            <div className="mr-transport-option-icon">🚗</div>
            <div className="mr-transport-option-label">Vehicle</div>
            <div className="mr-transport-option-radius">1500m</div>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="mr-section-header">ACCOUNT</div>
      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', margin: '0 16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div className="mr-list-row" onClick={() => setModal('clear')}>
          <div className="mr-list-row-icon" style={{ background: '#FFF3E0' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
          </div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title" style={{ color: 'var(--scdf-orange)' }}>Clear app data</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
        <div className="mr-list-row" onClick={() => setModal('logout')} style={{ borderBottom: 'none' }}>
          <div className="mr-list-row-icon" style={{ background: '#FFEBEE' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--scdf-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </div>
          <div className="mr-list-row-text">
            <div className="mr-list-row-title" style={{ color: 'var(--scdf-red)' }}>Log out</div>
          </div>
          <div className="mr-list-row-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal && (
        <div className="mr-modal-backdrop" onClick={() => setModal(null)}>
          <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {modal === 'clear' ? '🗑️' : '👋'}
            </div>
            <div className="mr-modal-title">
              {modal === 'clear' ? 'Clear app data?' : 'Log out?'}
            </div>
            <div className="mr-modal-body">
              {modal === 'clear'
                ? 'This will reset all your settings and data. You will need to set up the app again.'
                : 'You will be signed out and returned to the welcome screen.'}
            </div>
            <div className="mr-modal-actions">
              <button className="mr-modal-btn-secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                className="mr-modal-btn-primary"
                onClick={handleConfirm}
                style={{ background: 'var(--scdf-red)' }}
              >
                {modal === 'clear' ? 'Clear' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

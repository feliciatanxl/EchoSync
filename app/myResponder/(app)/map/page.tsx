'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { mockIncidents, type Incident } from '@/app/myResponder/data/mockIncidents';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Incident | null>(null);

  return (
    <div className="mr-animate-fade-in" style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <header className="mr-header" style={{ flexShrink: 0 }}>
        <div className="mr-flex mr-items-center mr-gap-8">
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="mr-header-title">Cases Today</span>
        </div>
        <div className="mr-flex mr-items-center mr-gap-8">
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: '#1565C0',
            background: '#E8F0FE',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1565C0' }} />
            Cardiac
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: '#E53935',
            background: '#FFEBEE',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E53935' }} />
            Fire
          </span>
        </div>
      </header>

      {/* Map */}
      <div className="mr-map-container" style={{ flex: 1 }}>
        <MapView
          incidents={mockIncidents}
          onSelectIncident={setSelected}
        />
      </div>

      {/* Drawer */}
      {selected && (
        <>
          <div className="mr-drawer-backdrop" onClick={() => setSelected(null)} />
          <div className="mr-drawer">
            <div className="mr-drawer-handle" />
            <button className="mr-drawer-close" onClick={() => setSelected(null)}>✕</button>

            <div style={{ marginTop: 8 }}>
              {/* Type badge */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                background: selected.type === 'cardiac' ? '#E8F0FE' : '#FFEBEE',
                color: selected.type === 'cardiac' ? '#1565C0' : '#E53935',
                marginBottom: 12,
              }}>
                {selected.type === 'cardiac' ? '💙 Cardiac Arrest' : '🔥 Fire'}
              </span>

              <p className="mr-title-md" style={{ marginTop: 8 }}>{selected.address}</p>
              <p className="mr-body-sm" style={{ color: 'var(--gray-500)', marginTop: 4 }}>
                Postal Code: {selected.postalCode}
              </p>
              <p className="mr-body-sm" style={{ color: 'var(--gray-500)', marginTop: 2 }}>
                {selected.timestamp}
              </p>

              {/* Status */}
              <div style={{
                marginTop: 16,
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: selected.status === 'active' ? '#FFF3F3' : 'var(--gray-50)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                {selected.status === 'active' && (
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#E53935',
                    animation: 'mr-pulse 1.5s infinite',
                    flexShrink: 0,
                  }} />
                )}
                <p style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: selected.status === 'active' ? '#E53935' : 'var(--gray-500)',
                }}>
                  {selected.status === 'active'
                    ? 'This emergency is happening now.'
                    : 'This emergency is resolved.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

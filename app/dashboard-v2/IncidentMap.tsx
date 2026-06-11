'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon } from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type IncidentStatus = 'Active' | 'Dispatched' | 'En Route' | 'On Scene' | 'Resolved';

interface OpsLogEntry {
  time: string;
  title: string;
  description: string;
  source: string;
}

interface Incident {
  id: string;
  type: string;
  location: string;
  elapsedTime: string;
  severity: Severity;
  flagged: boolean;
  status: IncidentStatus;
  assignedUnit: string;
  lastUpdated: string;
  lat: number;
  lng: number;
  description: string;
  evidence: string[];
  opsLog: OpsLogEntry[];
}

// ─────────────────────────────────────────────────────────
// Custom marker icons
// ─────────────────────────────────────────────────────────

function createIcon(severity: Severity, isSelected: boolean): L.DivIcon {
  const colors: Record<Severity, { bg: string; ring: string }> = {
    Critical: { bg: '#ef4444', ring: 'rgba(239,68,68,0.35)' },
    High: { bg: '#f97316', ring: 'rgba(249,115,22,0.35)' },
    Medium: { bg: '#f59e0b', ring: 'rgba(245,158,11,0.35)' },
    Low: { bg: '#22c55e', ring: 'rgba(34,197,94,0.35)' },
  };
  const c = colors[severity];
  const dotSize = isSelected ? 18 : 12;
  const outerSize = dotSize + 14;
  const pulse = isSelected
    ? `<span style="position:absolute;inset:-4px;border-radius:50%;background:${c.ring};animation:marker-pulse 2s ease-in-out infinite;pointer-events:none;"></span>`
    : '';

  return L.divIcon({
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2 + 4)],
    html: `
      <div style="position:relative;width:${outerSize}px;height:${outerSize}px;display:flex;align-items:center;justify-content:center;">
        ${pulse}
        <div style="
          width:${dotSize}px;height:${dotSize}px;border-radius:50%;
          background:${c.bg};
          border:2.5px solid white;
          box-shadow:0 2px 10px rgba(0,0,0,0.25);
          position:relative;z-index:2;
        "></div>
      </div>
    `,
  });
}

// ─────────────────────────────────────────────────────────
// Popup HTML builder
// ─────────────────────────────────────────────────────────

function popupContent(inc: Incident): string {
  const sevBadge: Record<Severity, string> = {
    Critical: 'background:#fee2e2;color:#b91c1c;',
    High: 'background:#ffedd5;color:#c2410c;',
    Medium: 'background:#fef3c7;color:#b45309;',
    Low: 'background:#dcfce7;color:#15803d;',
  };
  const statusStyle: Record<string, string> = {
    Active: 'background:#fef2f2;color:#dc2626;',
    Dispatched: 'background:#eff6ff;color:#2563eb;',
    'En Route': 'background:#ecfeff;color:#0891b2;',
    'On Scene': 'background:#ecfdf5;color:#059669;',
    Resolved: 'background:#f8fafc;color:#64748b;',
  };
  
  // SVG strings from Lucide React
  const svgs: Record<string, string> = {
    Medical: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 9.2a2 2 0 0 0-.27 1.35l.99 4.9a2 2 0 0 0 3.97-.47l.45-5a2 2 0 0 0-.96-1.89l-2.05-1.12"/></svg>',
    Fire: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    'Fall Detection': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
    'Unresponsive Resident': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    'Gas Leak': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>'
  };
  const iconSvg = svgs[inc.type] || svgs['Unresponsive Resident'];
  
  const evidenceHtml = inc.evidence && inc.evidence.length > 0 
    ? `
      <div style="margin-top:14px;padding-top:12px;border-top:1px dashed #cbd5e1;">
        <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;display:flex;align-items:center;gap:4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Detection Evidence
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${inc.evidence.map(ev => `<span style="background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;font-size:10px;font-weight:500;padding:3px 8px;border-radius:6px;">${ev}</span>`).join('')}
        </div>
      </div>
    `
    : '';

  return `
    <div style="font-family:Inter,system-ui,-apple-system,sans-serif;width:100%;">
      <!-- Header -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;padding-right:44px;">
        <div style="display:flex;align-items:center;gap:10px;color:${inc.severity === 'Critical' ? '#b91c1c' : '#0f172a'};">
          ${iconSvg}
          <span style="font-size:16px;font-weight:800;letter-spacing:-0.02em;">${inc.type}</span>
        </div>
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;padding:4px 12px;border-radius:99px;letter-spacing:0.05em;${sevBadge[inc.severity]}">${inc.severity}</span>
      </div>

      <!-- Case ID + Location -->
      <div style="margin-bottom:12px;">
        <div style="font-size:11px;font-family:'SF Mono',ui-monospace,monospace;color:#94a3b8;margin-bottom:5px;">${inc.id}</div>
        <div style="font-size:13px;color:#334155;font-weight:500;display:flex;align-items:flex-start;gap:6px;line-height:1.5;">
          <svg style="flex-shrink:0;margin-top:2px;color:#94a3b8;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${inc.location}</span>
        </div>
      </div>

      <!-- Description -->
      <div style="font-size:12.5px;color:#475569;line-height:1.65;margin-bottom:14px;padding:12px 14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
        ${inc.description}
      </div>

      <!-- 2x2 Stats Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;">
        <div style="background:#f1f5f9;padding:10px 12px;border-radius:8px;">
          <div style="color:#94a3b8;font-weight:600;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Elapsed</div>
          <div style="color:#1e293b;font-weight:700;font-family:'SF Mono',ui-monospace,monospace;">${inc.elapsedTime}</div>
        </div>
        <div style="background:#f1f5f9;padding:10px 12px;border-radius:8px;">
          <div style="color:#94a3b8;font-weight:600;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Assigned Unit</div>
          <div style="color:#1e293b;font-weight:700;">${inc.assignedUnit}</div>
        </div>
        <div style="background:#f1f5f9;padding:10px 12px;border-radius:8px;">
          <div style="color:#94a3b8;font-weight:600;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Priority</div>
          <div style="font-weight:700;${sevBadge[inc.severity].replace('background:', 'color:').split(';')[1]}">${inc.severity}</div>
        </div>
        <div style="padding:10px 12px;border-radius:8px;text-align:center;${statusStyle[inc.status] || 'background:#f1f5f9;color:#334155;'}">
          <div style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;opacity:0.7;">Status</div>
          <div style="font-weight:800;font-size:11px;text-transform:uppercase;">${inc.status}</div>
        </div>
      </div>
      
      ${evidenceHtml}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────
// FlyTo controller
// ─────────────────────────────────────────────────────────

function FlyToController({ incident }: { incident: Incident | null }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (incident && incident.id !== prevId.current) {
      map.flyTo([incident.lat, incident.lng], 17, { duration: 1.2 });
      prevId.current = incident.id;
    } else if (!incident && prevId.current !== null) {
      map.flyTo([1.3521, 103.8198], 11.5, { duration: 1.2 });
      map.closePopup();
      prevId.current = null;
    }
  }, [incident, map]);

  return null;
}

// ─────────────────────────────────────────────────────────
// Exported Map Component
// ─────────────────────────────────────────────────────────

export default function IncidentMap({
  incidents,
  selectedId,
  onSelectIncident,
}: {
  incidents: Incident[];
  selectedId: string | null;
  onSelectIncident: (id: string | null) => void;
}) {
  const selectedIncident = incidents.find(i => i.id === selectedId) || null;
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!selectedId) return;
    const timeout = setTimeout(() => {
      const marker = markerRefs.current[selectedId];
      if (marker) marker.openPopup();
    }, 900);
    return () => clearTimeout(timeout);
  }, [selectedId]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute top-3 right-3 z-[400]">
        <button
          onClick={() => onSelectIncident(null)}
          className="bg-white border border-slate-200 shadow-md rounded-md px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <MapIcon className="w-3.5 h-3.5 text-slate-500" />
          Overview
        </button>
      </div>
      <style>{`
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 20px !important;
          padding: 0 !important;
          box-shadow: 0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06) !important;
          overflow: hidden !important;
          border: 1px solid #e2e8f0 !important;
          max-width: min(420px, calc(100vw - 32px)) !important;
          max-height: calc(100dvh - 300px) !important;
        }
        .leaflet-popup-content {
          margin: 12px 14px !important;
          width: clamp(280px, 26vw, 420px) !important;
          max-width: min(420px, calc(100vw - 48px)) !important;
          max-height: calc(100dvh - 332px) !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          line-height: 1.4 !important;
          font-size: 12.5px !important;
        }
        @media (min-width: 1536px) and (min-height: 900px) {
          .leaflet-popup-content {
            margin: 14px 16px !important;
            width: clamp(320px, 28vw, 460px) !important;
            max-width: min(460px, calc(100vw - 48px)) !important;
            max-height: calc(100dvh - 280px) !important;
            font-size: 13px !important;
          }
        }
        @media (max-width: 1023px) {
          .leaflet-popup-content-wrapper {
            max-width: calc(100vw - 32px) !important;
          }
          .leaflet-popup-content {
            width: auto !important;
            min-width: min(320px, calc(100vw - 64px)) !important;
            max-width: calc(100vw - 64px) !important;
          }
        }
        .leaflet-popup-tip-container {
          margin-top: -1px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          border: 1px solid #e2e8f0 !important;
        }
        .leaflet-popup-close-button {
          top: 12px !important;
          right: 12px !important;
          width: 30px !important;
          height: 30px !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #64748b !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 9999px !important;
          background: #f1f5f9 !important;
          line-height: 30px !important;
          padding: 0 !important;
          transition: all 0.15s ease !important;
          z-index: 10 !important;
        }
        .leaflet-popup-close-button:hover {
          color: #475569 !important;
          background: #e2e8f0 !important;
        }
        .leaflet-container {
          font-family: Inter, system-ui, -apple-system, sans-serif !important;
          background: #f8fafc !important;
        }
      `}</style>
      <MapContainer
        center={[1.3521, 103.8198]}
        zoom={11.5}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FlyToController incident={selectedIncident} />
        {incidents.map((inc) => {
          const isSelected = inc.id === selectedId;
          return (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={createIcon(inc.severity, isSelected)}
              eventHandlers={{
                click: () => onSelectIncident(inc.id),
              }}
              ref={(ref) => {
                if (ref) markerRefs.current[inc.id] = ref;
              }}
            >
              <Popup minWidth={280} maxWidth={420} closeButton={true} autoPan keepInView>
                <div dangerouslySetInnerHTML={{ __html: popupContent(inc) }} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

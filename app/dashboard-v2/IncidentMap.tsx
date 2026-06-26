'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type IncidentStatus =
  | 'Active'
  | 'Dispatched'
  | 'Operator Review'
  | 'En Route'
  | 'On Scene'
  | 'Resolved';

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
  nodeId?: string;
  block?: string;
  unit?: string;
  postalCode?: string;
  locationSource?: string;
  locationAccuracy?: string;
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
  const dotSize = isSelected ? 26 : 18;
  const outerSize = dotSize + 22;

  const pulse =
    isSelected || severity === 'Critical'
      ? `<span style="position:absolute;inset:${
          isSelected ? '4px' : '6px'
        };border-radius:50%;background:${
          c.ring
        };animation:marker-pulse 2s ease-in-out infinite;pointer-events:none;"></span>`
      : '';

  const shadow = isSelected
    ? `0 0 0 6px ${c.ring},0 8px 18px rgba(15,23,42,0.36)`
    : '0 0 0 4px rgba(255,255,255,0.9),0 4px 12px rgba(15,23,42,0.3)';

  return L.divIcon({
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2 + 4)],
    html: `
      <div style="position:relative;width:${outerSize}px;height:${outerSize}px;display:flex;align-items:center;justify-content:center;">
        ${pulse}
        <div style="
          width:${dotSize}px;
          height:${dotSize}px;
          border-radius:50%;
          background:${c.bg};
          border:${isSelected ? 3 : 2.5}px solid white;
          box-shadow:${shadow};
          position:relative;
          z-index:2;
        "></div>
      </div>
    `,
  });
}

// ─────────────────────────────────────────────────────────
// Popup helpers
// ─────────────────────────────────────────────────────────

function escapeHtml(value: string) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanPopupAiText(value?: string) {
  return String(value || '')
    .replace(/\*\*/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCompactPopupSummary(value?: string) {
  const clean = cleanPopupAiText(value);

  if (!clean) {
    return {
      summary: 'EchoSync alert received from registered node.',
      recommendation: 'Review details in the incident panel.',
    };
  }

  const headingRegex =
    /(Alert Summary|Recommendation|Additional Note|Operator Note|Caregiver Note|Safety Note|Risk Assessment)\s*:?\s*/gi;

  const matches = [...clean.matchAll(headingRegex)];

  if (matches.length === 0) {
    return {
      summary: clean,
      recommendation: 'Review full details below.',
    };
  }

  const sections = matches.map((match, index) => {
    const title = match[1].toLowerCase();
    const start = (match.index || 0) + match[0].length;
    const end =
      index + 1 < matches.length
        ? matches[index + 1].index || clean.length
        : clean.length;

    return {
      title,
      body: clean.slice(start, end).trim(),
    };
  });

  const summary =
    sections.find((section) => section.title.includes('summary'))?.body ||
    sections[0]?.body ||
    clean;

  const recommendation =
    sections.find((section) => section.title.includes('recommendation'))?.body ||
    'Review full details below.';

  return {
    summary,
    recommendation,
  };
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
    'Operator Review': 'background:#eff6ff;color:#2563eb;',
    'En Route': 'background:#ecfeff;color:#0891b2;',
    'On Scene': 'background:#ecfdf5;color:#059669;',
    Resolved: 'background:#f8fafc;color:#64748b;',
  };

  const closeIconSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  const alertIconSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

  const compactSummary = getCompactPopupSummary(inc.description);

  return `
    <div class="echosync-popup-scroll" style="font-family:Inter,system-ui,-apple-system,sans-serif;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;">
        <div style="display:flex;gap:8px;min-width:0;flex:1;">
          <div style="flex-shrink:0;color:${
            inc.severity === 'Critical' ? '#b91c1c' : '#c2410c'
          };">
            ${alertIconSvg}
          </div>

          <div style="min-width:0;flex:1;">
            <div style="font-size:15px;font-weight:850;letter-spacing:-0.02em;color:#0f172a;line-height:1.2;white-space:normal;overflow-wrap:anywhere;">
              ${escapeHtml(inc.type)}
            </div>

            <div style="margin-top:3px;font-size:9.5px;font-family:'SF Mono',ui-monospace,monospace;color:#94a3b8;line-height:1.25;white-space:normal;overflow-wrap:anywhere;">
              ${escapeHtml(inc.id)}
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <span style="font-size:9.5px;font-weight:800;text-transform:uppercase;padding:3px 8px;border-radius:99px;letter-spacing:0.04em;white-space:nowrap;${
            sevBadge[inc.severity]
          }">
            ${escapeHtml(inc.severity)}
          </span>

          <button type="button" class="incident-popup-close" aria-label="Close incident popup">
            ${closeIconSvg}
          </button>
        </div>
      </div>

      <div style="font-size:12px;color:#334155;font-weight:650;display:flex;gap:5px;line-height:1.3;margin-bottom:5px;">
        <span style="color:#94a3b8;flex-shrink:0;">⌖</span>
        <span style="min-width:0;white-space:normal;overflow-wrap:anywhere;">
          ${escapeHtml(inc.location)}
        </span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px;">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 7px;border-radius:8px;">
          <div style="font-size:8px;color:#94a3b8;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">
            Elapsed
          </div>
          <div style="margin-top:1px;color:#0f172a;font-weight:800;font-size:11.5px;font-family:'SF Mono',ui-monospace,monospace;">
            ${escapeHtml(inc.elapsedTime)}
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 7px;border-radius:8px;">
          <div style="font-size:8px;color:#94a3b8;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">
            Assigned
          </div>
          <div style="margin-top:1px;color:#0f172a;font-weight:800;font-size:11.5px;white-space:normal;overflow-wrap:anywhere;">
            ${escapeHtml(inc.assignedUnit)}
          </div>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 7px;border-radius:8px;">
          <div style="font-size:8px;color:#94a3b8;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">
            Priority
          </div>
          <div style="margin-top:1px;font-weight:850;font-size:11.5px;color:${
            inc.severity === 'Critical'
              ? '#dc2626'
              : inc.severity === 'High'
                ? '#c2410c'
                : '#b45309'
          };">
            ${escapeHtml(inc.severity)}
          </div>
        </div>

        <div style="padding:6px 7px;border-radius:8px;${
          statusStyle[inc.status] || 'background:#f8fafc;color:#334155;'
        }">
          <div style="font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;opacity:0.7;">
            Status
          </div>
          <div style="margin-top:1px;font-weight:850;font-size:11.5px;text-transform:uppercase;white-space:normal;overflow-wrap:anywhere;">
            ${escapeHtml(inc.status)}
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px;">
        <button
          type="button"
          class="incident-popup-summary-btn"
          data-incident-id="${escapeHtml(inc.id)}"
          style="height:30px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;border-radius:8px;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:0.04em;cursor:pointer;"
        >
          Alert summary
        </button>

        <button
          type="button"
          class="incident-popup-action-btn"
          data-incident-id="${escapeHtml(inc.id)}"
          style="height:30px;border:1px solid #99f6e4;background:#f0fdfa;color:#0f766e;border-radius:8px;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:0.04em;cursor:pointer;"
        >
          Actions
        </button>
      </div>
    </div>
  `;
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
  const selectedIncident =
    incidents.find((incident) => incident.id === selectedId) || null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const onSelectIncidentRef = useRef(onSelectIncident);
  const lastSelectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    onSelectIncidentRef.current = onSelectIncident;
  }, [onSelectIncident]);

  useEffect(() => {
    const container = containerRef.current as
      | (HTMLDivElement & { _leaflet_id?: number })
      | null;

    if (!container || mapRef.current) return;

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const map = L.map(container, {
      center: [1.3521, 103.8198],
      zoom: 12,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.onemap.gov.sg/">OneMap</a>',
    }).addTo(map);

    const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('.incident-popup-close')) return;

    event.preventDefault();
    event.stopPropagation();

    map.closePopup();
    lastSelectedIdRef.current = null;
    onSelectIncidentRef.current(null);

    setTimeout(() => {
      map.invalidateSize();
      map.setView([1.3521, 103.8198], 12, {
        animate: true,
        duration: 0.45,
      });
    }, 0);
  };

    container.addEventListener('click', handleClick);

    mapRef.current = map;

    const resizeTimer = setTimeout(() => map.invalidateSize(), 0);

    return () => {
      clearTimeout(resizeTimer);
      container.removeEventListener('click', handleClick);
      markerRefs.current = {};
      map.remove();
      mapRef.current = null;

      if (container._leaflet_id) {
        delete container._leaflet_id;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markerRefs.current).forEach((marker) => marker.remove());
    markerRefs.current = {};

    incidents.forEach((incident) => {
      const marker = L.marker([incident.lat, incident.lng], {
        icon: createIcon(incident.severity, incident.id === selectedId),
      })
        .bindPopup(popupContent(incident), {
          className: 'echosync-incident-popup',
          closeButton: false,
          maxWidth: 340,
          minWidth: 310,
          maxHeight: 360,
          autoPan: false,
          keepInView: false,
        })
        .on('click', () => onSelectIncidentRef.current(incident.id))
        .addTo(map);

      markerRefs.current[incident.id] = marker;
    });

    if (selectedIncident) {
      const shouldMoveMap = selectedIncident.id !== lastSelectedIdRef.current;
      lastSelectedIdRef.current = selectedIncident.id;

      if (shouldMoveMap) {
        map.flyTo([selectedIncident.lat, selectedIncident.lng], 17, {
          duration: 0.45,
        });
      }

      const popupTimer = setTimeout(
        () => {
          markerRefs.current[selectedIncident.id]?.openPopup();
        },
        shouldMoveMap ? 450 : 0
      );

      return () => clearTimeout(popupTimer);
    }

   lastSelectedIdRef.current = null;
    map.closePopup();

    const resetTimer = setTimeout(() => {
      map.invalidateSize();

      map.setView([1.3521, 103.8198], 12, {
        animate: true,
        duration: 0.45,
      });
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [incidents, selectedId, selectedIncident]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <style>{`
        @keyframes marker-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }

          50% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .echosync-incident-popup .leaflet-popup-content-wrapper {
          border-radius: 18px !important;
          padding: 0 !important;
          box-shadow: 0 12px 36px rgba(15,23,42,0.20) !important;
          overflow: hidden !important;
          border: 1px solid #e2e8f0 !important;
          background: #ffffff !important;
        }

        .echosync-incident-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 330px !important;
          max-width: 330px !important;
          max-height: 360px !important;
          overflow: hidden !important;
          line-height: 1.35 !important;
          font-size: 12px !important;
        }

        .echosync-popup-scroll {
          width: 100%;
          max-height: 360px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 14px;
          background: #ffffff;
        }

        .echosync-popup-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .echosync-popup-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .echosync-popup-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .echosync-incident-popup .leaflet-popup-tip-container {
          margin-top: -1px !important;
          pointer-events: none !important;
        }

        .echosync-incident-popup .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          border: 1px solid #e2e8f0 !important;
          background: #ffffff !important;
          pointer-events: none !important;
        }

        .echosync-incident-popup .leaflet-popup-close-button {
          display: none !important;
        }

        .incident-popup-close {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 28px !important;
          height: 28px !important;
          flex-shrink: 0 !important;
          border-radius: 9999px !important;
          background: #f1f5f9 !important;
          color: #64748b !important;
          border: 0 !important;
          padding: 0 !important;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
        }

        .incident-popup-close:hover {
          color: #475569 !important;
          background: #e2e8f0 !important;
        }

        .leaflet-container {
          font-family: Inter, system-ui, -apple-system, sans-serif !important;
          background: #f8fafc !important;
        }
      `}</style>

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
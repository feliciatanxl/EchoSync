// @ts-nocheck
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SINGAPORE_BOUNDS = [
  [1.144, 103.535],
  [1.494, 104.502],
];

const ONEMAP_ATTRIBUTION =
  '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;vertical-align:middle;" alt="OneMap" />&nbsp;' +
  '<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;|&nbsp;' +
  '<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>';

const incidentIcon = L.divIcon({
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#ef4444;border:4px solid white;box-shadow:0 4px 14px rgba(239,68,68,.45);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:13px;">!</div>`,
  className: '',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const responderIcon = L.divIcon({
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#1e3a8a;border:3px solid white;box-shadow:0 4px 12px rgba(30,58,138,.35);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:10px;">YOU</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function getIncidentCoords(alert) {
  const lat = Number(
    alert.lat ?? alert.incidentLat ?? alert.latitude ?? alert.locationLat
  );
  const lng = Number(
    alert.lng ?? alert.incidentLng ?? alert.longitude ?? alert.locationLng
  );

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [lat, lng];
  }

  const text = `${alert.nodeId || ''} ${alert.location_address || ''} ${alert.location_name || ''} ${alert.location || ''}`.toLowerCase();

  if (text.includes('tam') || text.includes('tampines') || text.includes('124')) {
    return [1.34518428911075, 103.949793325094];
  }

  if (text.includes('amk') || text.includes('ang mo kio') || text.includes('302')) {
    return [1.36708983179046, 103.845660199054];
  }

  if (text.includes('jurong') || text.includes('518')) {
    return [1.34508681384068, 103.717978485296];
  }

  if (text.includes('woodlands') || text.includes('789')) {
    return [1.44337046612204, 103.802406420773];
  }

  return [1.3521, 103.8198];
}

function getResponderCoords(incidentCoords) {
  return [incidentCoords[0] + 0.0012, incidentCoords[1] - 0.0013];
}

function markEchoSyncAlertCancelled(alertId) {
  if (typeof window === 'undefined' || !alertId) return;

  try {
    const key = 'echosync-myresponder-cancelled-ids';
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');

    if (!existing.includes(alertId)) {
      window.localStorage.setItem(key, JSON.stringify([...existing, alertId]));
    }

    window.dispatchEvent(new Event('echosync-myresponder-cancelled'));
  } catch {
    // Demo should still continue even if localStorage is unavailable.
  }
}

function makeResponderReason(alert) {
  const risk = alert.riskLevel || 'High';
  const confidence = alert.confidence ? `${alert.confidence}% confidence` : 'high confidence';
  const location =
    alert.location_address ||
    alert.location_name ||
    alert.location ||
    'the registered HDB unit';

  const rawText = `${alert.eventType || ''} ${alert.title || ''} ${alert.reason || ''} ${alert.aiSummary || ''}`.toLowerCase();
  const voiceText = JSON.stringify(alert.voiceCheckIn || '').toLowerCase();
  const sensorText = JSON.stringify(alert.sensorData || '').toLowerCase();

  const points = [];

  if (rawText.includes('fall') || sensorText.includes('fall')) {
    points.push('Possible fall or medical distress was detected.');
  }

  if (
    rawText.includes('no response') ||
    rawText.includes('no-response') ||
    voiceText.includes('no response') ||
    voiceText.includes('no-response') ||
    voiceText.includes('failed')
  ) {
    points.push('The resident did not respond to the automated voice check-in.');
  }

  if (
    rawText.includes('motion') ||
    rawText.includes('movement') ||
    sensorText.includes('pir') ||
    sensorText.includes('motion')
  ) {
    points.push('Motion readings suggest the resident may be immobile.');
  }

  if (
    rawText.includes('sound') ||
    rawText.includes('impact') ||
    sensorText.includes('sound') ||
    sensorText.includes('impact')
  ) {
    points.push('Sound or impact sensors may have detected a fall-like event.');
  }

  if (!points.length) {
    points.push('SCDF operator requested a quick welfare verification.');
  }

  return `${risk} EchoSync alert at ${location} (${confidence}). ${points.join(' ')} On arrival, check whether the resident is conscious, breathing, and able to respond. Do not force entry; call 995 if there is danger or no response.`;
}


export default function ActiveResponseScreen({ alert, onCancel, onParamedicsArrived }) {
  const [seconds, setSeconds] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isEchoSync = alert.type === 'echosync_verification';
  const isCardiac = alert.type === 'cardiac_arrest';
  const incidentCoords = getIncidentCoords(alert);
  const responderCoords = getResponderCoords(incidentCoords);
  const readableReason = makeResponderReason(alert);

  const handleCancel = async () => {
    if (isEchoSync) {
      markEchoSyncAlertCancelled(alert.id);
      sessionStorage.removeItem('echosync-myresponder-active-alert');
      toast.info('Response cancelled');
      onCancel();
      return;
    }

    await base44.entities.EmergencyAlert.update(alert.id, { status: 'cancelled' });
    toast.info('Response cancelled');
    onCancel();
  };

  const handleParamedics = async () => {
  if (isEchoSync) {
    const alertId = alert.id || `MYR-${Date.now()}`;
    const completedIds =
      (window as any).__echosyncMyResponderCompletedIds || [];

    if (!completedIds.includes(alertId)) {
      (window as any).__echosyncMyResponderCompletedIds = [
        ...completedIds,
        alertId,
      ];

      (window as any).__echosyncMyResponderCompletedCount =
        ((window as any).__echosyncMyResponderCompletedCount || 0) + 1;
    }

    window.dispatchEvent(new Event("echosync-myresponder-completed"));

    try {
      await fetch("/api/sensor-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `MYR-COMPLETE-${alertId}-${Date.now()}`,
          nodeId: alert.nodeId || alert.id || "MYRESPONDER",
          resident: alert.resident || "Mdm Tan Siew Lan",
          location:
            alert.location_address ||
            alert.location_name ||
            alert.location ||
            "Blk 124 Tampines Street 11, #04-12",
          eventType: "myResponder Verification Completed",
          riskLevel: alert.riskLevel || "Critical",
          confidence: alert.confidence || 91,
          reason:
            "myResponder responder completed the EchoSync verification task. Update sent back to SCDF Ops Log.",
          sensorData: {
            myResponderStatus: "completed",
            responderType: "Community First Responder",
            originalAlertId: alertId,
          },
          voiceCheckIn: {
            result: "myResponder verification completed",
          },
          aiSummary:
            "myResponder responder completed verification and provided an update for SCDF operator / caregiver review.",
          source: "myResponder",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Demo still continues even if dashboard API is not reachable.
    }

    toast.success("Verification completed. SCDF Ops Log updated.");
    onParamedicsArrived();
    return;
  }

  await base44.entities.EmergencyAlert.update(alert.id, {
    status: "resolved",
  });

  toast.success("Great work! Paramedics notified.");
  onParamedicsArrived();
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ maxWidth: 430, margin: '0 auto' }}
    >
      {/* Red ticker */}
      <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
        <span className="text-white font-black text-lg">{mins}</span>
        <span className="text-white/70 text-sm">min</span>
        <span className="text-white font-black text-lg">{String(secs).padStart(2, '0')}</span>
        <span className="text-white/70 text-sm">sec</span>
        <span className="text-white/70 text-sm ml-1">since emergency happened</span>
      </div>

      {/* OneMap area */}
      <div className="flex-1 relative bg-[#e8eff8] overflow-hidden">
        <MapContainer
          center={incidentCoords}
          zoom={16}
          minZoom={11}
          maxZoom={19}
          maxBounds={SINGAPORE_BOUNDS}
          maxBoundsViscosity={1}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution={ONEMAP_ATTRIBUTION}
            detectRetina
            minZoom={11}
            maxZoom={19}
            url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={[responderCoords, incidentCoords]}
            pathOptions={{
              color: '#1e3a8a',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.85,
            }}
          />

          <Marker position={responderCoords} icon={responderIcon}>
            <Popup>You are here</Popup>
          </Marker>

          <Marker position={incidentCoords} icon={incidentIcon}>
            <Popup>
              <div className="text-xs font-semibold">
                {alert.location_address || alert.location || 'Incident location'}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#1e3a8a] shadow-md border border-blue-100">
          YOU → INCIDENT
        </div>

        <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
          <span className="text-sm">🧭</span>
        </div>
      </div>

      {/* Bottom card */}
      <div className="bg-white px-5 pt-5 pb-24 shadow-2xl rounded-t-3xl -mt-20 min-h-[420px] relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{isEchoSync ? '🏠' : isCardiac ? '💗' : '🔥'}</span>
            <span className="font-black text-lg text-[#1e3a8a]">
              {isEchoSync ? 'EchoSync Verification' : isCardiac ? 'Cardiac arrest' : 'Fire'}
            </span>
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
            {collapsed ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        {!collapsed && (
          <>
            <div className="flex items-start gap-2 mb-4 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold">{alert.location_name || alert.location || 'Registered HDB unit'}</div>
                <div className="text-xs text-gray-500">
                  {alert.location_address || alert.location || 'Blk 302 Ang Mo Kio Ave 3, #08-112'}
                </div>
                {isEchoSync && (
                  <div className="mt-3 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-gray-700 space-y-1">
                    <p>
                      <span className="font-bold text-[#1e3a8a]">Risk:</span>{" "}
                      {alert.riskLevel || "Medium"} · {alert.confidence || 72}% confidence
                    </p>
                    <p>
                      <span className="font-bold text-[#1e3a8a]">What to expect:</span>{" "}
                      {readableReason}
                    </p>
                    <p>
                      <span className="font-bold text-[#1e3a8a]">Task:</span>{" "}
                      Verify resident safety and provide update to caregiver/operator.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <button className="flex-1 bg-gray-100 text-gray-800 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5">
                🪪 Show ID
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5">
                📖 Guides
              </button>
              <a
                href="tel:995"
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> 995
              </a>
            </div>

            <button className="w-full bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 mb-3">
              💬 Message
              <div className="flex items-center gap-1">
                <span className="text-lg">🇸🇬</span>
                <span className="bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
              </div>
            </button>

            <button
              onClick={handleCancel}
              className="w-full border-2 border-red-500 text-red-500 font-bold py-3 rounded-xl text-sm mb-3"
            >
              Cancel response
            </button>

            <button
              onClick={handleParamedics}
              className="w-full bg-[#1e3a8a] text-white font-bold py-3.5 rounded-2xl text-sm"
            >
              {isEchoSync ? 'Complete verification' : 'Tap when paramedics arrive'}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

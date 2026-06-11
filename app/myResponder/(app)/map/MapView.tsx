'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Incident } from '@/app/myResponder/data/mockIncidents';

interface MapViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

const cardiacIcon = divIcon({
  className: '',
  html: `<div style="
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1565C0;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  ">💙</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const fireIcon = divIcon({
  className: '',
  html: `<div style="
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #E53935;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  ">🔥</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function MapView({ incidents, onSelectIncident }: MapViewProps) {
  return (
    <MapContainer
      center={[1.3521, 103.8198]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((inc) => (
        <Marker
          key={inc.id}
          position={[inc.lat, inc.lng]}
          icon={inc.type === 'cardiac' ? cardiacIcon : fireIcon}
          eventHandlers={{
            click: () => onSelectIncident(inc),
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              <strong>{inc.type === 'cardiac' ? '💙 Cardiac' : '🔥 Fire'}</strong>
              <br />
              {inc.address}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

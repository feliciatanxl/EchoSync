'use client';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Incident } from '@/app/myResponder/data/mockIncidents';

interface MapViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

const makeIncidentIcon = (type: Incident['type']) =>
  divIcon({
    className: 'mr-incident-marker',
    html:
      type === 'cardiac'
        ? `<div class="mr-marker-shell mr-marker-cardiac"><svg viewBox="0 0 24 24" width="17" height="17" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg></div>`
        : `<div class="mr-marker-shell mr-marker-fire"><svg viewBox="0 0 24 24" width="17" height="17" fill="white"><path d="M12 23c-3.87 0-7-3.13-7-7 0-2.38 1.19-4.47 3-5.74V4a1 1 0 011.5-.87l.5.29V2a1 1 0 012 0v1.42l.5-.29A1 1 0 0114 4v6.26c1.81 1.27 3 3.36 3 5.74 0 3.87-3.13 7-7 7z"/></svg></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

const cardiacIcon = makeIncidentIcon('cardiac');
const fireIcon = makeIncidentIcon('fire');

export default function MapView({ incidents, onSelectIncident }: MapViewProps) {
  return (
    <MapContainer
      center={[1.3521, 103.8198]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={incident.type === 'cardiac' ? cardiacIcon : fireIcon}
          eventHandlers={{ click: () => onSelectIncident(incident) }}
        />
      ))}
    </MapContainer>
  );
}

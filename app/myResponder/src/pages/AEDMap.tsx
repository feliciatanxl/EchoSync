// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MOCK_AEDS } from '@/lib/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SINGAPORE_BOUNDS = [
  [1.144, 103.535],
  [1.494, 104.502],
];

const ONEMAP_ATTRIBUTION =
  '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;vertical-align:middle;" alt="OneMap" />&nbsp;' +
  '<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;|&nbsp;' +
  '<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>';

const aedIcon = L.divIcon({
  html: `<div style="background:#1e3a8a;color:white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg)">AED</span></div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

export default function AEDMap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef2f8] flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 z-10">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">View AEDs</h1>
      </div>

      <div className="flex-1 relative">
        {/* Search bar */}
        <div className="absolute top-3 left-3 right-3 z-[1000]">
          <div className="bg-white rounded-xl shadow-md flex items-center gap-2 px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              placeholder="Search for AEDs"
            />
          </div>
        </div>

        <MapContainer
          center={[1.368, 103.849]}
          zoom={15}
          minZoom={11}
          maxZoom={19}
          maxBounds={SINGAPORE_BOUNDS}
          maxBoundsViscosity={1}
          style={{ height: 'calc(100vh - 130px)', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution={ONEMAP_ATTRIBUTION}
            detectRetina
            minZoom={11}
            maxZoom={19}
            url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
          />
          {MOCK_AEDS.map((aed) => (
            <Marker key={aed.id} position={[aed.lat, aed.lng]} icon={aedIcon}>
              <Popup>
                <div className="text-sm font-bold text-[#1e3a8a]">{aed.name}</div>
                <div className="text-xs text-gray-500">{aed.count} AED{aed.count > 1 ? 's' : ''} available</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
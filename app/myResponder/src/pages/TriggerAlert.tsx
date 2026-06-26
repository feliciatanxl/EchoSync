// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const PRESETS = [
  {
    label: 'Cardiac Arrest – Bus Stop',
    type: 'cardiac_arrest',
    description: 'Unconscious man at bus stop',
    location_name: 'Bus stop: Aft Ang Mo Kio Fire Stn (55211)',
    location_address: 'Ang Mo Kio Street 62',
    lat: 1.3697, lng: 103.8497,
    walk_minutes: 4, drive_minutes: 2, cycle_minutes: 2,
    distance_m: 250, responders_count: 3,
  },
  {
    label: 'Cardiac Arrest – MRT Station',
    type: 'cardiac_arrest',
    description: 'Person collapsed at platform',
    location_name: 'Ang Mo Kio MRT Station',
    location_address: 'Ang Mo Kio Avenue 8',
    lat: 1.3699, lng: 103.8493,
    walk_minutes: 6, drive_minutes: 3, cycle_minutes: 3,
    distance_m: 420, responders_count: 1,
  },
  {
    label: 'Fire – HDB Block',
    type: 'fire',
    description: 'Smoke detected in kitchen',
    location_name: 'Block 327 Ang Mo Kio Ave 3',
    location_address: 'Ang Mo Kio Avenue 3',
    lat: 1.3710, lng: 103.8480,
    walk_minutes: 3, drive_minutes: 1, cycle_minutes: 2,
    distance_m: 180, responders_count: 0,
  },
];

export default function TriggerAlert() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const trigger = async (preset) => {
    setLoading(true);
    await base44.entities.EmergencyAlert.create({ ...preset, status: 'pending' });
    setLoading(false);
    toast.success('🚨 Alert triggered! Go to Home to respond.');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">Trigger Emergency Alert</h1>
        <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full">DEMO</span>
      </div>

      <div className="px-4 py-5">
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-5">
          <p className="text-sm text-amber-800 font-medium">
            🔧 This is a backend trigger for demo purposes. Triggering an alert will send a push notification to all app users with alerts enabled — simulating the SCDF Ops Centre dispatch.
          </p>
        </div>

        <h2 className="font-bold text-gray-900 mb-3">Select an emergency scenario</h2>
        <div className="space-y-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => trigger(preset)}
              disabled={loading}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left flex items-center gap-4 border-2 border-transparent hover:border-[#1e3a8a] transition-all disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl flex-shrink-0">
                {preset.type === 'cardiac_arrest' ? '💗' : '🔥'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">{preset.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{preset.description}</div>
                <div className="text-xs text-gray-400 mt-0.5">📍 {preset.location_name}</div>
              </div>
              <Zap className="w-5 h-5 text-[#1e3a8a] flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
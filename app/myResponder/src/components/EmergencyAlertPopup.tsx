// @ts-nocheck
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';

export default function EmergencyAlertPopup({ alert, onAccept, onDecline }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isCardiac = alert.type === 'cardiac_arrest';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ maxWidth: 430, margin: '0 auto' }}
      >
        {/* Red header ticker */}
        <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
          <span className="text-white font-black text-lg">{mins}</span>
          <span className="text-white/70 text-sm">min</span>
          <span className="text-white font-black text-lg">{String(secs).padStart(2, '0')}</span>
          <span className="text-white/70 text-sm">sec</span>
          <span className="text-white/70 text-sm ml-1">since emergency happened</span>
        </div>

        {/* Transport tabs */}
        <div className="bg-white flex gap-2 px-3 py-2 border-b border-gray-100 shadow-sm">
          <div className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
            🚶 {alert.walk_minutes} min
          </div>
          <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
            🚗 {alert.drive_minutes} min
          </div>
          <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
            🚲 {alert.cycle_minutes} min
          </div>
        </div>

        {/* Map placeholder */}
        <div className="flex-1 relative bg-[#e8eff8] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=60"
            alt="map"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-200/50 absolute -inset-4 animate-ping" />
              <div className="w-14 h-14 rounded-full bg-blue-300/40 absolute -inset-1" />
              <div className="w-12 h-12 rounded-full bg-[#1e3a8a]/20 flex items-center justify-center z-10 relative border-2 border-[#1e3a8a]/40">
                <span className="text-2xl">{isCardiac ? '💗' : '🔥'}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-6 left-6 flex flex-col items-center gap-1">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-red-500">
              <span className="text-xs font-black text-red-600">AED</span>
            </div>
          </div>
          {['👨', '👩', '🧑'].map((emoji, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center gap-0.5"
              style={{ bottom: `${30 + i * 18}%`, left: `${15 + i * 12}%` }}
            >
              <div className="bg-[#1e3a8a] rounded-full w-9 h-9 flex items-center justify-center shadow border-2 border-white text-lg">
                {emoji}
              </div>
              <span className="text-[9px] font-black text-[#1e3a8a] bg-white px-1 rounded">CFR</span>
            </div>
          ))}
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm">🧭</span>
          </div>
        </div>

        {/* Bottom card */}
        <div className="bg-white px-5 pt-5 pb-6 shadow-2xl rounded-t-3xl -mt-4 relative z-10">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-xl">{isCardiac ? '💗' : '🔥'}</span>
            <div>
              <h2 className="font-black text-lg text-[#1e3a8a]">
                {isCardiac ? 'Cardiac arrest' : 'Fire'}
              </h2>
              <p className="text-sm text-gray-600">{alert.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>🚶</span>
            <span className="font-semibold">{alert.walk_minutes} min • {alert.distance_m}m</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-800 mb-2">
            <MapPin className="w-4 h-4 text-[#1e3a8a] flex-shrink-0" />
            <div>
              <div className="font-bold">{alert.location_name}</div>
              <div className="text-xs text-gray-500">{alert.location_address}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <Users className="w-4 h-4" />
            <span>{alert.responders_count} responders on the way</span>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onDecline}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-2xl font-bold">✕</span>
            </button>
            <button
              onClick={onAccept}
              className="w-16 h-16 rounded-full bg-[#1e3a8a] flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-2xl font-bold">✓</span>
            </button>
          </div>
          <div className="flex justify-center gap-16 mt-1 text-xs text-gray-500">
            <span>Decline</span>
            <span>Accept</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
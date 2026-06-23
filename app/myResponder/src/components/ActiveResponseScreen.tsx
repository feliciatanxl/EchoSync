// @ts-nocheck
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

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

  const handleCancel = async () => {
    await base44.entities.EmergencyAlert.update(alert.id, { status: 'cancelled' });
    toast.info('Response cancelled');
    onCancel();
  };

  const handleParamedics = async () => {
    await base44.entities.EmergencyAlert.update(alert.id, { status: 'resolved' });
    toast.success('Great work! Paramedics notified.');
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

      {/* Map area */}
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute">
            <line x1="60" y1="80" x2="150" y2="150" stroke="#1e3a8a" strokeWidth="2" strokeDasharray="6,4" />
          </svg>
        </div>
        <div className="absolute" style={{ bottom: '35%', left: '28%' }}>
          <div className="bg-[#1e3a8a] rounded-full w-10 h-10 flex items-center justify-center shadow border-2 border-white text-xl">
            🧑
          </div>
          <span className="text-[9px] font-black text-[#1e3a8a] bg-white px-1 rounded block text-center mt-0.5">YOU</span>
        </div>
        {['👨', '👩'].map((emoji, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center gap-0.5"
            style={{ bottom: `${30 + i * 20}%`, left: `${12 + i * 15}%` }}
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
                      <span className="font-bold text-[#1e3a8a]">Reason:</span>{" "}
                      {alert.reason || "Resident said they are okay after voice check-in"}
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

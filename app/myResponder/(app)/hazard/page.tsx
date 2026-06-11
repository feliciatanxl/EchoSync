'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Camera, CheckCircle2, Flame, Loader2, MapPin } from 'lucide-react';

type RoutineState = 'idle' | 'loading' | 'ready';

export default function HazardPage() {
  const [routine, setRoutine] = useState<RoutineState>('idle');

  useEffect(() => {
    if (routine !== 'loading') {
      return;
    }

    const timer = window.setTimeout(() => setRoutine('ready'), 1400);
    return () => window.clearTimeout(timer);
  }, [routine]);

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header shrink-0">
        <div>
          <h1 className="text-[20px] font-black tracking-[-0.02em] text-[#003B73]">Fire Hazard</h1>
          <p className="text-[12px] font-semibold text-slate-400">Report community risks</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF3E0] text-[#FF9800]">
          <Flame size={22} fill="currentColor" />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
        <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FF9800] to-[#E65100] p-5 text-white shadow-md">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white/18 shadow-inner">
            <AlertTriangle size={54} strokeWidth={2.2} />
          </div>
          <h2 className="mt-4 text-center text-[24px] font-black leading-tight">Spot a fire hazard?</h2>
          <p className="mx-auto mt-2 max-w-[290px] text-center text-[14px] font-semibold leading-relaxed text-white/82">
            Help keep your neighbourhood safe by reporting hazards before they become emergencies.
          </p>
        </section>

        <section className="mt-4 space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
            <h3 className="text-[16px] font-black text-slate-950">Community safety starts with you</h3>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-slate-600">
              Keep an eye out for things that could endanger lives, such as obstructed fire hose reels, blocked exit staircases,
              damaged emergency lights, and combustible items left at common corridors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
              <Camera className="mb-3 text-[#003B73]" size={24} />
              <p className="text-[14px] font-black text-slate-950">Photo evidence</p>
              <p className="mt-1 text-[12px] font-medium leading-snug text-slate-500">Attach a clear image of the hazard.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
              <MapPin className="mb-3 text-[#43A047]" size={24} />
              <p className="text-[14px] font-black text-slate-950">Auto location</p>
              <p className="mt-1 text-[12px] font-medium leading-snug text-slate-500">Use device location for faster triage.</p>
            </div>
          </div>

          {routine !== 'idle' ? (
            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-xs">
              {routine === 'loading' ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#FF9800]" size={24} />
                  <div>
                    <p className="text-[14px] font-black text-slate-950">Preparing report</p>
                    <p className="text-[12px] font-semibold text-slate-500">Opening camera and acquiring geolocation...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#43A047]" size={25} />
                  <div>
                    <p className="text-[14px] font-black text-slate-950">Device ready</p>
                    <p className="text-[12px] font-semibold text-slate-500">Mock camera and geolocation routine initialized.</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>
      </main>

      <footer className="shrink-0 border-t border-slate-100 bg-white/95 p-4">
        <button
          type="button"
          className="mr-btn mr-btn-primary"
          onClick={() => setRoutine('loading')}
          disabled={routine === 'loading'}
          style={{ background: '#E53935' }}
        >
          {routine === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
          Report fire hazard
        </button>
      </footer>
    </div>
  );
}

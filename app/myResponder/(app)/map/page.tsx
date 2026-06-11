'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ArrowLeft, Flame, Heart, MapPin, X, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockIncidents, type Incident } from '@/app/myResponder/data/mockIncidents';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Incident | null>(null);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-slate-100">
      <header className="absolute left-3 right-3 top-3 z-[500] flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-700 shadow-md"
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-md">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F0FE] px-2 py-1 text-[11px] font-black text-[#1565C0]">
            <Heart size={12} fill="currentColor" /> Cardiac
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEBEE] px-2 py-1 text-[11px] font-black text-[#E53935]">
            <Flame size={12} fill="currentColor" /> Fire
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <MapView incidents={mockIncidents} onSelectIncident={setSelected} />
      </div>

      {selected ? (
        <>
          <button
            type="button"
            aria-label="Close incident details"
            className="absolute inset-0 z-[600] bg-black/20"
            onClick={() => setSelected(null)}
          />
          <section className="absolute inset-x-0 bottom-0 z-[700] rounded-t-[28px] bg-white p-5 shadow-[0_-18px_42px_rgba(15,23,42,0.22)]">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            {selected.isEchoSyncAlert ? (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-[0_0_26px_rgba(251,191,36,0.45)]">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#003B73] px-3 py-1.5 text-[12px] font-black text-white">
                  <Zap size={14} fill="#FFD700" color="#FFD700" />
                  EchoSync AI Verified
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500"
              aria-label="Dismiss details"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3 pr-9">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${
                  selected.type === 'cardiac' ? 'bg-[#1565C0]' : 'bg-[#E53935]'
                }`}
              >
                {selected.type === 'cardiac' ? <Heart size={24} fill="currentColor" /> : <Flame size={24} fill="currentColor" />}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                  {selected.type === 'cardiac' ? 'Cardiac arrest alert' : 'Fire alert'}
                </p>
                <h1 className="mt-1 text-[18px] font-black leading-tight text-slate-950">{selected.address}</h1>
                {selected.preArrivalIntel ? (
                  <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-[12px] font-semibold leading-relaxed text-amber-900">
                    {selected.preArrivalIntel}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Postal code</p>
                <p className="mt-1 text-[15px] font-black text-slate-900">{selected.postalCode}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Status</p>
                <p className={`mt-1 text-[15px] font-black ${selected.status === 'active' ? 'text-[#E53935]' : 'text-slate-500'}`}>
                  {selected.status === 'active' ? 'Active now' : 'Resolved'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-[13px] font-semibold text-slate-600">
              <MapPin size={17} className="shrink-0 text-[#003B73]" />
              <span>{selected.timestamp}</span>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

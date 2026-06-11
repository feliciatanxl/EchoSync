'use client';

import { useMemo, useState } from 'react';
import { HeartPulse, MapPin, Search } from 'lucide-react';
import { mockAEDs } from '@/app/myResponder/data/mockAEDs';

export default function FindAEDsPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return mockAEDs.slice(0, 8);
    }

    return mockAEDs.filter((aed) => `${aed.name} ${aed.address}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [query]);

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header">
        <h1 className="mr-header-title">Find AEDs</h1>
      </header>
      <section className="shrink-0 px-4 pt-4">
        <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xs">
          <Search size={19} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for AEDs"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:text-slate-400"
          />
        </label>
      </section>

      <section className="mx-4 mt-4 h-[250px] shrink-0 overflow-hidden rounded-[26px] border border-slate-100 bg-[#DDEAD8] shadow-xs">
        <div className="relative h-full w-full bg-[linear-gradient(135deg,#d9ead3_0%,#d9ead3_45%,#cfe3ef_45%,#cfe3ef_55%,#d9ead3_55%)]">
          <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-white/45" />
          <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-white/45" />
          {mockAEDs.slice(0, 12).map((aed, index) => (
            <button
              type="button"
              key={aed.id}
              className="absolute grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#43A047] text-white shadow-md"
              style={{
                left: `${12 + ((index * 23) % 72)}%`,
                top: `${14 + ((index * 31) % 68)}%`,
              }}
              title={aed.name}
            >
              <HeartPulse size={16} fill="currentColor" />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 px-4 py-4">
        {filtered.map((aed) => (
          <div key={aed.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-xs">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-50 text-[#43A047]">
              <HeartPulse size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-black text-slate-950">{aed.name}</span>
              <span className="mt-1 flex items-start gap-1 text-[12px] font-semibold leading-snug text-slate-500">
                <MapPin size={13} className="mt-0.5 shrink-0" />
                {aed.floor ? `${aed.floor} • ` : ''}{aed.address}
              </span>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

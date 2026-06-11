'use client';

import Toggle from '@/app/myResponder/components/Toggle';
import { useApp } from '@/app/myResponder/context/AppContext';

export default function SettingsPage() {
  const { state, updatePreferences } = useApp();

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header">
        <h1 className="mr-header-title">Settings</h1>
      </header>
      <section className="mr-page-content space-y-5">
        <div>
          <h2 className="mr-section-header !px-0 !pt-0">ALERT SETTINGS</h2>
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <p className="mb-3 text-[15px] font-black text-slate-950">Bypass silent mode</p>
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((value) => (
                <label key={String(value)} className={`flex items-center gap-2 rounded-xl border-2 p-3 ${state.preferences.bypassSilent === value ? 'border-[#003B73] bg-[#E8F0FE]' : 'border-slate-100'}`}>
                  <input type="radio" checked={state.preferences.bypassSilent === value} onChange={() => updatePreferences({ bypassSilent: value })} />
                  <span className="font-bold">{value ? 'Yes' : 'No'}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100">
              <Toggle checked={state.preferences.cardiacAlert} onChange={(checked) => updatePreferences({ cardiacAlert: checked })} label="Cardiac arrest alerts" />
              <div className="border-t border-slate-100" />
              <Toggle checked={state.preferences.fireAlert} onChange={(checked) => updatePreferences({ fireAlert: checked })} label="Fire alerts" description="For minor fire in rubbish bins or chutes only" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mr-section-header !px-0 !pt-0">PREFERRED MODE OF TRANSPORT</h2>
          <div className="space-y-3">
            {[
              ['walk', 'Walk', '400m alert radius'],
              ['cycle', 'Cycle', '800m alert radius'],
              ['vehicle', 'Vehicle', '1500m alert radius'],
            ].map(([mode, label, radius]) => (
              <label key={mode} className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-4 shadow-xs ${state.preferences.transportMode === mode ? 'border-[#003B73]' : 'border-slate-100'}`}>
                <input type="checkbox" checked={state.preferences.transportMode === mode} onChange={() => updatePreferences({ transportMode: mode as 'walk' | 'cycle' | 'vehicle' })} />
                <span>
                  <span className="block text-[15px] font-black text-slate-950">{label}</span>
                  <span className="text-[12px] font-semibold text-slate-400">{radius}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

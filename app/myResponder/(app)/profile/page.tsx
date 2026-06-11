'use client';

import { useState } from 'react';
import { Award, Check, Edit3, ShieldCheck, X } from 'lucide-react';
import { useApp } from '@/app/myResponder/context/AppContext';

const avatars = ['SC', 'DF', 'CPR', 'AED', 'FR', 'MED', 'FIR', 'RES', 'HDB', '911', '995', 'VOL', 'SG', 'LIF', 'EMS'];

export default function ProfilePage() {
  const { state, updateUser } = useApp();
  const [tab, setTab] = useState<'cfr' | 'account'>('cfr');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [displayName, setDisplayName] = useState(state.user.displayName);
  const [email, setEmail] = useState(state.user.email);

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header">
        <h1 className="mr-header-title">Profile</h1>
      </header>
      <div className="mx-4 mt-4 grid grid-cols-2 rounded-2xl bg-white p-1 shadow-xs">
        <button type="button" onClick={() => setTab('cfr')} className={`rounded-xl py-3 text-[14px] font-black ${tab === 'cfr' ? 'bg-[#003B73] text-white' : 'text-slate-500'}`}>My CFR ID!</button>
        <button type="button" onClick={() => setTab('account')} className={`rounded-xl py-3 text-[14px] font-black ${tab === 'account' ? 'bg-[#003B73] text-white' : 'text-slate-500'}`}>My Account</button>
      </div>

      {tab === 'cfr' ? (
        <section className="mr-page-content">
          <div className="overflow-hidden rounded-[28px] bg-[#003B73] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">SCDF</p>
                <h2 className="mt-1 text-[18px] font-black">Community First Responder</h2>
              </div>
              <ShieldCheck color="#FFD700" size={35} />
            </div>
            <div className="my-6 flex justify-center">
              <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white/35 bg-white/15 text-[26px] font-black">
                {avatars[state.user.avatar] ?? avatars[0]}
              </div>
            </div>
            <p className="text-center text-[18px] font-black tracking-wide">{state.user.name || 'TAN XIU LI, FELICIA'}</p>
            <p className="mt-1 text-center text-[12px] font-semibold text-white/65">CFR-2026-268969</p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-center text-[12px] font-semibold leading-relaxed text-white/80">
              Please cooperate with our volunteer Community First Responder who is here to help.
            </div>
          </div>
        </section>
      ) : (
        <section className="mr-page-content">
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <div className="mb-5 flex items-center gap-4">
              <button type="button" onClick={() => setAvatarOpen(true)} className="relative grid h-20 w-20 place-items-center rounded-full border-4 border-[#003B73] bg-[#E8F0FE] text-[22px] font-black text-[#003B73]">
                {avatars[state.user.avatar] ?? avatars[0]}
                <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[#003B73] text-white"><Edit3 size={15} /></span>
              </button>
              <div>
                <p className="text-[17px] font-black text-slate-950">{state.user.name}</p>
                <p className="text-[12px] font-semibold text-slate-400">Verified account</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mr-input-label">Display Name</span>
                <input className="mr-input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
              </label>
              <label className="block">
                <span className="mr-input-label">Email</span>
                <input className="mr-input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" />
              </label>
              {[
                ['Name', state.user.name],
                ['NRIC', state.user.nric || 'S1234567A'],
                ['Mobile', state.user.phone || '+6581234567'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="mr-input-label">{label}</p>
                  <p className="rounded-lg bg-slate-50 px-4 py-3 text-[15px] font-bold text-slate-600">{value}</p>
                </div>
              ))}
            </div>
            <button className="mr-btn mr-btn-primary mt-5" type="button" onClick={() => updateUser({ displayName, email })}>
              Save Changes
            </button>
          </div>
        </section>
      )}

      {avatarOpen ? (
        <div className="mr-modal-backdrop">
          <div className="w-full max-w-[340px] rounded-3xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-black text-slate-950">Choose Avatar</h2>
              <button type="button" onClick={() => setAvatarOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {avatars.map((avatar, index) => (
                <button
                  type="button"
                  key={avatar}
                  onClick={() => updateUser({ avatar: index })}
                  className={`relative aspect-square rounded-full border-4 bg-[#E8F0FE] text-[13px] font-black text-[#003B73] ${state.user.avatar === index ? 'border-[#003B73]' : 'border-transparent'}`}
                >
                  {avatar}
                  {state.user.avatar === index ? <Check className="absolute -right-1 -top-1 rounded-full bg-[#003B73] p-0.5 text-white" size={20} /> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

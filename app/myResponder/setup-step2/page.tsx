'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';

const avatars = ['SC', 'DF', 'CPR', 'AED', 'FR', 'MED', 'FIR', 'RES', 'HDB', '911', '995', 'VOL', 'SG', 'LIF', 'EMS'];

export default function SetupStep2Page() {
  const router = useRouter();
  const { state, updateUser, updateOnboarding } = useApp();
  const [selected, setSelected] = useState(state.user.avatar);

  return (
    <main className="mr-page-onboarding bg-[#F4F6F9]">
      <header className="mr-header">
        <div>
          <h1 className="mr-header-title">Choose avatar</h1>
          <p className="text-[12px] font-semibold text-slate-400">Step 2 of 4</p>
        </div>
      </header>
      <StepIndicator currentStep={2} />
      <section className="mr-page-content">
        <div className="mx-auto mb-5 grid h-28 w-28 place-items-center rounded-full border-4 border-[#003B73] bg-[#E8F0FE] text-[25px] font-black text-[#003B73] shadow-md">
          {avatars[selected] ?? avatars[0]}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {avatars.map((avatar, index) => (
            <button
              type="button"
              key={avatar}
              onClick={() => setSelected(index)}
              className={`aspect-square rounded-full border-4 bg-white text-[14px] font-black shadow-xs ${selected === index ? 'border-[#003B73] ring-4 ring-blue-100' : 'border-transparent'}`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </section>
      <footer className="shrink-0 border-t border-slate-100 bg-white p-4">
        <button
          className="mr-btn mr-btn-primary"
          type="button"
          onClick={() => {
            updateUser({ avatar: selected });
            updateOnboarding({ currentStep: 7 });
            router.push('/myResponder/setup-step3');
          }}
        >
          Next
        </button>
      </footer>
    </main>
  );
}

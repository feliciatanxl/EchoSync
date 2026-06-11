'use client';

import { useRouter } from 'next/navigation';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import Toggle from '@/app/myResponder/components/Toggle';
import { useApp } from '@/app/myResponder/context/AppContext';

export default function SetupStep4Page() {
  const router = useRouter();
  const { state, updatePreferences, updateOnboarding } = useApp();

  return (
    <main className="mr-page-onboarding bg-[#F4F6F9]">
      <header className="mr-header">
        <div>
          <h1 className="mr-header-title">Alert preferences</h1>
          <p className="text-[12px] font-semibold text-slate-400">Step 4 of 4</p>
        </div>
      </header>
      <StepIndicator currentStep={4} />
      <section className="mr-page-content">
        <div className="rounded-2xl bg-white p-4 shadow-xs">
          <h2 className="mb-2 text-[17px] font-black text-slate-950">I want to be alerted for</h2>
          <Toggle
            checked={state.preferences.cardiacAlert}
            onChange={(checked) => updatePreferences({ cardiacAlert: checked })}
            label="Cardiac arrest cases"
          />
          <div className="border-t border-slate-100" />
          <Toggle
            checked={state.preferences.fireAlert}
            onChange={(checked) => updatePreferences({ fireAlert: checked })}
            label="Fire cases"
            description="For minor fire in rubbish bins or chutes only"
          />
        </div>
      </section>
      <footer className="shrink-0 border-t border-slate-100 bg-white p-4">
        <button
          className="mr-btn mr-btn-primary"
          type="button"
          onClick={() => {
            updateOnboarding({ currentStep: 9 });
            router.push('/myResponder/success');
          }}
        >
          Finish setup
        </button>
      </footer>
    </main>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation } from 'lucide-react';
import Modal from '@/app/myResponder/components/Modal';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';

const signupSources = ['Public Exhibition', 'SCDF Website/Social Media', 'Word of Mouth', 'School', 'Work', 'Others'];

export default function SetupStep1Page() {
  const router = useRouter();
  const { state, updateUser, updatePreferences, updateOnboarding } = useApp();
  const [name, setName] = useState(state.user.name);
  const [displayName, setDisplayName] = useState(state.user.displayName);
  const [email, setEmail] = useState(state.user.email);
  const [signedUpFrom, setSignedUpFrom] = useState(state.user.signedUpFrom || signupSources[0]);
  const [modal, setModal] = useState<'location' | 'background' | null>(null);

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUser({ name, displayName, email, signedUpFrom });
    updateOnboarding({ currentStep: 6 });
    setModal('location');
  };

  return (
    <main className="mr-page-onboarding bg-[#F4F6F9]">
      <header className="mr-header">
        <div>
          <h1 className="mr-header-title">Set up profile</h1>
          <p className="text-[12px] font-semibold text-slate-400">Step 1 of 4</p>
        </div>
      </header>
      <StepIndicator currentStep={1} />
      <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleNext}>
        <section className="mr-page-content">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-xs">
              <p className="mr-input-label">NRIC/FIN</p>
              <p className="text-[15px] font-black text-slate-900">{state.user.nric || 'S1234567A'}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-xs">
              <p className="mr-input-label">Mobile</p>
              <p className="text-[15px] font-black text-slate-900">{state.user.phone || '+6581234567'}</p>
            </div>
          </div>

          <div className="mt-4 space-y-4 rounded-2xl bg-white p-4 shadow-xs">
            <div className="mr-input-group">
              <label className="mr-input-label" htmlFor="name">Full Name</label>
              <input id="name" className="mr-input" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="mr-input-group">
              <label className="mr-input-label" htmlFor="displayName">Display Name</label>
              <input id="displayName" className="mr-input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </div>
            <div className="mr-input-group">
              <label className="mr-input-label" htmlFor="email">Email</label>
              <input id="email" className="mr-input" type="email" value={email} placeholder="you@example.com" onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mr-input-group">
              <label className="mr-input-label" htmlFor="source">Signed up from</label>
              <select id="source" className="mr-select" value={signedUpFrom} onChange={(event) => setSignedUpFrom(event.target.value)}>
                {signupSources.map((source) => <option key={source}>{source}</option>)}
              </select>
            </div>
          </div>
        </section>
        <footer className="shrink-0 border-t border-slate-100 bg-white p-4">
          <button className="mr-btn mr-btn-primary" type="submit">Next</button>
        </footer>
      </form>

      <Modal
        open={modal === 'location'}
        title="Location Access Permission"
        primaryLabel="Accept"
        secondaryLabel="Deny"
        onPrimary={() => {
          updatePreferences({ locationAccess: true });
          setModal('background');
        }}
        onSecondary={() => setModal('background')}
      >
        <MapPin className="mx-auto mb-3 text-[#003B73]" size={34} />
        Allow myResponder to access your location so nearby emergency alerts can reach you.
      </Modal>
      <Modal
        open={modal === 'background'}
        title="Background Location Access"
        primaryLabel="Dismiss"
        secondaryLabel="Back"
        onPrimary={() => router.push('/myResponder/setup-step2')}
        onSecondary={() => setModal('location')}
      >
        <Navigation className="mx-auto mb-3 text-[#003B73]" size={34} />
        Keep location access enabled in the background to receive alerts when the app is not open.
      </Modal>
    </main>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from './context/AppContext';

export default function MyResponderRoot() {
  const router = useRouter();
  const { state } = useAppState();

  useEffect(() => {
    if (state.onboarding.completed) {
      router.replace('/myResponder/dashboard');
    } else {
      router.replace('/myResponder/welcome');
    }
  }, [state.onboarding.completed, router]);

  return (
    <div style={{
      height: '100%',
      minHeight: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#003B73',
    }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

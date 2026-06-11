'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  displayName: string;
  nric: string;
  phone: string;
  email: string;
  avatar: number;
  signedUpFrom: string;
}

export interface Preferences {
  cardiacAlert: boolean;
  fireAlert: boolean;
  transportMode: 'walk' | 'cycle' | 'vehicle';
  bypassSilent: boolean;
  notificationsAllowed: boolean;
  criticalAlertsAllowed: boolean;
  locationAccess: boolean;
}

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  learningTopics: string[];
}

export interface AppState {
  user: UserProfile;
  preferences: Preferences;
  onboarding: OnboardingState;
}

interface AppContextValue {
  state: AppState;
  updateUser: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: Partial<Preferences>) => void;
  updateOnboarding: (updates: Partial<OnboardingState>) => void;
  resetState: () => void;
}

const defaultState: AppState = {
  user: {
    name: 'TAN XIU LI, FELICIA',
    displayName: 'TAN',
    nric: '',
    phone: '',
    email: '',
    avatar: 0,
    signedUpFrom: '',
  },
  preferences: {
    cardiacAlert: true,
    fireAlert: true,
    transportMode: 'walk',
    bypassSilent: false,
    notificationsAllowed: false,
    criticalAlertsAllowed: false,
    locationAccess: false,
  },
  onboarding: {
    completed: false,
    currentStep: 0,
    learningTopics: [],
  },
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('myResponder_state');
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('myResponder_state', JSON.stringify(state));
    }
  }, [state, hydrated]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  };

  const updatePreferences = (updates: Partial<Preferences>) => {
    setState(prev => ({ ...prev, preferences: { ...prev.preferences, ...updates } }));
  };

  const updateOnboarding = (updates: Partial<OnboardingState>) => {
    setState(prev => ({ ...prev, onboarding: { ...prev.onboarding, ...updates } }));
  };

  const resetState = () => setState(defaultState);

  if (!hydrated) {
    return null;
  }

  return (
    <AppContext.Provider value={{ state, updateUser, updatePreferences, updateOnboarding, resetState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useApp() {
  return useAppState();
}

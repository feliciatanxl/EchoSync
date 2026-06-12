// @ts-nocheck
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegistered';
import { Toaster as Sonner } from 'sonner';

// Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import Learn from './pages/Learn';
import FireHazard from './pages/FireHazard';
import More from './pages/More';
import Profile from './pages/Profile';
import Account from './pages/Account';
import Settings from './pages/Settings';
import HallOfFame from './pages/HallOfFame';
import Feedback from './pages/Feedback';
import Wellbeing from './pages/Wellbeing';
import CommunityNews from './pages/CommunityNews';
import AEDMap from './pages/AEDMap';
import About from './pages/About';
import Occupation from './pages/Occupation';
import AppShell from './components/AppShell';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a3a8f]">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Splash */}
      <Route path="/" element={<Splash />} />

      {/* Main app with bottom nav */}
      <Route element={<AppShell />}>
        <Route path="/home" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/fire-hazard" element={<FireHazard />} />
        <Route path="/more" element={<More />} />
        <Route path="/news" element={<CommunityNews />} />
        <Route path="/aeds" element={<AEDMap />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/wellbeing" element={<Wellbeing />} />
        <Route path="/hall-of-fame" element={<HallOfFame />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/occupation" element={<Occupation />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename="/myResponder">
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <Sonner position="top-center" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

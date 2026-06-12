// @ts-nocheck
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="app-container bg-background min-h-screen relative">
      <div className="pb-nav">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
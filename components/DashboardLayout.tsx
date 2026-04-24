'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Sync mobileOpen with Sidebar's custom event if we still want that, 
  // but better to just pass props now.
  // However, Sidebar and TopBar were already written as standalone.
  // Let's refactor them slightly to accept props or just use the event for now to avoid breaking too much.

  return (
    <div className="min-h-screen flex bg-bg-deep w-full max-w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        <TopBar />
        <main
          id="main-content-area"
          className="flex-1 pt-16 w-full min-w-0 transition-all duration-300 max-w-full"
          style={{ paddingLeft: 'var(--sidebar-w)' }}
        >
          <div className="p-4 sm:p-8 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

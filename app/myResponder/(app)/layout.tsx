'use client';

import { ReactNode } from 'react';
import BottomTabBar from '@/app/myResponder/components/BottomTabBar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#EEF2F6]">
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      <BottomTabBar />
    </div>
  );
}

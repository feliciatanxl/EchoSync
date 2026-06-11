import type { Metadata, Viewport } from 'next';
import { AppProvider } from './context/AppContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'myResponder - SCDF',
  description: 'Community First Responder application by the Singapore Civil Defence Force',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#070B19',
};

export default function MyResponderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-[#070B19] p-0 md:p-4">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#F4F6F9] md:h-[844px] md:max-w-[390px] md:rounded-[44px] md:border-[12px] md:border-slate-900 md:shadow-2xl">
        <div className="mr-app flex h-full min-h-0 w-full flex-col overflow-hidden">
          <AppProvider>{children}</AppProvider>
        </div>
      </div>
    </section>
  );
}

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
  themeColor: '#DFE5EC',
};

export default function MyResponderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="fixed inset-0 z-[9999] min-h-screen w-screen overflow-hidden bg-[#DFE5EC] md:flex md:items-center md:justify-center">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#EEF2F6] md:h-[852px] md:max-w-[393px] md:rounded-[30px] md:shadow-2xl">
        <div className="mr-app flex h-full min-h-0 w-full flex-col overflow-hidden">
          <AppProvider>{children}</AppProvider>
        </div>
      </div>
    </section>
  );
}

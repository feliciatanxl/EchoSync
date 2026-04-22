import Navbar from "@/components/Navbar";
import TechnologySection from "@/components/TechnologySection";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Technology & Hardware | EchoSync',
  description: 'Deep dive into EchoSync’s zero-stigma sensors, Edge-AI filtering, and autonomous EchoRover response units.',
};

export default function TechnologyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <TechnologySection />
        
        {/* Extended Hardware Showcase */}
        <section className="section-padding bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-ghost border border-primary/10 mb-6">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Hardware Showcase</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-6">
                  EchoRover: The Future of First Response
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-text-muted leading-relaxed">
                    EchoRover is an autonomous corridor-deployment unit designed for Singapore&apos;s HDB infrastructure. It serves as the physical link between AI detection and human intervention.
                  </p>
                  <ul className="space-y-4">
                    {[
                      { title: 'Onboard AED', desc: 'Automated External Defibrillator for immediate cardiac response.' },
                      { title: 'Two-Way Intercom', desc: 'High-fidelity audio for paramedics to communicate with residents before arrival.' },
                      { title: 'Obstacle Avoidance', desc: 'Advanced LiDAR systems designed for narrow corridor navigation.' },
                      { title: 'Supply Payload', desc: 'Secure compartment for oxygen, bandages, and emergency medication.' }
                    ].map(item => (
                      <li key={item.title} className="flex gap-4">
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="text-[15px] font-bold text-text-heading">{item.title}</p>
                          <p className="text-[14px] text-text-muted">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[40px] bg-gradient-to-br from-bg-light to-white border border-border shadow-2xl flex items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="text-center p-12 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <p className="text-[12px] font-bold text-primary uppercase tracking-widest mb-2">Technical Schematic</p>
                    <p className="text-[14px] text-text-muted italic">Rendering EchoRover v2.4 Chassis...</p>
                  </div>
                  {/* Decorative Scan Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

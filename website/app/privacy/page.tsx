import Navbar from "@/components/Navbar";
import PrivacySection from "@/components/PrivacySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Privacy & Trust | EchoSync',
  description: 'Learn how EchoSync ensures PDPA compliance, data sovereignty, and zero-stigma elderly monitoring using Edge-AI.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PrivacySection />
        
        {/* PDPA Breakdown Section */}
        <section className="section-padding bg-bg-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-text-heading tracking-tight mb-4">PDPA Compliance Breakdown</h2>
              <p className="text-text-muted">How we handle Singapore&apos;s most sensitive community data.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Consent Management', desc: 'Strict opt-in protocols for all residents and families.' },
                { title: 'Purpose Limitation', desc: 'Data is used solely for emergency response and wellness checks.' },
                { title: 'Data Sovereignty', desc: 'All data is stored in locally-hosted, secure Singapore servers.' },
                { title: 'Right to Erasure', desc: 'Residents can request full data deletion at any time.' }
              ].map(item => (
                <div key={item.title} className="p-6 rounded-2xl bg-white border border-border shadow-sm">
                  <h4 className="text-[15px] font-bold text-text-heading mb-2">{item.title}</h4>
                  <p className="text-[13px] text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

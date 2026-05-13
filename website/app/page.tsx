import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import TechnologySection from "@/components/TechnologySection";
import DeploymentSection from "@/components/DeploymentSection";
import PrivacySection from "@/components/PrivacySection";
import TeamSection from "@/components/TeamSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MissionSection />
        <TechnologySection />
        <DeploymentSection />
        <PrivacySection />
        <TeamSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

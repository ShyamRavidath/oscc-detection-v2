import Hero from "@/components/Hero";
import ScrollAnimation from "@/components/ScrollAnimation";
import FeatureImportance from "@/components/FeatureImportance";
import ClinicalUtility from "@/components/ClinicalUtility";
import About from "@/components/About";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollAnimation />
      <FeatureImportance />
      <ClinicalUtility />
      <About />
      <ContactSection />
    </main>
  );
}

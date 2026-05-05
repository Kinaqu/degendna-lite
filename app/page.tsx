import { CTASection } from "@/components/landing/CTASection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PersonalityShowcase } from "@/components/landing/PersonalityShowcase";
import { RadarPreview } from "@/components/landing/RadarPreview";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Hero />
      <HowItWorks />
      <RadarPreview />
      <PersonalityShowcase />
      <CTASection />
    </main>
  );
}

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { FacilitiesShowcase } from "@/components/landing/facilities-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CtaBand } from "@/components/landing/cta-band";
import { FAQ } from "@/components/landing/faq";
import { MapEmbed } from "@/components/landing/map-embed";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <FacilitiesShowcase />
        <HowItWorks />
        <CtaBand />
        <FAQ />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}

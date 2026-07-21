import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { SportsTicker } from "@/components/landing/sports-ticker";
import { FacilitiesShowcase } from "@/components/landing/facilities-showcase";
import { AboutDewan } from "@/components/landing/about-dewan";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
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
        <SportsTicker />
        <FacilitiesShowcase />
        <AboutDewan />
        <HowItWorks />
        <Testimonials />
        <CtaBand />
        <FAQ />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}

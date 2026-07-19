import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { FacilitiesShowcase } from "@/components/landing/facilities-showcase";
import { Gallery } from "@/components/landing/gallery";
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
        <Gallery />
        <FAQ />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}

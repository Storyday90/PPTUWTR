import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-pitch text-pitch-foreground">
      <Image
        src="/images/dewan-hero.jpg"
        alt="Gelanggang badminton di Dewan Dato' Haji Samsudin bin Haji Abu Hassan"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/80 to-pitch/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-pitch via-transparent to-pitch/40" />

      <div className="court-frame relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl py-24 sm:py-32">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pitch-foreground/70">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
            Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan · Tapah Road
          </p>

          <h1 className="mt-6 font-heading text-6xl font-bold uppercase leading-[0.9] tracking-tight sm:text-8xl">
            Book.
            <br />
            <span className="text-accent">Play.</span>
            <br />
            Connect.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-pitch-foreground/80">
            Gelanggang badminton, pickleball, futsal, ping pong dan dewan seminar milik komuniti PPUWTR — kini boleh
            ditempah dalam talian. Slot yang anda pilih dikunci serta-merta, tiada pertindihan tempahan.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/facilities" />}
              size="lg"
              className="h-12 bg-accent px-7 font-heading text-base font-bold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              Tempah Gelanggang
            </Button>
            <Button
              render={<Link href="/booking/lookup" />}
              size="lg"
              variant="outline"
              className="h-12 border-pitch-foreground/30 bg-transparent px-7 font-heading text-base font-semibold uppercase tracking-wide text-pitch-foreground hover:bg-pitch-foreground/10"
            >
              Semak Tempahan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

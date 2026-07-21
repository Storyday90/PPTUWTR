"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Clock, LayoutGrid, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADLINE = [
  { text: "Book.", accent: false },
  { text: "Play.", accent: true },
  { text: "Connect.", accent: false },
] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".hero-img", { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0)
          .fromTo(".hero-eyebrow", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.25)
          .fromTo(".hero-line", { yPercent: 112 }, { yPercent: 0, duration: 1.0, stagger: 0.13 }, 0.4)
          .fromTo(".hero-copy", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.0)
          .fromTo(".hero-ctas", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.15)
          .fromTo(".hero-stat", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.3);

        gsap.to(".hero-img-wrap", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-court text-court-foreground">
      <div className="hero-img-wrap absolute inset-0">
        <Image
          src="/images/hall-hero.jpg"
          alt="Gelanggang badminton di dalam dewan Dato' Haji Samsudin bin Haji Abu Hassan"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover opacity-35"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-court/75 via-court/85 to-court" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pt-28 pb-14 sm:px-6">
        <div className="max-w-4xl">
          <p className="hero-eyebrow eyebrow flex items-center gap-2.5 text-court-foreground/70">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
            Dewan Dato&apos; Haji Samsudin · Tapah Road
          </p>

          <h1 className="display mt-6 text-7xl sm:text-[7.5rem]">
            {HEADLINE.map((line) => (
              <span key={line.text} className="block overflow-hidden pb-[0.04em]">
                <span className={`hero-line block will-change-transform ${line.accent ? "text-accent" : ""}`}>
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-copy mt-7 max-w-xl text-lg leading-relaxed text-court-foreground/75">
            Gelanggang badminton, pickleball, futsal, ping pong dan dewan seminar milik komuniti PPUWTR — kini boleh
            ditempah dalam talian. Slot yang anda pilih dikunci serta-merta, tiada pertindihan tempahan.
          </p>

          <div className="hero-ctas mt-10 flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/facilities" />}
              size="lg"
              className="h-13 rounded-full bg-accent px-8 text-base font-bold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              Tempah Gelanggang
            </Button>
            <Button
              render={<Link href="/booking/lookup" />}
              size="lg"
              className="h-13 rounded-full border border-court-foreground/25 bg-court-foreground/5 px-8 text-base font-bold uppercase tracking-wide text-court-foreground hover:bg-court-foreground/15"
            >
              Semak Tempahan
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-court-foreground/15 pt-8">
          <div className="hero-stat flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-court-foreground/25 text-accent">
              <LayoutGrid className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-bold uppercase leading-tight tracking-wide">
              <span className="text-accent"><CountUp value={5} /></span> jenis kemudahan
              <br />
              <span className="font-medium text-court-foreground/60">satu dewan komuniti</span>
            </span>
          </div>
          <div className="hero-stat flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-court-foreground/25 text-accent">
              <Clock className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-bold uppercase leading-tight tracking-wide">
              Buka 8AM–11PM
              <br />
              <span className="font-medium text-court-foreground/60">tujuh hari seminggu</span>
            </span>
          </div>
        </div>

        <div className="scroll-cue pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1.5 text-court-foreground/60">
          <span className="eyebrow text-[0.65rem]">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-accent" aria-hidden />
        </div>
      </div>
    </section>
  );
}

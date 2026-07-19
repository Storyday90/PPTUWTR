"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADLINE = [
  { text: "Book.", accent: false },
  { text: "Play.", accent: true },
  { text: "Connect.", accent: false },
];

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
          .fromTo(".hero-ctas", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.15);

        gsap.to(".hero-img-wrap", {
          yPercent: 16,
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
    <section ref={sectionRef} className="relative overflow-hidden bg-pitch text-pitch-foreground">
      <div className="hero-img-wrap absolute inset-0">
        <Image
          src="/images/dewan-hero.jpg"
          alt="Gelanggang badminton di Dewan Dato' Haji Samsudin bin Haji Abu Hassan"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover opacity-45"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/80 to-pitch/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-pitch via-transparent to-pitch/40" />

      <div className="court-frame relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl py-28 sm:py-36">
          <p className="hero-eyebrow flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pitch-foreground/70">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
            Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan · Tapah Road
          </p>

          <h1 className="mt-6 font-heading text-6xl font-bold uppercase leading-[0.9] tracking-tight sm:text-8xl">
            {HEADLINE.map((line) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                <span className={`hero-line block will-change-transform ${line.accent ? "text-accent" : ""}`}>
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-copy mt-6 max-w-xl text-lg text-pitch-foreground/80">
            Gelanggang badminton, pickleball, futsal, ping pong dan dewan seminar milik komuniti PPUWTR — kini boleh
            ditempah dalam talian. Slot yang anda pilih dikunci serta-merta, tiada pertindihan tempahan.
          </p>

          <div className="hero-ctas mt-10 flex flex-wrap items-center gap-3">
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

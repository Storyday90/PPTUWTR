import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-pitch text-pitch-foreground">
      <Parallax className="absolute inset-0" speed={0.18}>
        <Image
          src="/images/shuttlecock.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-r from-pitch/95 via-pitch/70 to-pitch/95" />
      <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-28 text-center sm:px-6 sm:py-36">
        <h2 className="max-w-2xl font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-7xl">
          Gelanggang menanti.
          <br />
          <span className="accent-italic text-accent">Jom main.</span>
        </h2>
        <Button
          render={<Link href="/facilities" />}
          size="lg"
          className="h-13 bg-accent px-9 text-base font-semibold tracking-tight text-accent-foreground shadow-lg shadow-black/25 hover:bg-accent/90"
        >
          Tempah Sekarang
        </Button>
      </Reveal>
    </section>
  );
}

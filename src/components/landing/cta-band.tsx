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
      <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-28">
        <h2 className="max-w-2xl font-heading text-5xl font-bold uppercase leading-[0.95] sm:text-6xl">
          Gelanggang menanti.
          <br />
          <span className="text-accent">Jom main.</span>
        </h2>
        <Button
          render={<Link href="/facilities" />}
          size="lg"
          className="h-12 bg-accent px-8 font-heading text-base font-bold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
        >
          Tempah Sekarang
        </Button>
      </Reveal>
    </section>
  );
}

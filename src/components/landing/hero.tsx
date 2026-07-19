import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <Image
        src="/images/dewan-hero.jpg"
        alt="Gelanggang badminton di Dewan Dato' Haji Samsudin bin Haji Abu Hassan"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.2),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
          Persatuan Penduduk Taman Universiti Wallagonia Tapah Road
        </p>
        <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
          PPUWTR Arena
        </h1>
        <p className="mt-2 text-2xl font-heading font-semibold text-accent">Book. Play. Connect.</p>
        <p className="mt-4 max-w-xl text-primary-foreground/85">
          Platform tempahan rasmi untuk Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan. Tempah gelanggang
          badminton, pickleball, futsal, ping pong dan dewan seminar secara dalam talian — tiada lagi
          pertindihan tempahan.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            render={<Link href="/facilities" />}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Tempah Sekarang
          </Button>
          <Button
            render={<Link href="/facilities" />}
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Lihat Slot Kosong
          </Button>
        </div>
      </div>
    </section>
  );
}

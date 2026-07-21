import { Reveal } from "@/components/motion/reveal";

export function MapEmbed() {
  return (
    <section className="border-t border-border bg-card py-24 sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-accent">Lokasi</p>
        <h2 className="mt-3 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-5xl">Cara ke Dewan</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan, Taman Universiti Wallagonia, Tapah Road, Perak.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <iframe
            title="Lokasi Dewan Dato' Haji Samsudin bin Haji Abu Hassan"
            src="https://maps.google.com/maps?q=Tapah%20Road%2C%20Perak&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="h-80 w-full"
            loading="lazy"
          />
        </div>
      </Reveal>
    </section>
  );
}

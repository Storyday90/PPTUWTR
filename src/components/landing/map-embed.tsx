import { Reveal } from "@/components/motion/reveal";

export function MapEmbed() {
  return (
    <section className="border-t border-border bg-card py-24 sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-foreground/50">Lokasi</p>
        <h2 className="display mt-3 text-4xl sm:text-5xl">
          Cara ke <span className="accent-lime">Dewan</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan, Taman Universiti Wallagonia, Tapah Road, Perak.
        </p>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border">
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

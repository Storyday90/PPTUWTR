export function MapEmbed() {
  return (
    <section className="border-t border-border bg-card py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-primary">Lokasi</p>
        <h2 className="mt-2 font-heading text-4xl font-bold uppercase leading-none sm:text-5xl">Cara ke Dewan</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
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
      </div>
    </section>
  );
}

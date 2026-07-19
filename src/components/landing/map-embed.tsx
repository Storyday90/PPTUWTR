export function MapEmbed() {
  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-bold">Lokasi Kami</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan, Taman Universiti Wallagonia, Tapah Road.
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

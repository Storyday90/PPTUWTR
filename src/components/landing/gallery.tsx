import Image from "next/image";
import { SportIcon } from "@/components/icons/sport-icons";

const GALLERY_ITEMS = [
  { slug: "futsal", label: "Padang Futsal" },
  { slug: "dewan-seminar", label: "Dewan Seminar" },
  { slug: "pickleball", label: "Gelanggang Pickleball" },
  { slug: "ping-pong", label: "Meja Ping Pong" },
];

export function Gallery() {
  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-bold">Galeri</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Sekilas pandang kemudahan di Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="relative col-span-2 aspect-[2/1] overflow-hidden rounded-xl sm:aspect-square">
            <Image
              src="/images/dewan-hero.jpg"
              alt="Gelanggang badminton di dalam dewan"
              fill
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-sm font-medium text-white">Gelanggang Badminton</span>
          </div>
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-secondary text-secondary-foreground"
            >
              <SportIcon slug={item.slug} className="h-10 w-10 text-primary" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { sportImage } from "@/lib/sportImages";
import { Reveal } from "@/components/motion/reveal";

const FACILITIES = [
  { name: "Badminton", slug: "badminton", note: "4 gelanggang bertaraf pertandingan", featured: true },
  { name: "Futsal", slug: "futsal", note: "Gelanggang dalam dewan" },
  { name: "Pickleball", slug: "pickleball", note: "Sukan paling pantas berkembang" },
  { name: "Ping Pong", slug: "ping-pong", note: "Meja piawai ITTF" },
  { name: "Dewan Seminar", slug: "dewan-seminar", note: "Untuk majlis & bengkel" },
];

export function FacilitiesShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">Kemudahan</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-5xl">
            Pilih gelanggang anda
          </h2>
        </div>
        <Link
          href="/facilities"
          className="group flex items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors hover:text-accent"
        >
          Lihat semua
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </Reveal>

      <Reveal stagger={0.1} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FACILITIES.map((f) => {
          const img = sportImage(f.slug);
          return (
            <Link
              key={f.slug}
              href={`/facilities?sport=${f.slug}`}
              className={`group relative overflow-hidden rounded-xl ${f.featured ? "aspect-[4/3] sm:col-span-2 sm:aspect-[2/1]" : "aspect-[4/3]"}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pitch/90 via-pitch/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-white">{f.name}</h3>
                  <p className="mt-1 text-sm text-white/75">{f.note}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          );
        })}
      </Reveal>
    </section>
  );
}

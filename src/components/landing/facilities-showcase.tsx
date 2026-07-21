import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
          <p className="eyebrow text-foreground/50">Kemudahan</p>
          <h2 className="display mt-3 text-4xl sm:text-6xl">
            Pilih <span className="accent-lime">gelanggang</span> anda
          </h2>
        </div>
        <Link
          href="/facilities"
          className="group flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-foreground/60 transition-colors hover:text-foreground"
        >
          Lihat semua
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </Link>
      </Reveal>

      <Reveal stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FACILITIES.map((f) => {
          const img = sportImage(f.slug);
          return (
            <Link
              key={f.slug}
              href={`/facilities?sport=${f.slug}`}
              className={`group relative overflow-hidden rounded-3xl ${f.featured ? "aspect-[4/3] sm:col-span-2 sm:aspect-[2/1]" : "aspect-[4/3]"}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
                <div>
                  <h3 className="display text-2xl text-white sm:text-3xl">{f.name}</h3>
                  <p className="mt-1.5 text-sm font-medium text-white/75">{f.note}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black transition-colors group-hover:bg-accent">
                  Tempah
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          );
        })}
      </Reveal>
    </section>
  );
}

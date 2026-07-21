"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "fasiliti" | "peserta" | "aktiviti";

interface MediaItem {
  src: string;
  alt: string;
  category: Category;
}

const ITEMS: MediaItem[] = [
  { src: "/images/hall-hero.jpg", alt: "Dewan utama dengan gelanggang badminton", category: "fasiliti" },
  { src: "/images/media-badminton-1.jpg", alt: "Peserta beraksi di gelanggang badminton", category: "peserta" },
  { src: "/images/media-futsal-1.jpg", alt: "Perlawanan futsal komuniti", category: "aktiviti" },
  { src: "/images/pickleball-hd.jpg", alt: "Peralatan pickleball di gelanggang", category: "fasiliti" },
  { src: "/images/media-badminton-2.jpg", alt: "Peserta muda bermain badminton", category: "peserta" },
  { src: "/images/media-tabletennis-1.jpg", alt: "Kejohanan ping pong di dalam dewan", category: "aktiviti" },
  { src: "/images/ping-pong-hd.jpg", alt: "Meja ping pong biru", category: "fasiliti" },
  { src: "/images/media-pickleball-1.jpg", alt: "Peserta bermain pickleball", category: "peserta" },
  { src: "/images/media-futsal-2.jpg", alt: "Aksi menggelecek bola futsal", category: "aktiviti" },
  { src: "/images/seminar-hall.jpg", alt: "Dewan seminar dengan susunan kerusi", category: "fasiliti" },
  { src: "/images/badminton-hd.jpg", alt: "Raket badminton di gelanggang", category: "peserta" },
  { src: "/images/futsal-hd.jpg", alt: "Gelanggang futsal dalam dewan", category: "fasiliti" },
  { src: "/images/badminton-rackets.jpg", alt: "Peralatan badminton komuniti", category: "aktiviti" },
  { src: "/images/shuttlecock.jpg", alt: "Bulu tangkis di atas gelanggang", category: "fasiliti" },
];

const FILTERS: { value: Category | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "fasiliti", label: "Fasiliti" },
  { value: "peserta", label: "Peserta" },
  { value: "aktiviti", label: "Aktiviti" },
];

const CATEGORY_LABEL: Record<Category, string> = {
  fasiliti: "Fasiliti",
  peserta: "Peserta",
  aktiviti: "Aktiviti",
};

export function MediaGallery() {
  const [filter, setFilter] = useState<Category | "semua">("semua");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = filter === "semua" ? ITEMS : ITEMS.filter((i) => i.category === filter);

  const close = useCallback(() => setLightbox(null), []);
  const move = useCallback(
    (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, move]);

  const active = lightbox !== null ? items[lightbox] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFilter(f.value);
              setLightbox(null);
            }}
            className={cn(
              "cursor-pointer rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl break-inside-avoid"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={800}
              height={600}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-semibold text-white">{item.alt}</span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                {CATEGORY_LABEL[item.category]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Sebelum"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Seterusnya"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure className="flex max-h-full max-w-4xl flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.src}
              alt={active.alt}
              width={1400}
              height={1000}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="flex items-center gap-3 text-sm text-white/80">
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                {CATEGORY_LABEL[active.category]}
              </span>
              {active.alt}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

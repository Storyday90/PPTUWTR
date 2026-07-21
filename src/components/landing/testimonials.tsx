import { Quote } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/motion/reveal";

const TESTIMONIALS = [
  {
    quote: "Senang sangat nak tempah — pilih slot, bayar, terus dapat kod. Tak payah telefon sesiapa.",
    name: "Aiman",
    context: "Badminton, setiap Rabu",
  },
  {
    quote: "Kalendar tunjuk slot penuh dengan warna merah, jadi tak buang masa. Terus nampak bila kosong.",
    name: "Pn. Salmah",
    context: "Pickleball",
  },
  {
    quote: "Kami anjur liga futsal komuniti setiap bulan — tempahan berkumpulan pun mudah diuruskan.",
    name: "Coach Faiz",
    context: "Liga Futsal PPUWTR",
  },
  {
    quote: "Dewan bersih, pencahayaan bagus, dan sistem tempahan sangat profesional.",
    name: "Cikgu Lim",
    context: "Ping Pong",
  },
  {
    quote: "Bengkel kami di dewan seminar berjalan lancar — dari tempahan sampai hari acara.",
    name: "Pn. Devi",
    context: "Dewan Seminar",
  },
  {
    quote: "Slot dikunci sepuluh minit masa nak bayar. Tak risau slot hilang tiba-tiba.",
    name: "Hafiz",
    context: "Badminton",
  },
];

function TestimonialCard({ quote, name, context }: (typeof TESTIMONIALS)[number]) {
  return (
    <figure className="w-80 shrink-0 rounded-2xl border border-border bg-card p-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Quote className="h-4 w-4" aria-hidden />
      </span>
      <blockquote className="mt-4 text-base leading-relaxed text-foreground">{quote}</blockquote>
      <figcaption className="mt-5 flex items-baseline gap-2">
        <span className="text-sm font-bold uppercase tracking-wide text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">· {context}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const rowA = TESTIMONIALS.slice(0, half);
  const rowB = TESTIMONIALS.slice(half);

  return (
    <section className="overflow-hidden border-t border-border py-24 sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-foreground/50">Suara Komuniti</p>
        <h2 className="display mt-3 text-4xl sm:text-5xl">
          Mereka dah <span className="accent-lime">cuba</span>
        </h2>
      </Reveal>

      <Reveal className="mt-12" delay={0.1}>
        <Marquee pauseOnHover className="[--duration:45s]">
          {rowA.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="mt-4 [--duration:45s]">
          {rowB.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}

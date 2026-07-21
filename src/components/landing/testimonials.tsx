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
    <figure className="w-80 shrink-0 rounded-lg border border-border bg-card p-6">
      <Quote className="h-5 w-5 text-accent" aria-hidden />
      <blockquote className="mt-4 font-heading text-lg font-normal italic leading-relaxed text-foreground">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-foreground">{name}</span>
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
        <p className="eyebrow text-accent">Suara Komuniti</p>
        <h2 className="mt-3 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-5xl">
          Mereka dah cuba
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

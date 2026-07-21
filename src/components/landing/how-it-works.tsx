import { CalendarCheck2, CreditCard, PartyPopper } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    icon: CalendarCheck2,
    title: "Pilih Slot",
    body: "Buka kalendar gelanggang pilihan anda. Slot hijau kosong, slot merah sudah penuh — apa yang anda lihat adalah status sebenar.",
  },
  {
    icon: CreditCard,
    title: "Kunci & Bayar",
    body: "Slot anda dikunci selama 10 minit sementara anda melengkapkan bayaran. Tiada siapa boleh mengambilnya dalam tempoh itu.",
  },
  {
    icon: PartyPopper,
    title: "Terus Main",
    body: "Terima kod tempahan serta-merta. Tunjukkan kod anda di kaunter dan gelanggang sedia menanti.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <Reveal>
          <p className="eyebrow text-foreground/50">Cara Tempahan</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            Tiga langkah, <span className="accent-lime">siap</span>
          </h2>
        </Reveal>

        <Reveal stagger={0.12} className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-border bg-background p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-heading text-6xl font-extrabold leading-none text-foreground/10">
                  {i + 1}
                </span>
              </div>
              <h3 className="display mt-6 text-2xl">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-8 rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            <span className="font-semibold">Jaminan tiada pertindihan:</span> jika dua pengguna cuba menempah slot yang
            sama serentak, pangkalan data kami hanya membenarkan seorang berjaya — yang seorang lagi dimaklumkan
            serta-merta.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

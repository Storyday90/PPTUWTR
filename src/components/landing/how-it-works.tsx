import { CalendarCheck2, CreditCard, PartyPopper } from "lucide-react";

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
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-primary">Cara Tempahan</p>
        <h2 className="mt-2 font-heading text-4xl font-bold uppercase leading-none sm:text-5xl">
          Tiga Langkah, Siap
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-heading text-5xl font-bold leading-none text-secondary-foreground/20">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold uppercase">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          <span className="font-semibold">Jaminan tiada pertindihan:</span> jika dua pengguna cuba menempah slot yang
          sama serentak, pangkalan data kami hanya membenarkan seorang berjaya — yang seorang lagi dimaklumkan
          serta-merta.
        </p>
      </div>
    </section>
  );
}

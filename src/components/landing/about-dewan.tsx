import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";

export function AboutDewan() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Parallax className="relative order-last aspect-[4/5] overflow-hidden rounded-3xl lg:order-first" speed={0.1}>
          <Image
            src="/images/badminton-rackets.jpg"
            alt="Raket badminton dan bulu tangkis di atas gelanggang hijau"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Parallax>

        <Reveal>
          <p className="eyebrow text-foreground/50">Tentang Dewan</p>
          <h2 className="display mt-4 text-4xl sm:text-6xl">
            Lebih daripada gelanggang — <span className="accent-lime">ini ruang komuniti.</span>
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan diurus oleh Persatuan Penduduk Taman Universiti
              Wallagonia Tapah Road (PPUWTR) — dibina untuk penduduk, ditadbir oleh penduduk.
            </p>
            <p>
              Dari perlawanan badminton petang hingga bengkel komuniti di dewan seminar, setiap slot yang ditempah
              menyokong penyelenggaraan dan program kejiranan kami.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div>
              <dt className="eyebrow text-muted-foreground">Waktu Operasi</dt>
              <dd className="mt-2 font-heading text-3xl font-semibold text-foreground">8<span className="text-base align-super">AM</span>–11<span className="text-base align-super">PM</span></dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Hari Seminggu</dt>
              <dd className="mt-2 font-heading text-3xl font-semibold text-foreground">7</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Milik</dt>
              <dd className="mt-2 font-heading text-3xl font-semibold text-foreground">Komuniti</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

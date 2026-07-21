import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-pitch text-pitch-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-accent font-heading text-lg font-extrabold text-accent-foreground">
              P
            </span>
            <span className="font-heading text-lg font-extrabold uppercase tracking-tight">
              PPUWTR <span className="text-pitch-foreground/40">Club</span>
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-pitch-foreground/60">
            Persatuan Penduduk Taman Universiti Wallagonia Tapah Road. Platform tempahan rasmi untuk Dewan Dato&apos;
            Haji Samsudin bin Haji Abu Hassan.
          </p>
          <p className="display mt-6 text-xl accent-lime">Book. Play. Connect.</p>
        </div>

        <div>
          <h3 className="eyebrow text-pitch-foreground/80">
            Pautan Pantas
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-pitch-foreground/60">
            <li>
              <Link href="/facilities" className="transition-colors hover:text-accent">
                Kemudahan
              </Link>
            </li>
            <li>
              <Link href="/booking/lookup" className="transition-colors hover:text-accent">
                Semak Tempahan
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="transition-colors hover:text-accent">
                Soalan Lazim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-pitch-foreground/80">
            Kemudahan
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-pitch-foreground/60">
            <li>Badminton</li>
            <li>Pickleball</li>
            <li>Futsal</li>
            <li>Ping Pong</li>
            <li>Dewan Seminar</li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-pitch-foreground/80">
            Hubungi Kami
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-pitch-foreground/60">
            <li>Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan</li>
            <li>Taman Universiti Wallagonia, Tapah Road</li>
            <li>admin@ppuwtr.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pitch-foreground/10 py-4 text-center text-xs text-pitch-foreground/40">
        © {new Date().getFullYear()} PPUWTR. Hak cipta terpelihara.
      </div>
    </footer>
  );
}

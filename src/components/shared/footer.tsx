import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
              P
            </span>
            <span className="font-heading text-base font-bold">PPUWTR Arena</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Persatuan Penduduk Taman Universiti Wallagonia Tapah Road. Platform tempahan rasmi untuk Dewan Dato&apos;
            Haji Samsudin bin Haji Abu Hassan.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Pautan Pantas</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/facilities" className="hover:text-primary">Kemudahan</Link></li>
            <li><Link href="/booking/lookup" className="hover:text-primary">Semak Tempahan</Link></li>
            <li><Link href="/#faq" className="hover:text-primary">Soalan Lazim</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Kemudahan</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Badminton</li>
            <li>Pickleball</li>
            <li>Futsal</li>
            <li>Ping Pong</li>
            <li>Dewan Seminar</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Hubungi Kami</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan</li>
            <li>Taman Universiti Wallagonia, Tapah Road</li>
            <li>admin@ppuwtr.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PPUWTR. Hak cipta terpelihara.
      </div>
    </footer>
  );
}

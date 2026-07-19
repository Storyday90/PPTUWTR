import Link from "next/link";
import { SportIcon } from "@/components/icons/sport-icons";

const FACILITIES = [
  { name: "Badminton", slug: "badminton" },
  { name: "Pickleball", slug: "pickleball" },
  { name: "Futsal", slug: "futsal" },
  { name: "Ping Pong", slug: "ping-pong" },
  { name: "Dewan Seminar", slug: "dewan-seminar" },
];

export function FacilitiesShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-center font-heading text-3xl font-bold">Kemudahan Kami</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
        Semua kemudahan di Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan boleh ditempah dalam talian.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {FACILITIES.map((f) => (
          <Link
            key={f.slug}
            href={`/facilities?sport=${f.slug}`}
            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <SportIcon slug={f.slug} className="h-7 w-7" />
            </span>
            <span className="font-heading text-sm font-semibold">{f.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

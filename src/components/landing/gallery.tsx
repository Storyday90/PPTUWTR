import { Landmark } from "lucide-react";
import { SportIcon } from "@/components/icons/sport-icons";
import { CourtLinesPattern } from "@/components/icons/court-lines-pattern";

const GALLERY_ITEMS = [
  { slug: "badminton", label: "Gelanggang Badminton" },
  { slug: "futsal", label: "Padang Futsal" },
  { slug: "dewan-seminar", label: "Dewan Seminar" },
  { slug: "pickleball", label: "Gelanggang Pickleball" },
  { slug: "ping-pong", label: "Meja Ping Pong" },
];

export function Gallery() {
  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-heading text-3xl font-bold">Galeri</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Sekilas pandang kemudahan di Dewan Dato&apos; Haji Samsudin bin Haji Abu Hassan.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="relative col-span-2 flex aspect-[2/1] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#0a2c68] text-primary-foreground sm:aspect-square">
            <CourtLinesPattern className="absolute inset-0 h-full w-full text-white/[0.08]" />
            <Landmark className="relative h-10 w-10" strokeWidth={1.5} />
            <span className="relative text-sm font-medium">Bangunan Dewan</span>
          </div>
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-secondary text-secondary-foreground"
            >
              <SportIcon slug={item.slug} className="h-10 w-10 text-primary" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

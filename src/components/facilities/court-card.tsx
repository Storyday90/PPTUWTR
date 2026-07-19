import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { centsToRM } from "@/lib/utils/money";
import { CourtNowStatus } from "@/components/facilities/court-now-status";
import { sportImage } from "@/lib/sportImages";
import type { CourtDTO } from "@/lib/types";
import { Users } from "lucide-react";

export function CourtCard({ court }: { court: CourtDTO }) {
  const img = sportImage(court.sport.slug);

  return (
    <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch/70 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 font-heading text-sm font-bold uppercase tracking-wider text-white">
          {court.sport.name}
        </span>
      </div>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-xl font-bold uppercase leading-tight">{court.name}</h3>
          <p className="whitespace-nowrap font-heading text-xl font-bold text-primary">
            {centsToRM(court.hourlyPriceCents)}
            <span className="text-xs font-normal text-muted-foreground">/jam</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden /> Kapasiti {court.capacity}
          </span>
          <CourtNowStatus courtId={court.id} slotMinutes={court.slotMinutes} />
        </div>

        {court.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {court.amenities.slice(0, 3).map((a) => (
              <Badge key={a} variant="secondary" className="font-normal">
                {a}
              </Badge>
            ))}
          </div>
        )}

        <Button
          render={<Link href={`/book/${court.id}`} />}
          className="w-full bg-primary font-heading font-bold uppercase tracking-wide hover:bg-primary/90"
        >
          Lihat Kalendar &amp; Tempah
        </Button>
      </CardContent>
    </Card>
  );
}

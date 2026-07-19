import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { centsToRM } from "@/lib/utils/money";
import { CourtNowStatus } from "@/components/facilities/court-now-status";
import { SportIcon } from "@/components/icons/sport-icons";
import { CourtLinesPattern } from "@/components/icons/court-lines-pattern";
import type { CourtDTO } from "@/lib/types";
import { Users } from "lucide-react";

export function CourtCard({ court }: { court: CourtDTO }) {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        <CourtLinesPattern className="absolute inset-0 h-full w-full text-primary-foreground/15" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur-sm">
          <SportIcon slug={court.sport.slug} className="h-8 w-8 text-primary-foreground" />
        </span>
      </div>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{court.sport.name}</p>
            <h3 className="font-heading text-lg font-semibold leading-tight">{court.name}</h3>
          </div>
          <p className="whitespace-nowrap font-heading text-lg font-bold text-primary">
            {centsToRM(court.hourlyPriceCents)}
            <span className="text-xs font-normal text-muted-foreground">/jam</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Kapasiti {court.capacity}
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

        <Button render={<Link href={`/book/${court.id}`} />} className="w-full bg-primary hover:bg-primary/90">
          Lihat &amp; Tempah
        </Button>
      </CardContent>
    </Card>
  );
}

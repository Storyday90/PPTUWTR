"use client";

import { addMinutes } from "date-fns";
import { useAvailability } from "@/hooks/useAvailability";
import { SLOT_STATUS_META } from "@/lib/booking/statusMeta";

/** Shows whether a court's current time slot is open right now. */
export function CourtNowStatus({ courtId, slotMinutes }: { courtId: string; slotMinutes: number }) {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (slotMinutes * 60_000)) * slotMinutes * 60_000);
  const windowEnd = addMinutes(windowStart, slotMinutes);

  const { data, isLoading } = useAvailability(courtId, windowStart, windowEnd);
  const status = data?.[0]?.status ?? "AVAILABLE";
  const meta = SLOT_STATUS_META[status];

  if (isLoading) {
    return <span className="text-xs text-muted-foreground">Menyemak status…</span>;
  }

  return (
    <span className="flex items-center gap-1.5 text-xs font-medium">
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      {status === "AVAILABLE" ? "Kosong sekarang" : `${meta.label} sekarang`}
    </span>
  );
}

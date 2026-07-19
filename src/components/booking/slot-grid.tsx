"use client";

import { format } from "date-fns";
import { useAvailability } from "@/hooks/useAvailability";
import { SLOT_STATUS_META } from "@/lib/booking/statusMeta";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SlotGridProps {
  courtId: string;
  day: Date;
  rangeStart: Date;
  rangeEnd: Date;
  selected: string[]; // ISO slotStart values
  onToggle: (slotStartIso: string) => void;
}

export function SlotGrid({ courtId, rangeStart, rangeEnd, selected, onToggle }: SlotGridProps) {
  const { data: slots, isLoading, isError } = useAvailability(courtId, rangeStart, rangeEnd);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-11 rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuatkan slot. Sila cuba semula.</p>;
  }

  if (!slots || slots.length === 0) {
    return <p className="text-sm text-muted-foreground">Tiada slot tersedia pada hari ini.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {slots.map((slot) => {
        const meta = SLOT_STATUS_META[slot.status];
        const isSelected = selected.includes(slot.slotStart);
        const clickable = meta.selectable;

        return (
          <button
            key={slot.slotStart}
            type="button"
            disabled={!clickable}
            onClick={() => onToggle(slot.slotStart)}
            className={cn(
              "flex h-11 items-center justify-center rounded-md border text-sm font-medium transition-colors",
              clickable ? "cursor-pointer hover:border-primary" : "cursor-not-allowed opacity-70",
              isSelected ? "border-primary bg-primary text-primary-foreground" : meta.badgeClass,
            )}
            title={meta.label}
          >
            {format(new Date(slot.slotStart), "HH:mm")}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { addDays, format, isBefore, isSameDay, isToday, startOfDay } from "date-fns";
import { ms } from "date-fns/locale";
import { Check, X } from "lucide-react";
import { useAvailability } from "@/hooks/useAvailability";
import { SLOT_STATUS_META } from "@/lib/booking/statusMeta";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { SlotAvailabilityDTO } from "@/lib/types";

interface WeekCalendarProps {
  courtId: string;
  weekStart: Date;
  selected: string[]; // ISO slotStart values
  onToggle: (slotStartIso: string) => void;
}

function slotKey(d: Date) {
  return `${format(d, "yyyy-MM-dd")}|${format(d, "HH:mm")}`;
}

export function WeekCalendar({ courtId, weekStart, selected, onToggle }: WeekCalendarProps) {
  const rangeStart = startOfDay(weekStart);
  const rangeEnd = addDays(rangeStart, 7);
  const { data: slots, isLoading, isError } = useAvailability(courtId, rangeStart, rangeEnd);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(rangeStart, i)), [rangeStart]);

  const { times, slotMap } = useMemo(() => {
    const map = new Map<string, SlotAvailabilityDTO>();
    const timeSet = new Set<string>();
    for (const slot of slots ?? []) {
      const d = new Date(slot.slotStart);
      map.set(slotKey(d), slot);
      timeSet.add(format(d, "HH:mm"));
    }
    return { times: Array.from(timeSet).sort(), slotMap: map };
  }, [slots]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuatkan kalendar. Sila cuba semula.</p>;
  }

  if (times.length === 0) {
    return <p className="text-sm text-muted-foreground">Tiada slot tersedia pada minggu ini.</p>;
  }

  const now = new Date();

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-16 border-b border-r border-border bg-card p-2 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Masa</span>
            </th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className={cn(
                  "border-b border-border p-2 text-center",
                  isToday(day) && "bg-secondary",
                )}
              >
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {format(day, "EEE", { locale: ms })}
                </span>
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full font-heading text-base font-bold",
                    isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td className="sticky left-0 z-10 border-r border-border bg-card px-2 py-1.5">
                <span className="font-heading text-sm font-semibold text-muted-foreground">{time}</span>
              </td>
              {days.map((day) => {
                const key = `${format(day, "yyyy-MM-dd")}|${time}`;
                const slot = slotMap.get(key);

                if (!slot) {
                  return <td key={key} className="border-b border-border/50 p-1" />;
                }

                const slotDate = new Date(slot.slotStart);
                const isPast = isBefore(slotDate, now);
                const meta = SLOT_STATUS_META[slot.status];
                const isSelected = selected.includes(slot.slotStart);
                const clickable = meta.selectable && !isPast;

                return (
                  <td key={key} className={cn("border-b border-border/50 p-1", isSameDay(day, now) && "bg-secondary/40")}>
                    {slot.status === "CONFIRMED" ? (
                      <div
                        className="flex h-9 w-full items-center justify-center gap-1 rounded-md bg-destructive text-[11px] font-semibold text-white"
                        title="Slot penuh — telah ditempah"
                      >
                        <X className="h-3 w-3" aria-hidden />
                        Penuh
                      </div>
                    ) : clickable ? (
                      <button
                        type="button"
                        onClick={() => onToggle(slot.slotStart)}
                        aria-pressed={isSelected}
                        aria-label={`Slot ${time}, ${format(day, "d MMMM", { locale: ms })} — kosong`}
                        className={cn(
                          "flex h-9 w-full cursor-pointer items-center justify-center gap-1 rounded-md border text-xs font-semibold transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-success/40 bg-white text-success hover:border-success hover:bg-success/10",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" aria-hidden />}
                        {isSelected ? "Dipilih" : "Kosong"}
                      </button>
                    ) : (
                      <div
                        className={cn(
                          "flex h-9 w-full items-center justify-center rounded-md text-[11px] font-medium",
                          isPast && slot.status === "AVAILABLE"
                            ? "bg-muted/60 text-muted-foreground/50"
                            : meta.badgeClass,
                        )}
                        title={isPast ? "Slot telah berlalu" : meta.label}
                      >
                        {isPast && slot.status === "AVAILABLE" ? "–" : slot.status === "HELD" ? "Menunggu" : "Tutup"}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

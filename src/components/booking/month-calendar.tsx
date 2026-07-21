"use client";

import { useMemo } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ms } from "date-fns/locale";
import { useAvailability } from "@/hooks/useAvailability";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  courtId: string;
  monthStart: Date; // any day within the month to render
  onSelectDay: (day: Date) => void;
}

const WEEKDAYS = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];

export function MonthCalendar({ courtId, monthStart, onSelectDay }: MonthCalendarProps) {
  const gridStart = useMemo(
    () => startOfWeek(startOfMonth(monthStart), { weekStartsOn: 1 }),
    [monthStart],
  );
  const gridEnd = useMemo(() => endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }), [monthStart]);

  const { data: slots, isLoading, isError } = useAvailability(courtId, gridStart, addDays(gridEnd, 1));

  const days = useMemo(() => {
    const out: Date[] = [];
    let d = gridStart;
    while (!isBefore(gridEnd, d)) {
      out.push(d);
      d = addDays(d, 1);
    }
    return out;
  }, [gridStart, gridEnd]);

  // Per-day tally: how many AVAILABLE (not past) slots that day has.
  const openByDay = useMemo(() => {
    const now = new Date();
    const map = new Map<string, number>();
    for (const slot of slots ?? []) {
      if (slot.status !== "AVAILABLE") continue;
      const d = new Date(slot.slotStart);
      if (isBefore(d, now)) continue;
      const key = format(d, "yyyy-MM-dd");
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [slots]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-1.5 rounded-xl border border-border bg-card p-3">
        {Array.from({ length: 42 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuatkan kalendar. Sila cuba semula.</p>;
  }

  const today = startOfDay(new Date());

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthStart);
          const isPast = isBefore(day, today);
          const open = openByDay.get(format(day, "yyyy-MM-dd")) ?? 0;
          const clickable = inMonth && !isPast && open > 0;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!clickable}
              onClick={() => onSelectDay(day)}
              aria-label={`${format(day, "d MMMM yyyy", { locale: ms })}${open > 0 ? ` — ${open} slot kosong` : ""}`}
              className={cn(
                "group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors",
                !inMonth && "border-transparent text-muted-foreground/30",
                inMonth && isPast && "border-transparent text-muted-foreground/40",
                clickable
                  ? "cursor-pointer border-success/40 bg-success/5 text-foreground hover:border-success hover:bg-success/15"
                  : inMonth && !isPast && open === 0
                    ? "border-border bg-muted/40 text-muted-foreground"
                    : "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full font-heading text-sm font-bold",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              {inMonth && !isPast && (
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase leading-none",
                    open > 0 ? "text-success" : "text-muted-foreground/60",
                  )}
                >
                  {open > 0 ? `${open} kosong` : "penuh"}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Klik mana-mana hari yang ada slot <span className="font-semibold text-success">kosong</span> untuk membuka
        kalendar minggu dan memilih waktu.
      </p>
    </div>
  );
}

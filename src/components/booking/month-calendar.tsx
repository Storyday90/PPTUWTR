"use client";

import { useMemo, useState } from "react";
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
import { Check, X, ArrowRight } from "lucide-react";
import { useAvailability } from "@/hooks/useAvailability";
import { SLOT_STATUS_META } from "@/lib/booking/statusMeta";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SlotAvailabilityDTO } from "@/lib/types";

interface MonthCalendarProps {
  courtId: string;
  monthStart: Date; // any day within the month to render
  selected: string[]; // ISO slotStart values
  onToggle: (slotStartIso: string) => void;
  onOpenWeek: (day: Date) => void;
}

const WEEKDAYS = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];

export function MonthCalendar({ courtId, monthStart, selected, onToggle, onOpenWeek }: MonthCalendarProps) {
  const [openDay, setOpenDay] = useState<Date | null>(null);

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

  // Per-day slot lists + open (AVAILABLE, not past) tallies.
  const { slotsByDay, openByDay } = useMemo(() => {
    const now = new Date();
    const byDay = new Map<string, SlotAvailabilityDTO[]>();
    const open = new Map<string, number>();
    for (const slot of slots ?? []) {
      const d = new Date(slot.slotStart);
      const key = format(d, "yyyy-MM-dd");
      (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(slot);
      if (slot.status === "AVAILABLE" && !isBefore(d, now)) {
        open.set(key, (open.get(key) ?? 0) + 1);
      }
    }
    for (const list of byDay.values()) {
      list.sort((a, b) => a.slotStart.localeCompare(b.slotStart));
    }
    return { slotsByDay: byDay, openByDay: open };
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
  const openDayKey = openDay ? format(openDay, "yyyy-MM-dd") : null;
  const daySlots = openDayKey ? (slotsByDay.get(openDayKey) ?? []) : [];
  const selectedThisDay = daySlots.filter((s) => selected.includes(s.slotStart)).length;

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
          const key = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, monthStart);
          const isPast = isBefore(day, today);
          const open = openByDay.get(key) ?? 0;
          const picked = (slotsByDay.get(key) ?? []).filter((s) => selected.includes(s.slotStart)).length;
          const clickable = inMonth && !isPast && open > 0;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!clickable}
              onClick={() => setOpenDay(day)}
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
              {picked > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {picked}
                </span>
              )}
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
        butiran hari dan memilih waktu.
      </p>

      <Sheet open={openDay !== null} onOpenChange={(o) => !o && setOpenDay(null)}>
        <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
          {openDay && (
            <>
              <SheetHeader className="border-b border-border p-5">
                <SheetTitle className="display text-2xl">{format(openDay, "EEEE", { locale: ms })}</SheetTitle>
                <SheetDescription className="text-sm">
                  {format(openDay, "d MMMM yyyy", { locale: ms })}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-5">
                {daySlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Tiada slot pada hari ini.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {daySlots.map((slot) => {
                      const d = new Date(slot.slotStart);
                      const time = format(d, "HH:mm");
                      const isPast = isBefore(d, new Date());
                      const meta = SLOT_STATUS_META[slot.status];
                      const isSelected = selected.includes(slot.slotStart);
                      const clickable = meta.selectable && !isPast;

                      if (slot.status === "CONFIRMED") {
                        return (
                          <div
                            key={slot.slotStart}
                            className="flex h-11 flex-col items-center justify-center rounded-lg bg-destructive/10 text-[11px] font-bold uppercase text-destructive"
                          >
                            <span className="text-sm">{time}</span>
                            <span className="flex items-center gap-0.5">
                              <X className="h-2.5 w-2.5" aria-hidden /> Penuh
                            </span>
                          </div>
                        );
                      }
                      if (clickable) {
                        return (
                          <button
                            key={slot.slotStart}
                            type="button"
                            onClick={() => onToggle(slot.slotStart)}
                            aria-pressed={isSelected}
                            className={cn(
                              "flex h-11 cursor-pointer flex-col items-center justify-center rounded-lg border text-[11px] font-bold uppercase transition-colors",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-success/40 bg-success/5 text-success hover:border-success hover:bg-success/15",
                            )}
                          >
                            <span className="text-sm">{time}</span>
                            <span className="flex items-center gap-0.5">
                              {isSelected ? (
                                <>
                                  <Check className="h-2.5 w-2.5" aria-hidden /> Dipilih
                                </>
                              ) : (
                                "Kosong"
                              )}
                            </span>
                          </button>
                        );
                      }
                      return (
                        <div
                          key={slot.slotStart}
                          className="flex h-11 flex-col items-center justify-center rounded-lg bg-muted text-[11px] font-medium text-muted-foreground/60"
                        >
                          <span className="text-sm">{time}</span>
                          <span>{isPast ? "–" : slot.status === "HELD" ? "Tunggu" : "Tutup"}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <SheetFooter className="border-t border-border p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dipilih pada hari ini</span>
                  <span className="font-heading text-lg font-extrabold">{selectedThisDay}</span>
                </div>
                <Button
                  className="w-full rounded-full bg-primary font-bold uppercase tracking-wide hover:bg-primary/90"
                  onClick={() => setOpenDay(null)}
                >
                  Selesai
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    const d = openDay;
                    setOpenDay(null);
                    onOpenWeek(d);
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  Lihat minggu penuh
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

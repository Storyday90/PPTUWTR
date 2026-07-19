"use client";

import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { useAvailability } from "@/hooks/useAvailability";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function WeekStrip({
  courtId,
  weekStart,
  selectedDay,
  onSelectDay,
}: {
  courtId: string;
  weekStart: Date;
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
}) {
  const rangeStart = startOfDay(weekStart);
  const rangeEnd = addDays(rangeStart, 7);
  const { data: slots, isLoading } = useAvailability(courtId, rangeStart, rangeEnd);

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-md" />
        ))}
      </div>
    );
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(rangeStart, i));

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const availableCount = (slots ?? []).filter(
          (s) => isSameDay(new Date(s.slotStart), day) && s.status === "AVAILABLE",
        ).length;
        const isSelected = isSameDay(day, selectedDay);

        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onSelectDay(day)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-colors",
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
            )}
          >
            <span className="text-[10px] font-medium uppercase opacity-80">{format(day, "EEE")}</span>
            <span className="font-heading text-sm font-bold">{format(day, "d")}</span>
            <span className={cn("text-[10px]", isSelected ? "opacity-90" : "text-success")}>
              {availableCount} kosong
            </span>
          </button>
        );
      })}
    </div>
  );
}

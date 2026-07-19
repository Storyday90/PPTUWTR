"use client";

import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsBar() {
  const { data, isLoading } = useStats();

  const items = [
    { label: "Jumlah Gelanggang", value: data?.totalCourts },
    { label: "Tempahan Hari Ini", value: data?.bookingsToday },
    { label: "Slot Kosong Hari Ini", value: data?.availableSlotsToday },
    { label: "Jenis Kemudahan", value: data?.sportCount },
  ];

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            {isLoading ? (
              <Skeleton className="mx-auto h-8 w-16" />
            ) : (
              <p className="font-heading text-3xl font-bold text-primary">{item.value ?? "–"}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

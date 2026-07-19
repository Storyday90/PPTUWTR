"use client";

import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { CountUp } from "@/components/motion/count-up";

export function StatsBar() {
  const { data, isLoading } = useStats();

  const items = [
    { label: "Gelanggang", value: data?.totalCourts },
    { label: "Tempahan Hari Ini", value: data?.bookingsToday },
    { label: "Slot Kosong Hari Ini", value: data?.availableSlotsToday },
    { label: "Jenis Kemudahan", value: data?.sportCount },
  ];

  return (
    <section className="border-t border-pitch-foreground/10 bg-pitch text-pitch-foreground" aria-label="Papan skor hari ini">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-pitch-foreground/10 px-4 py-8 sm:px-6 md:grid-cols-4 md:divide-x">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-3 text-center">
            {isLoading || item.value == null ? (
              <Skeleton className="mx-auto h-10 w-16 bg-pitch-foreground/10" />
            ) : (
              <p className="font-heading text-5xl font-bold leading-none text-accent">
                <CountUp value={item.value} />
              </p>
            )}
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-pitch-foreground/60">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

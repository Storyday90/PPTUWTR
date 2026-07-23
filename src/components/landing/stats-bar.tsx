"use client";

import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { CountUp } from "@/components/motion/count-up";

export function StatsBar() {
  const { data, isLoading, isError } = useStats();

  const items = [
    { label: "Gelanggang", value: data?.totalCourts },
    { label: "Tempahan Hari Ini", value: data?.bookingsToday },
    { label: "Slot Kosong Hari Ini", value: data?.availableSlotsToday },
    { label: "Jenis Kemudahan", value: data?.sportCount },
  ];

  return (
    <section className="bg-pitch text-pitch-foreground" aria-label="Papan skor hari ini">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-pitch-foreground/10 px-4 py-8 sm:px-6 md:grid-cols-4 md:divide-x">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-3 text-center">
            {isLoading ? (
              <Skeleton className="mx-auto h-10 w-16 bg-pitch-foreground/10" />
            ) : (
              <p className="font-heading text-6xl font-extrabold leading-none text-accent">
                {item.value == null ? (
                  <span className="text-pitch-foreground/25">–</span>
                ) : (
                  <CountUp value={item.value} />
                )}
              </p>
            )}
            <p className="eyebrow mt-3 text-pitch-foreground/55">{item.label}</p>
          </div>
        ))}
      </div>
      {isError && (
        <p className="pb-6 text-center text-xs text-pitch-foreground/40">
          Statistik langsung tidak tersedia buat masa ini.
        </p>
      )}
    </section>
  );
}

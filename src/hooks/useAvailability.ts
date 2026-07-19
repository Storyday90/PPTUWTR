"use client";

import { useQuery } from "@tanstack/react-query";
import type { SlotAvailabilityDTO } from "@/lib/types";

export function useAvailability(courtId: string | undefined, rangeStart: Date, rangeEnd: Date) {
  return useQuery({
    queryKey: ["availability", courtId, rangeStart.toISOString(), rangeEnd.toISOString()],
    queryFn: async (): Promise<SlotAvailabilityDTO[]> => {
      const params = new URLSearchParams({
        courtId: courtId!,
        start: rangeStart.toISOString(),
        end: rangeEnd.toISOString(),
      });
      const res = await fetch(`/api/availability?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuatkan ketersediaan slot.");
      const data = await res.json();
      return data.slots;
    },
    enabled: Boolean(courtId),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}

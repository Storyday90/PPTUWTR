"use client";

import { useQuery } from "@tanstack/react-query";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Gagal memuatkan statistik.");
      return res.json() as Promise<{
        totalCourts: number;
        bookingsToday: number;
        availableSlotsToday: number;
        sportCount: number;
      }>;
    },
    retry: 1,
    refetchInterval: 30_000,
  });
}

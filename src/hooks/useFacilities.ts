"use client";

import { useQuery } from "@tanstack/react-query";
import type { FacilityDTO } from "@/lib/types";

export function useFacilities() {
  return useQuery({
    queryKey: ["facilities"],
    queryFn: async (): Promise<FacilityDTO[]> => {
      const res = await fetch("/api/facilities");
      if (!res.ok) throw new Error("Gagal memuatkan kemudahan.");
      const data = await res.json();
      return data.facilities;
    },
  });
}

export function useCourt(courtId: string | undefined) {
  return useQuery({
    queryKey: ["court", courtId],
    queryFn: async () => {
      const res = await fetch(`/api/courts/${courtId}`);
      if (!res.ok) throw new Error("Gagal memuatkan gelanggang.");
      const data = await res.json();
      return data.court;
    },
    enabled: Boolean(courtId),
  });
}

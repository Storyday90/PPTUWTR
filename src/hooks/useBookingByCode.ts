"use client";

import { useQuery } from "@tanstack/react-query";

export function useBookingByCode(code: string) {
  return useQuery({
    queryKey: ["booking-code", code],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/code/${code}`);
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.message ?? "Tempahan tidak dijumpai.") as Error & { code?: string };
        err.code = data.error;
        throw err;
      }
      return data.booking;
    },
    retry: false,
  });
}

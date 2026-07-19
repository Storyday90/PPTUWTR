"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBookingInput } from "@/lib/validation/booking.schema";

export interface SlotConflictInfo {
  code: "SLOT_CONFLICT";
  message: string;
}

export function useCreateHold(courtId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.message ?? "Gagal membuat tempahan.") as Error & { code?: string };
        err.code = data.error;
        throw err;
      }
      return data.booking as { id: string; code: string; holdExpiresAt: string };
    },
    onSettled: () => {
      // Whether we won or lost the race, the true state has changed — refresh instantly.
      queryClient.invalidateQueries({ queryKey: ["availability", courtId] });
    },
  });
}

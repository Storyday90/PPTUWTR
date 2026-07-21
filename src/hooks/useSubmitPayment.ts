"use client";

import { useMutation } from "@tanstack/react-query";

export function useSubmitPayment() {
  return useMutation({
    mutationFn: async ({ bookingId, reference }: { bookingId: string; reference?: string }) => {
      const res = await fetch(`/api/bookings/${bookingId}/submit-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.message ?? "Gagal menghantar pembayaran.") as Error & { code?: string };
        err.code = data.error;
        throw err;
      }
      return data.booking;
    },
  });
}

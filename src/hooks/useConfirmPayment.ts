"use client";

import { useMutation } from "@tanstack/react-query";

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}/confirm-payment`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.message ?? "Pembayaran gagal.") as Error & { code?: string };
        err.code = data.error;
        throw err;
      }
      return data.booking;
    },
  });
}

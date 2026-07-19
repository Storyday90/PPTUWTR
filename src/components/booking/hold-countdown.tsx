"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useConfirmPayment } from "@/hooks/useConfirmPayment";
import { Button } from "@/components/ui/button";
import { centsToRM } from "@/lib/utils/money";
import { toast } from "sonner";

export function HoldCountdown({
  bookingId,
  holdExpiresAt,
  totalPriceCents,
  onConfirmed,
  onExpired,
}: {
  bookingId: string;
  holdExpiresAt: string;
  totalPriceCents: number;
  onConfirmed: () => void;
  onExpired: () => void;
}) {
  const { minutes, seconds, expired } = useCountdown(holdExpiresAt);
  const confirmPayment = useConfirmPayment();

  if (expired) {
    onExpired();
    return null;
  }

  return (
    <div className="space-y-4 rounded-xl border border-amber-300 bg-amber-50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-amber-800">Slot anda dikunci sementara</p>
        <p className="font-heading text-lg font-bold text-amber-800 tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
      </div>
      <p className="text-sm text-amber-700">
        Sila selesaikan pembayaran sebelum masa tamat, jika tidak slot akan dibuka semula secara automatik.
      </p>
      <div className="flex items-center justify-between rounded-lg bg-white p-3">
        <span className="text-sm text-muted-foreground">Jumlah Bayaran</span>
        <span className="font-heading text-lg font-bold">{centsToRM(totalPriceCents)}</span>
      </div>
      <Button
        className="w-full bg-primary hover:bg-primary/90"
        disabled={confirmPayment.isPending}
        onClick={() =>
          confirmPayment.mutate(bookingId, {
            onSuccess: onConfirmed,
            onError: (err: Error & { code?: string }) => {
              toast.error(err.message);
              if (err.code === "HOLD_EXPIRED") onExpired();
            },
          })
        }
      >
        {confirmPayment.isPending ? "Memproses…" : "Bayar Sekarang (Stub)"}
      </Button>
    </div>
  );
}

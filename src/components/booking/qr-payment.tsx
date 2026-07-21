"use client";

import { useState } from "react";
import { toast } from "sonner";
import { QrCode, ShieldCheck } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useSubmitPayment } from "@/hooks/useSubmitPayment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { centsToRM } from "@/lib/utils/money";

export function QrPayment({
  bookingId,
  holdExpiresAt,
  totalPriceCents,
  onSubmitted,
  onExpired,
}: {
  bookingId: string;
  holdExpiresAt: string;
  totalPriceCents: number;
  onSubmitted: () => void;
  onExpired: () => void;
}) {
  const { minutes, seconds, expired } = useCountdown(holdExpiresAt);
  const submit = useSubmitPayment();
  const [reference, setReference] = useState("");

  if (expired) {
    onExpired();
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-amber-50 px-5 py-3">
        <p className="text-sm font-semibold text-amber-800">Slot dikunci — selesaikan bayaran</p>
        <p className="font-heading text-lg font-extrabold tabular-nums text-amber-800">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-2">
        {/* QR panel — real DuitNow QR is dropped in here at launch. */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center">
          <div className="flex h-44 w-44 items-center justify-center rounded-xl border border-border bg-white">
            <QrCode className="h-24 w-24 text-foreground/25" aria-hidden strokeWidth={1} />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Imbas untuk bayar · DuitNow QR
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            (Kod QR rasmi akan dipaparkan di sini)
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
            <span className="text-sm text-muted-foreground">Jumlah Bayaran</span>
            <span className="font-heading text-2xl font-extrabold">{centsToRM(totalPriceCents)}</span>
          </div>
          <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>1. Imbas kod QR dengan app perbankan / e-wallet anda.</li>
            <li>2. Bayar jumlah tepat di atas.</li>
            <li>3. Tekan &ldquo;Saya Dah Bayar&rdquo; — admin akan sahkan penerimaan.</li>
          </ol>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="reference">No. Rujukan / Resit (pilihan)</Label>
            <Input
              id="reference"
              placeholder="cth. no. transaksi DuitNow"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <Button
            className="mt-4 w-full rounded-full bg-primary font-bold uppercase tracking-wide hover:bg-primary/90"
            disabled={submit.isPending}
            onClick={() =>
              submit.mutate(
                { bookingId, reference: reference.trim() || undefined },
                {
                  onSuccess: () => {
                    toast.success("Terima kasih! Bayaran anda sedang disahkan oleh admin.");
                    onSubmitted();
                  },
                  onError: (err: Error & { code?: string }) => {
                    toast.error(err.message);
                    if (err.code === "HOLD_EXPIRED") onExpired();
                  },
                },
              )
            }
          >
            {submit.isPending ? "Menghantar…" : "Saya Dah Bayar"}
          </Button>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden />
            Slot anda kekal dikunci sehingga admin sahkan bayaran.
          </p>
        </div>
      </div>
    </div>
  );
}

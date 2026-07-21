"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ms } from "date-fns/locale";
import { Receipt, ArrowRight } from "lucide-react";
import { useMyBookings, type AccountBooking } from "@/hooks/useAccount";
import { centsToRM } from "@/lib/utils/money";
import { BOOKING_STATUS_META } from "@/lib/booking/bookingStatusMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  PAID: { label: "Dibayar", className: "bg-success/10 text-success border-success/30" },
  PENDING: { label: "Belum Dibayar", className: "bg-amber-50 text-amber-700 border-amber-300" },
  FAILED: { label: "Gagal", className: "bg-destructive/10 text-destructive border-destructive/30" },
  REFUNDED: { label: "Dikembalikan", className: "bg-slate-100 text-slate-600 border-slate-300" },
};

function totalPaid(bookings: AccountBooking[]) {
  return bookings
    .filter((b) => b.payment?.status === "PAID")
    .reduce((sum, b) => sum + (b.payment?.amountCents ?? 0), 0);
}

function BookingRow({ b }: { b: AccountBooking }) {
  const pay = b.payment
    ? PAYMENT_STATUS_META[b.payment.status] ?? { label: b.payment.status, className: "bg-muted text-muted-foreground" }
    : { label: "Tiada Rekod", className: "bg-muted text-muted-foreground" };
  const bookingMeta = BOOKING_STATUS_META[b.status];

  return (
    <Link
      href={`/booking/${b.code}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/20 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold">{b.code}</span>
          {bookingMeta && (
            <Badge variant="outline" className={cn("text-[10px]", bookingMeta.badgeClass)}>
              {bookingMeta.label}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {b.court.name} · <span className="text-muted-foreground">{b.court.sport}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(b.startAt), "EEEE, d MMM yyyy · HH:mm", { locale: ms })}–
          {format(new Date(b.endAt), "HH:mm")}
        </p>
        {b.payment?.paidAt && (
          <p className="text-xs text-muted-foreground">
            Dibayar pada {format(new Date(b.payment.paidAt), "d MMM yyyy, HH:mm", { locale: ms })}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <span className="font-heading text-lg font-extrabold">{centsToRM(b.totalPriceCents)}</span>
        <Badge variant="outline" className={cn("text-[11px]", pay.className)}>
          {pay.label}
        </Badge>
      </div>
    </Link>
  );
}

export function PaymentHistory() {
  const { data: bookings, isLoading, isError } = useMyBookings();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuatkan sejarah pembayaran.</p>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Receipt className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="font-heading text-lg font-bold">Belum ada tempahan</p>
          <p className="mt-1 text-sm text-muted-foreground">Tempahan &amp; pembayaran anda akan muncul di sini.</p>
        </div>
        <Button
          render={<Link href="/facilities" />}
          className="rounded-full bg-accent font-bold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
        >
          Tempah Sekarang
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    );
  }

  const paid = totalPaid(bookings);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="eyebrow text-muted-foreground">Jumlah Tempahan</p>
          <p className="mt-1.5 font-heading text-3xl font-extrabold">{bookings.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="eyebrow text-muted-foreground">Jumlah Dibayar</p>
          <p className="mt-1.5 font-heading text-3xl font-extrabold text-success">{centsToRM(paid)}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-border bg-card p-4 sm:col-span-1">
          <p className="eyebrow text-muted-foreground">Menunggu Bayaran</p>
          <p className="mt-1.5 font-heading text-3xl font-extrabold text-amber-600">
            {bookings.filter((b) => b.payment?.status === "PENDING" || b.status === "PENDING_PAYMENT").length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <BookingRow key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}

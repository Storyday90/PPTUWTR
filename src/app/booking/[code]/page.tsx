"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ms } from "date-fns/locale";
import { CheckCircle2, Download, Clock, RotateCcw } from "lucide-react";
import { useBookingByCode } from "@/hooks/useBookingByCode";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToRM } from "@/lib/utils/money";
import { BOOKING_STATUS_META } from "@/lib/booking/bookingStatusMeta";

export default function BookingConfirmationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { data: booking, isLoading, isError, error } = useBookingByCode(code);

  const awaitingVerification =
    booking?.status === "PENDING_PAYMENT" && booking?.payment?.status === "SUBMITTED";

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
          {isLoading && <Skeleton className="h-72 w-full rounded-2xl" />}

          {isError && (
            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-8 text-center">
                <p className="text-destructive">{(error as Error & { code?: string })?.message}</p>
                <Button render={<Link href="/booking/lookup" />} variant="outline" className="rounded-full">
                  Cuba Kod Lain
                </Button>
              </CardContent>
            </Card>
          )}

          {booking && (
            <Card id="receipt" className="rounded-2xl">
              <CardContent className="space-y-5 p-8">
                {booking.status === "CONFIRMED" && (
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </span>
                    <h1 className="mt-3 display text-3xl">Tempahan Disahkan!</h1>
                  </div>
                )}
                {awaitingVerification && (
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                      <Clock className="h-8 w-8 text-amber-600" />
                    </span>
                    <h1 className="mt-3 display text-2xl">Menunggu Pengesahan</h1>
                  </div>
                )}
                {booking.status !== "CONFIRMED" && !awaitingVerification && (
                  <h1 className="text-center display text-2xl">Butiran Tempahan</h1>
                )}

                <div className="flex items-center justify-between rounded-xl bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Kod Tempahan</span>
                  <span className="font-mono font-bold">{booking.code}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={BOOKING_STATUS_META[booking.status]?.badgeClass}>
                    {BOOKING_STATUS_META[booking.status]?.label ?? booking.status}
                  </Badge>
                </div>

                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <Row label="Kemudahan" value={`${booking.court.name} (${booking.court.sport})`} />
                  <Row
                    label="Tarikh & Masa"
                    value={`${format(new Date(booking.startAt), "d MMM yyyy, HH:mm", { locale: ms })} – ${format(
                      new Date(booking.endAt),
                      "HH:mm",
                    )}`}
                  />
                  <Row label="Nama" value={booking.contactName} />
                  {booking.payment?.provider && <Row label="Kaedah Bayaran" value="QR (DuitNow)" />}
                  {booking.payment?.providerRef && <Row label="No. Rujukan" value={booking.payment.providerRef} />}
                  {booking.payment?.paidAt && (
                    <Row
                      label="Tarikh Bayaran"
                      value={format(new Date(booking.payment.paidAt), "d MMM yyyy, HH:mm", { locale: ms })}
                    />
                  )}
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Jumlah</span>
                    <span className="font-heading text-lg font-extrabold text-foreground">
                      {centsToRM(booking.totalPriceCents)}
                    </span>
                  </div>
                </div>

                {awaitingVerification && (
                  <p className="rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-700">
                    Terima kasih! Kami telah menerima notifikasi bayaran anda. Admin akan mengesahkan penerimaan dan
                    anda akan menerima <span className="font-semibold">emel pengesahan</span> sebaik sahaja disahkan.
                  </p>
                )}
                {booking.status === "PENDING_PAYMENT" && !awaitingVerification && (
                  <p className="rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-700">
                    Tempahan ini masih menunggu pembayaran. Sila kembali ke pautan asal untuk selesaikan bayaran
                    sebelum masa tamat.
                  </p>
                )}
                {booking.status === "CONFIRMED" && (
                  <p className="rounded-xl bg-success/10 p-3 text-center text-sm text-success">
                    Resit transaksi telah dihantar ke emel anda. Tunjukkan kod tempahan di kaunter.
                  </p>
                )}

                <div className="no-print flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    className="w-full rounded-full font-bold uppercase tracking-wide"
                    onClick={() => window.print()}
                  >
                    <Download className="mr-1.5 h-4 w-4" /> Muat Turun Resit (PDF)
                  </Button>
                  {booking.courtId && (
                    <Button
                      render={<Link href={`/book/${booking.courtId}`} />}
                      className="w-full rounded-full bg-accent font-bold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
                    >
                      <RotateCcw className="mr-1.5 h-4 w-4" /> Tempah Lagi
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

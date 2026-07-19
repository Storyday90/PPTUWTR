"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle2, Printer } from "lucide-react";
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

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
          {isLoading && <Skeleton className="h-72 w-full rounded-xl" />}

          {isError && (
            <Card>
              <CardContent className="space-y-3 p-8 text-center">
                <p className="text-destructive">{(error as Error & { code?: string })?.message}</p>
                <Button render={<Link href="/booking/lookup" />} variant="outline">
                  Cuba Kod Lain
                </Button>
              </CardContent>
            </Card>
          )}

          {booking && (
            <Card id="receipt">
              <CardContent className="space-y-5 p-8">
                {booking.status === "CONFIRMED" && (
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle2 className="h-12 w-12 text-success" />
                    <h1 className="mt-3 font-heading text-xl font-bold">Tempahan Disahkan!</h1>
                  </div>
                )}
                {booking.status !== "CONFIRMED" && (
                  <h1 className="text-center font-heading text-xl font-bold">Butiran Tempahan</h1>
                )}

                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm text-muted-foreground">Kod Tempahan</span>
                  <span className="font-mono font-semibold">{booking.code}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={BOOKING_STATUS_META[booking.status]?.badgeClass}>
                    {BOOKING_STATUS_META[booking.status]?.label ?? booking.status}
                  </Badge>
                </div>

                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kemudahan</span>
                    <span className="font-medium">
                      {booking.court.name} ({booking.court.sport})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarikh &amp; Masa</span>
                    <span className="font-medium">
                      {format(new Date(booking.startAt), "d MMM yyyy, HH:mm")} –{" "}
                      {format(new Date(booking.endAt), "HH:mm")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama</span>
                    <span className="font-medium">{booking.contactName}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Jumlah</span>
                    <span className="font-heading font-bold text-primary">
                      {centsToRM(booking.totalPriceCents)}
                    </span>
                  </div>
                </div>

                {booking.status === "PENDING_PAYMENT" && (
                  <p className="rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-700">
                    Tempahan ini masih menunggu pembayaran. Sila kembali ke pautan asal untuk selesaikan bayaran
                    sebelum masa tamat.
                  </p>
                )}

                <div className="flex gap-2 print:hidden">
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Cetak / Simpan Resit
                  </Button>
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

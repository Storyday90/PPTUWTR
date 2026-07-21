"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAdminBookings, useAdminBookingAction } from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { centsToRM } from "@/lib/utils/money";
import { BOOKING_STATUS_META } from "@/lib/booking/bookingStatusMeta";

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "PENDING_PAYMENT", label: "Menunggu Bayaran" },
  { value: "CONFIRMED", label: "Disahkan" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

interface AdminBooking {
  id: string;
  code: string;
  status: string;
  contactName: string;
  contactPhone: string;
  startAt: string;
  totalPriceCents: number;
  court: { name: string; sport: string };
  payment: { status: string } | null;
}

export default function AdminBookingsPage() {
  const [status, setStatus] = useState("all");
  const { data: bookings, isLoading } = useAdminBookings(status === "all" ? undefined : status);
  const action = useAdminBookingAction();

  return (
    <div className="space-y-6">
      <h1 className="display text-3xl">Pengurusan Tempahan</h1>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.value}
              value={f.value}
              className="rounded-full border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="space-y-2">
              {(bookings as AdminBooking[] | undefined)?.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {b.contactName} · {b.court.name} ({b.court.sport})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.code} · {format(new Date(b.startAt), "d MMM yyyy, HH:mm")} · {b.contactPhone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{centsToRM(b.totalPriceCents)}</span>
                    {b.payment?.status === "SUBMITTED" && b.status === "PENDING_PAYMENT" && (
                      <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">
                        Klien dah bayar
                      </Badge>
                    )}
                    <Badge variant="outline" className={BOOKING_STATUS_META[b.status]?.badgeClass}>
                      {BOOKING_STATUS_META[b.status]?.label ?? b.status}
                    </Badge>
                    {b.status === "PENDING_PAYMENT" && (
                      <Button
                        size="sm"
                        className="bg-success text-success-foreground hover:bg-success/90"
                        disabled={action.isPending}
                        onClick={() =>
                          action.mutate(
                            { id: b.id, action: "approve" },
                            {
                              onSuccess: () => toast.success("Bayaran disahkan · emel resit dihantar kepada klien."),
                              onError: (e: Error) => toast.error(e.message),
                            },
                          )
                        }
                      >
                        {b.payment?.status === "SUBMITTED" ? "Sahkan Bayaran" : "Luluskan"}
                      </Button>
                    )}
                    {(b.status === "PENDING_PAYMENT" || b.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={action.isPending}
                        onClick={() =>
                          action.mutate(
                            { id: b.id, action: "cancel" },
                            { onError: (e: Error) => toast.error(e.message) },
                          )
                        }
                      >
                        Batalkan
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {(bookings as AdminBooking[] | undefined)?.length === 0 && (
                <p className="text-sm text-muted-foreground">Tiada tempahan.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

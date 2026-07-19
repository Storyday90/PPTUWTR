"use client";

import { format } from "date-fns";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { centsToRM } from "@/lib/utils/money";
import { BOOKING_STATUS_META } from "@/lib/booking/bookingStatusMeta";

export default function AdminOverviewPage() {
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Gambaran Keseluruhan</h1>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Revenue Hari Ini" value={centsToRM(data.revenueTodayCents)} />
          <StatCard label="Revenue Bulan Ini" value={centsToRM(data.revenueMonthCents)} />
          <StatCard label="Tempahan Hari Ini" value={String(data.bookingsToday)} />
          <StatCard label="Menunggu Bayaran" value={String(data.pendingCount)} />
          <StatCard label="Gelanggang Aktif" value={String(data.totalCourts)} />
          <StatCard label="Kadar Penggunaan Hari Ini" value={`${Math.round(data.utilizationRate * 100)}%`} />
        </div>
      )}

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 font-heading text-base font-semibold">Tempahan Terkini</h2>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-2">
              {data.recentBookings.map((b: { id: string; code: string; status: string; contactName: string; startAt: string; totalPriceCents: number; court: { name: string; sport: string } }) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">{b.contactName} · {b.court.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.code} · {format(new Date(b.startAt), "d MMM, HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{centsToRM(b.totalPriceCents)}</span>
                    <Badge variant="outline" className={BOOKING_STATUS_META[b.status]?.badgeClass}>
                      {BOOKING_STATUS_META[b.status]?.label ?? b.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {data.recentBookings.length === 0 && (
                <p className="text-sm text-muted-foreground">Tiada tempahan lagi.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-2xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}

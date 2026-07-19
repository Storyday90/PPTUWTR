"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAdminBlockedSlots, useAdminCourts, useCreateBlockedSlot, useDeleteBlockedSlot } from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourtDTO } from "@/lib/types";

interface BlockedSlotDTO {
  id: string;
  courtId: string;
  courtName: string;
  startAt: string;
  endAt: string;
  reason: string;
}

export default function AdminBlockedSlotsPage() {
  const { data: blocked, isLoading } = useAdminBlockedSlots();
  const { data: courts } = useAdminCourts();
  const createBlock = useCreateBlockedSlot();
  const deleteBlock = useDeleteBlockedSlot();
  const [courtId, setCourtId] = useState("");

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const startAt = new Date(String(form.get("startAt"))).toISOString();
    const endAt = new Date(String(form.get("endAt"))).toISOString();

    createBlock.mutate(
      { courtId, startAt, endAt, reason: form.get("reason") },
      {
        onSuccess: () => {
          toast.success("Slot ditutup.");
          e.currentTarget.reset();
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Slot Ditutup / Penyelenggaraan</h1>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-base font-semibold">Tutup Slot Baharu</h2>
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Gelanggang</Label>
              <Select value={courtId} onValueChange={(v) => setCourtId(v ?? "")} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih gelanggang" />
                </SelectTrigger>
                <SelectContent>
                  {(courts as CourtDTO[] | undefined)?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startAt">Dari</Label>
              <Input id="startAt" name="startAt" type="datetime-local" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endAt">Hingga</Label>
              <Input id="endAt" name="endAt" type="datetime-local" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="reason">Sebab</Label>
              <Input id="reason" name="reason" placeholder="Cth: Penyelenggaraan lantai" required />
            </div>
            <Button
              type="submit"
              disabled={createBlock.isPending || !courtId}
              className="bg-primary hover:bg-primary/90 sm:col-span-2"
            >
              {createBlock.isPending ? "Menyimpan…" : "Tutup Slot"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-base font-semibold">Senarai Slot Ditutup</h2>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-2">
              {(blocked as BlockedSlotDTO[] | undefined)?.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{b.courtName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(b.startAt), "d MMM yyyy, HH:mm")} – {format(new Date(b.endAt), "HH:mm")} ·{" "}
                      {b.reason}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBlock.mutate(b.id, { onError: (e: Error) => toast.error(e.message) })}
                  >
                    Buka Semula
                  </Button>
                </div>
              ))}
              {(blocked as BlockedSlotDTO[] | undefined)?.length === 0 && (
                <p className="text-sm text-muted-foreground">Tiada slot ditutup.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

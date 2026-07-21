"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminCourts,
  useAdminMeta,
  useCreateCourt,
  useUpdateCourt,
  useDeactivateCourt,
} from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { centsToRM, rmToCents } from "@/lib/utils/money";
import type { CourtDTO } from "@/lib/types";

export default function AdminCourtsPage() {
  const { data: courts, isLoading } = useAdminCourts();
  const { data: meta } = useAdminMeta();
  const createCourt = useCreateCourt();
  const updateCourt = useUpdateCourt();
  const deactivateCourt = useDeactivateCourt();
  const [open, setOpen] = useState(false);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createCourt.mutate(
      {
        facilityId: form.get("facilityId"),
        sportId: form.get("sportId"),
        name: form.get("name"),
        capacity: Number(form.get("capacity")),
        hourlyPriceCents: rmToCents(Number(form.get("hourlyPriceRM"))),
      },
      {
        onSuccess: () => {
          toast.success("Gelanggang ditambah.");
          setOpen(false);
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-3xl">Pengurusan Gelanggang</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90" />}>
            Tambah Gelanggang
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Gelanggang Baharu</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="space-y-1.5">
                <Label>Kemudahan</Label>
                <Select name="facilityId" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kemudahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {meta?.facilities?.map((f: { id: string; name: string }) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sukan</Label>
                <Select name="sportId" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih sukan" />
                  </SelectTrigger>
                  <SelectContent>
                    {meta?.sports?.map((s: { id: string; name: string }) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Gelanggang</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="capacity">Kapasiti</Label>
                  <Input id="capacity" name="capacity" type="number" min={1} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hourlyPriceRM">Harga/Jam (RM)</Label>
                  <Input id="hourlyPriceRM" name="hourlyPriceRM" type="number" min={0} step="0.01" required />
                </div>
              </div>
              <Button type="submit" disabled={createCourt.isPending} className="w-full bg-primary hover:bg-primary/90">
                {createCourt.isPending ? "Menyimpan…" : "Simpan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="space-y-2">
              {(courts as CourtDTO[] | undefined)?.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {c.name} <span className="text-muted-foreground">· {c.sport.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {centsToRM(c.hourlyPriceCents)}/jam · Kapasiti {c.capacity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={c.isActive ? "bg-success/10 text-success border-success/30" : "bg-slate-100 text-slate-600 border-slate-300"}>
                      {c.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    {c.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deactivateCourt.mutate(c.id, { onError: (e: Error) => toast.error(e.message) })}
                      >
                        Nyahaktifkan
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateCourt.mutate(
                            { id: c.id, input: { isActive: true } },
                            { onError: (e: Error) => toast.error(e.message) },
                          )
                        }
                      >
                        Aktifkan
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

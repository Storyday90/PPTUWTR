"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFacilities } from "@/hooks/useFacilities";
import { CourtCard } from "@/components/facilities/court-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import type { CourtDTO } from "@/lib/types";

type SortOption = "default" | "price-asc" | "price-desc";

export default function FacilitiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-primary">Kemudahan</p>
          <h1 className="mt-1 font-heading text-4xl font-bold uppercase leading-none sm:text-5xl">
            Terokai Kemudahan
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Semak harga, kapasiti dan status ketersediaan setiap gelanggang di Dewan Dato&apos; Haji Samsudin bin
            Haji Abu Hassan secara masa nyata.
          </p>
          <Suspense>
            <FacilitiesGrid />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FacilitiesGrid() {
  const searchParams = useSearchParams();
  const { data: facilities, isLoading, isError } = useFacilities();
  const [sport, setSport] = useState(searchParams.get("sport") ?? "all");
  const [sort, setSort] = useState<SortOption>("default");

  const allCourts: CourtDTO[] = useMemo(
    () => (facilities ?? []).flatMap((f) => f.courts.map((c) => ({ ...c, facilityId: f.id }))),
    [facilities],
  );

  const sports = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of allCourts) map.set(c.sport.slug, c.sport.name);
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  }, [allCourts]);

  const filteredCourts = useMemo(() => {
    const filtered = sport === "all" ? allCourts : allCourts.filter((c) => c.sport.slug === sport);
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.hourlyPriceCents - b.hourlyPriceCents);
    if (sort === "price-desc") sorted.sort((a, b) => b.hourlyPriceCents - a.hourlyPriceCents);
    return sorted;
  }, [allCourts, sport, sort]);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Tabs value={sport} onValueChange={setSport}>
          <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-full border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Semua
            </TabsTrigger>
            {sports.map((s) => (
              <TabsTrigger
                key={s.slug}
                value={s.slug}
                className="rounded-full border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={sort} onValueChange={(v) => setSort((v as SortOption) ?? "default")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Susun mengikut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Susunan Lalai</SelectItem>
            <SelectItem value="price-asc">Harga: Rendah ke Tinggi</SelectItem>
            <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      )}

      {isError && <p className="mt-8 text-destructive">Gagal memuatkan kemudahan. Sila cuba semula.</p>}

      {!isLoading && filteredCourts.length === 0 && (
        <p className="mt-8 text-muted-foreground">Tiada gelanggang dijumpai untuk kategori ini.</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourts.map((court) => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </>
  );
}

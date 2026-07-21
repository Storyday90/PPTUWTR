"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addWeeks, format, isBefore, startOfDay, startOfWeek } from "date-fns";
import { ms } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { toast } from "sonner";
import { useCourt } from "@/hooks/useFacilities";
import { useCreateHold } from "@/hooks/useCreateHold";
import { WeekCalendar } from "@/components/booking/week-calendar";
import { StatusLegend } from "@/components/booking/status-legend";
import { ContactForm } from "@/components/booking/contact-form";
import { HoldCountdown } from "@/components/booking/hold-countdown";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToRM } from "@/lib/utils/money";
import type { ContactDetailsInput } from "@/lib/validation/booking.schema";

type Step = "select" | "contact" | "hold";

export default function BookCourtPage({ params }: { params: Promise<{ courtId: string }> }) {
  const { courtId } = use(params);
  const router = useRouter();
  const { data: court, isLoading } = useCourt(courtId);
  const createHold = useCreateHold(courtId);

  const currentWeekStart = useMemo(() => startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 }), []);
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("select");
  const [holdBooking, setHoldBooking] = useState<{ id: string; code: string; holdExpiresAt: string } | null>(null);

  const isCurrentWeek = !isBefore(currentWeekStart, weekStart) && !isBefore(weekStart, currentWeekStart);

  const totalPriceCents = useMemo(() => {
    if (!court) return 0;
    return Math.round(court.hourlyPriceCents * (court.slotMinutes / 60) * selected.length);
  }, [court, selected]);

  function toggleSlot(iso: string) {
    setSelected((prev) => (prev.includes(iso) ? prev.filter((s) => s !== iso) : [...prev, iso].sort()));
  }

  function handleContactSubmit(values: ContactDetailsInput) {
    createHold.mutate(
      { courtId, slotStarts: selected, ...values },
      {
        onSuccess: (booking) => {
          setHoldBooking(booking);
          setStep("hold");
        },
        onError: (err: Error & { code?: string }) => {
          toast.error(err.message);
          if (err.code === "SLOT_CONFLICT") {
            setSelected([]);
            setStep("select");
          }
        },
      },
    );
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-6 h-96 w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!court) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
            <p className="text-muted-foreground">Gelanggang tidak dijumpai.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const weekLabel = `${format(weekStart, "d MMM", { locale: ms })} – ${format(addWeeks(weekStart, 1), "d MMM yyyy", { locale: ms })}`;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-6 sm:px-6">
            <div>
              <p className="eyebrow text-accent">{court.sport.name}</p>
              <h1 className="mt-2 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-4xl">
                {court.name}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden /> Kapasiti {court.capacity}
              </span>
              <span className="font-heading text-2xl font-bold text-primary">
                {centsToRM(court.hourlyPriceCents)}
                <span className="ml-0.5 text-xs font-medium text-muted-foreground">/jam</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px]">
          <div>
            {step === "select" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" aria-hidden />
                    <h2 className="font-heading text-2xl font-semibold">Kalendar Tempahan</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={isCurrentWeek}
                      onClick={() => setWeekStart((w) => addWeeks(w, -1))}
                      aria-label="Minggu sebelumnya"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-40 text-center font-heading text-sm font-semibold">{weekLabel}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setWeekStart((w) => addWeeks(w, 1))}
                      aria-label="Minggu seterusnya"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    {!isCurrentWeek && (
                      <Button variant="ghost" size="sm" onClick={() => setWeekStart(currentWeekStart)}>
                        Minggu Ini
                      </Button>
                    )}
                  </div>
                </div>

                <StatusLegend />

                <WeekCalendar courtId={courtId} weekStart={weekStart} selected={selected} onToggle={toggleSlot} />

                <p className="text-xs text-muted-foreground">
                  Slot berwarna <span className="font-semibold text-destructive">merah</span> telah penuh. Pilih slot
                  kosong — sistem kami menjamin tiada pertindihan tempahan.
                </p>
              </div>
            )}

            {step === "contact" && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="mb-4 font-heading text-2xl font-semibold">Butiran Hubungan</h2>
                  <ContactForm onSubmit={handleContactSubmit} submitting={createHold.isPending} />
                </CardContent>
              </Card>
            )}

            {step === "hold" && holdBooking && (
              <HoldCountdown
                bookingId={holdBooking.id}
                holdExpiresAt={holdBooking.holdExpiresAt}
                totalPriceCents={totalPriceCents}
                onConfirmed={() => router.push(`/booking/${holdBooking.code}`)}
                onExpired={() => {
                  toast.error("Tempahan anda telah tamat tempoh, sila cuba semula.");
                  setSelected([]);
                  setHoldBooking(null);
                  setStep("select");
                }}
              />
            )}
          </div>

          <aside>
            <Card className="sticky top-20">
              <CardContent className="space-y-3 p-5">
                <h2 className="font-heading text-xl font-semibold">Ringkasan Tempahan</h2>
                {selected.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada slot dipilih. Klik slot <span className="font-medium text-success">kosong</span> pada
                    kalendar.
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {selected.map((s) => (
                      <li key={s} className="flex items-center justify-between rounded-md bg-secondary/60 px-2.5 py-1.5">
                        <span>{format(new Date(s), "EEE, d MMM", { locale: ms })}</span>
                        <span className="font-heading font-semibold">{format(new Date(s), "HH:mm")}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Jumlah</span>
                  <span className="font-heading text-2xl font-bold text-primary">{centsToRM(totalPriceCents)}</span>
                </div>
                {step === "select" && (
                  <Button
                    className="w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
                    disabled={selected.length === 0}
                    onClick={() => setStep("contact")}
                  >
                    Seterusnya
                  </Button>
                )}
                {step === "contact" && (
                  <Button variant="outline" className="w-full" onClick={() => setStep("select")}>
                    Kembali ke Kalendar
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

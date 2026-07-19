"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, startOfDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useCourt } from "@/hooks/useFacilities";
import { useCreateHold } from "@/hooks/useCreateHold";
import { SlotGrid } from "@/components/booking/slot-grid";
import { WeekStrip } from "@/components/booking/week-strip";
import { StatusLegend } from "@/components/booking/status-legend";
import { ContactForm } from "@/components/booking/contact-form";
import { HoldCountdown } from "@/components/booking/hold-countdown";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { centsToRM } from "@/lib/utils/money";
import type { ContactDetailsInput } from "@/lib/validation/booking.schema";

type Step = "select" | "contact" | "hold";
type CalendarView = "day" | "week";

export default function BookCourtPage({ params }: { params: Promise<{ courtId: string }> }) {
  const { courtId } = use(params);
  const router = useRouter();
  const { data: court, isLoading } = useCourt(courtId);
  const createHold = useCreateHold(courtId);

  const [day, setDay] = useState(() => startOfDay(new Date()));
  const [view, setView] = useState<CalendarView>("day");
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("select");
  const [holdBooking, setHoldBooking] = useState<{ id: string; code: string; holdExpiresAt: string } | null>(null);

  const rangeStart = day;
  const rangeEnd = addDays(day, 1);
  const isPast = rangeStart < startOfDay(new Date());

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
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-6 h-64 w-full rounded-xl" />
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
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <p className="text-muted-foreground">Gelanggang tidak dijumpai.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-secondary/30">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{court.sport.name}</p>
            <h1 className="font-heading text-2xl font-bold">{court.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {centsToRM(court.hourlyPriceCents)}/jam · Kapasiti {court.capacity}
            </p>

            {step === "select" && (
              <Card className="mt-6">
                <CardContent className="space-y-4 p-5">
                  <Tabs value={view} onValueChange={(v) => setView((v as CalendarView) ?? "day")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="day">Hari</TabsTrigger>
                      <TabsTrigger value="week">Minggu</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {view === "week" && (
                    <WeekStrip
                      courtId={courtId}
                      weekStart={startOfWeek(day, { weekStartsOn: 1 })}
                      selectedDay={day}
                      onSelectDay={(d) => {
                        setDay(startOfDay(d));
                        setView("day");
                      }}
                    />
                  )}

                  {view === "day" && (
                    <>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isPast}
                          onClick={() => setDay((d) => addDays(d, -1))}
                          aria-label="Hari sebelumnya"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <p className="font-heading font-semibold">{format(day, "EEEE, d MMMM yyyy")}</p>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDay((d) => addDays(d, 1))}
                          aria-label="Hari seterusnya"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <StatusLegend />

                      <SlotGrid
                        courtId={courtId}
                        day={day}
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        selected={selected}
                        onToggle={toggleSlot}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "contact" && (
              <Card className="mt-6">
                <CardContent className="p-5">
                  <h2 className="mb-4 font-heading text-lg font-semibold">Butiran Hubungan</h2>
                  <ContactForm onSubmit={handleContactSubmit} submitting={createHold.isPending} />
                </CardContent>
              </Card>
            )}

            {step === "hold" && holdBooking && (
              <div className="mt-6">
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
              </div>
            )}
          </div>

          <aside>
            <Card className="sticky top-20">
              <CardContent className="space-y-3 p-5">
                <h2 className="font-heading text-base font-semibold">Ringkasan Tempahan</h2>
                {selected.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada slot dipilih.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {selected.map((s) => (
                      <li key={s} className="flex justify-between">
                        <span>{format(new Date(s), "d MMM, HH:mm")}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Jumlah</span>
                  <span className="font-heading text-lg font-bold text-primary">{centsToRM(totalPriceCents)}</span>
                </div>
                {step === "select" && (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={selected.length === 0}
                    onClick={() => setStep("contact")}
                  >
                    Seterusnya
                  </Button>
                )}
                {step === "contact" && (
                  <Button variant="outline" className="w-full" onClick={() => setStep("select")}>
                    Kembali Pilih Slot
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

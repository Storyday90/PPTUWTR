import { prisma } from "@/lib/prisma";
import { addMinutes, generateSlotGrid } from "@/lib/utils/date";
import { eachDayOfInterval, startOfDay } from "date-fns";

export type SlotStatus = "AVAILABLE" | "HELD" | "CONFIRMED" | "CLOSED";

export interface SlotAvailability {
  slotStart: string; // ISO
  slotEnd: string; // ISO
  status: SlotStatus;
}

/**
 * Reads never mutate expired holds — they simply treat a HELD row whose
 * holdExpiresAt has passed as if it doesn't exist. The write path
 * (createHold) is what actually deletes expired holds, exactly when a new
 * claim needs the slot.
 */
export async function getCourtAvailability(
  courtId: string,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<SlotAvailability[]> {
  const court = await prisma.court.findUniqueOrThrow({ where: { id: courtId } });
  const now = new Date();

  const [occupiedSlots, blockedSlots] = await Promise.all([
    prisma.bookingSlot.findMany({
      where: {
        courtId,
        slotStart: { gte: rangeStart, lt: rangeEnd },
        OR: [{ status: "CONFIRMED" }, { status: "HELD", holdExpiresAt: { gt: now } }],
      },
      select: { slotStart: true, status: true },
    }),
    prisma.blockedSlot.findMany({
      where: {
        courtId,
        startAt: { lt: rangeEnd },
        endAt: { gt: rangeStart },
      },
      select: { startAt: true, endAt: true },
    }),
  ]);

  const occupiedByTime = new Map<number, SlotStatus>();
  for (const s of occupiedSlots) {
    occupiedByTime.set(s.slotStart.getTime(), s.status === "CONFIRMED" ? "CONFIRMED" : "HELD");
  }

  const isBlocked = (slotStart: Date, slotEnd: Date) =>
    blockedSlots.some((b) => b.startAt < slotEnd && b.endAt > slotStart);

  const days = eachDayOfInterval({ start: startOfDay(rangeStart), end: startOfDay(rangeEnd) });
  const result: SlotAvailability[] = [];

  for (const day of days) {
    const grid = generateSlotGrid(day, court.openTime, court.closeTime, court.slotMinutes);
    for (const slotStart of grid) {
      if (slotStart < rangeStart || slotStart >= rangeEnd) continue;
      const slotEnd = addMinutes(slotStart, court.slotMinutes);

      let status: SlotStatus = "AVAILABLE";
      const occupied = occupiedByTime.get(slotStart.getTime());
      if (occupied) {
        status = occupied;
      } else if (isBlocked(slotStart, slotEnd)) {
        status = "CLOSED";
      }

      result.push({ slotStart: slotStart.toISOString(), slotEnd: slotEnd.toISOString(), status });
    }
  }

  return result;
}

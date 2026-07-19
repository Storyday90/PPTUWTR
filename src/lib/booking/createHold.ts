import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { addMinutes } from "@/lib/utils/date";
import { generateBookingCode } from "@/lib/booking/bookingCode";
import { calcTotalPriceCents } from "@/lib/booking/pricing";
import { SlotConflictError } from "@/lib/booking/errors";

export const HOLD_MINUTES = 10;

export interface CreateHoldInput {
  courtId: string;
  slotStarts: Date[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  purpose?: string;
  notes?: string;
  userId?: string;
}

/** Transient contention (SQLite single-writer lock / Postgres serialization) — retry, not a real conflict. */
const TRANSIENT_ERROR_CODES = new Set(["P2034"]);

export async function createBookingHold(input: CreateHoldInput) {
  if (input.slotStarts.length === 0) {
    throw new Error("At least one slot must be selected.");
  }
  const sortedStarts = [...input.slotStarts].sort((a, b) => a.getTime() - b.getTime());

  const court = await prisma.court.findUniqueOrThrow({ where: { id: input.courtId } });
  if (!court.isActive) {
    throw new SlotConflictError("Gelanggang ini tidak aktif buat masa ini.");
  }

  const totalPriceCents = calcTotalPriceCents(court.hourlyPriceCents, court.slotMinutes, sortedStarts.length);

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await attemptCreateHold(input, sortedStarts, court.slotMinutes, totalPriceCents);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new SlotConflictError();
        }
        if (TRANSIENT_ERROR_CODES.has(err.code)) {
          lastError = err;
          continue; // retry
        }
      }
      throw err;
    }
  }
  throw lastError;
}

async function attemptCreateHold(
  input: CreateHoldInput,
  sortedStarts: Date[],
  slotMinutes: number,
  totalPriceCents: number,
) {
  const now = new Date();
  const holdExpiresAt = addMinutes(now, HOLD_MINUTES);
  const startAt = sortedStarts[0];
  const endAt = addMinutes(sortedStarts[sortedStarts.length - 1], slotMinutes);

  return prisma.$transaction(async (tx) => {
    // Free stale holds for exactly the slots we want, so an expired hold can
    // never block a legitimate new claim — freed right when it matters.
    await tx.bookingSlot.deleteMany({
      where: {
        courtId: input.courtId,
        slotStart: { in: sortedStarts },
        status: "HELD",
        holdExpiresAt: { lt: now },
      },
    });

    const blocked = await tx.blockedSlot.findFirst({
      where: {
        courtId: input.courtId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });
    if (blocked) {
      throw new SlotConflictError("Maaf, slot ini telah ditutup oleh pentadbir.");
    }

    const booking = await tx.booking.create({
      data: {
        code: generateBookingCode(now),
        userId: input.userId,
        courtId: input.courtId,
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        startAt,
        endAt,
        totalPriceCents,
        status: "PENDING_PAYMENT",
        purpose: input.purpose,
        notes: input.notes,
      },
    });

    // Atomically claim every requested slot. If ANY collides with an
    // existing HELD/CONFIRMED row, the unique index throws and this whole
    // transaction (including the booking row above) rolls back together.
    await tx.bookingSlot.createMany({
      data: sortedStarts.map((slotStart) => ({
        courtId: input.courtId,
        slotStart,
        slotEnd: addMinutes(slotStart, slotMinutes),
        status: "HELD",
        holdExpiresAt,
        bookingId: booking.id,
      })),
    });

    return { ...booking, holdExpiresAt };
  });
}

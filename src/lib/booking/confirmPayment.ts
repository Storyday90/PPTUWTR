import { prisma } from "@/lib/prisma";
import { HoldExpiredError, NotFoundError } from "@/lib/booking/errors";

/** Stub payment confirmation — always "succeeds" if the hold hasn't expired. Swap for a real gateway later. */
export async function confirmPayment(bookingId: string) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { slots: true },
    });
    if (!booking) throw new NotFoundError("Tempahan tidak dijumpai.");
    if (booking.status === "CONFIRMED") return booking; // idempotent
    if (booking.status !== "PENDING_PAYMENT") {
      throw new HoldExpiredError("Tempahan ini tidak lagi menunggu pembayaran.");
    }

    const expired = booking.slots.some((s) => !s.holdExpiresAt || s.holdExpiresAt < now);
    if (expired || booking.slots.length === 0) {
      await tx.bookingSlot.deleteMany({ where: { bookingId } });
      await tx.booking.update({ where: { id: bookingId }, data: { status: "EXPIRED" } });
      throw new HoldExpiredError();
    }

    await tx.bookingSlot.updateMany({
      where: { bookingId },
      data: { status: "CONFIRMED", holdExpiresAt: null },
    });

    const booking2 = await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });

    await tx.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        provider: "STUB",
        amountCents: booking.totalPriceCents,
        status: "PAID",
        paidAt: now,
      },
      update: { status: "PAID", paidAt: now },
    });

    return booking2;
  });
}

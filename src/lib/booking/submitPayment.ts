import { prisma } from "@/lib/prisma";
import { HoldExpiredError, NotFoundError } from "@/lib/booking/errors";
import { notifyAdmins } from "@/lib/notifications/service";
import { addMinutes } from "@/lib/utils/date";
import { centsToRM } from "@/lib/utils/money";

// Once the client claims they've paid, hold the slots long enough for an admin
// to verify the QR transfer landed (they aren't confirmed until then).
const VERIFY_WINDOW_MINUTES = 72 * 60;

/**
 * Client marks "Saya Dah Bayar" after scanning the QR. This does NOT confirm
 * the booking — it records the payment as SUBMITTED, extends the hold so it
 * survives verification, and pings admins to verify the transfer.
 */
export async function submitPayment(bookingId: string, reference?: string) {
  const now = new Date();
  const extendedHold = addMinutes(now, VERIFY_WINDOW_MINUTES);

  const booking = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { slots: true, court: true },
    });
    if (!booking) throw new NotFoundError("Tempahan tidak dijumpai.");
    if (booking.status !== "PENDING_PAYMENT") {
      throw new HoldExpiredError("Tempahan ini tidak lagi menunggu pembayaran.");
    }

    const expired = booking.slots.some((s) => !s.holdExpiresAt || s.holdExpiresAt < now);
    if (expired || booking.slots.length === 0) {
      await tx.bookingSlot.deleteMany({ where: { bookingId } });
      await tx.booking.update({ where: { id: bookingId }, data: { status: "EXPIRED" } });
      throw new HoldExpiredError();
    }

    // Extend the hold so it doesn't lapse while awaiting admin verification.
    await tx.bookingSlot.updateMany({
      where: { bookingId },
      data: { holdExpiresAt: extendedHold },
    });

    await tx.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        provider: "QR",
        providerRef: reference || null,
        amountCents: booking.totalPriceCents,
        status: "SUBMITTED",
        submittedAt: now,
      },
      update: { status: "SUBMITTED", submittedAt: now, providerRef: reference || null },
    });

    return booking;
  });

  await notifyAdmins({
    type: "PAYMENT_SUBMITTED",
    bookingId: booking.id,
    title: "Bayaran menunggu pengesahan 💳",
    body: `${booking.contactName} menandakan telah bayar ${centsToRM(
      booking.totalPriceCents,
    )} untuk ${booking.court.name} (${booking.code}). Sila sahkan.`,
  });

  return booking;
}

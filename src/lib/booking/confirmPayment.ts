import { prisma } from "@/lib/prisma";
import { HoldExpiredError, NotFoundError } from "@/lib/booking/errors";
import { notifyUser, sendEmail } from "@/lib/notifications/service";
import { centsToRM } from "@/lib/utils/money";
import { format } from "date-fns";
import { ms } from "date-fns/locale";

/**
 * Admin-verified payment confirmation. Called when an admin confirms that the
 * QR transfer actually landed. Flips the booking to CONFIRMED, marks the
 * payment PAID, then emails the client a payment/transaction confirmation and
 * drops an in-app notification.
 */
export async function confirmPayment(bookingId: string) {
  const now = new Date();

  const { booking, didConfirm } = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { slots: true, court: { include: { sport: true } }, payment: true },
    });
    if (!booking) throw new NotFoundError("Tempahan tidak dijumpai.");
    if (booking.status === "CONFIRMED") return { booking, didConfirm: false }; // idempotent
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
      include: { court: { include: { sport: true } }, payment: true },
    });

    await tx.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        provider: "QR",
        amountCents: booking.totalPriceCents,
        status: "PAID",
        paidAt: now,
      },
      update: { status: "PAID", paidAt: now },
    });

    return { booking: booking2, didConfirm: true };
  });

  if (didConfirm) {
    await afterConfirm(booking, now);
  }

  return booking;
}

interface ConfirmedBooking {
  id: string;
  code: string;
  contactName: string;
  contactEmail: string;
  userId: string | null;
  startAt: Date;
  endAt: Date;
  totalPriceCents: number;
  court: { name: string; sport: { name: string } };
  payment: { providerRef: string | null } | null;
}

async function afterConfirm(booking: ConfirmedBooking, paidAt: Date) {
  const when = `${format(new Date(booking.startAt), "EEEE, d MMMM yyyy · HH:mm", { locale: ms })}–${format(
    new Date(booking.endAt),
    "HH:mm",
  )}`;
  const ref = booking.payment?.providerRef ? `\nRujukan bayaran: ${booking.payment.providerRef}` : "";

  const emailBody = [
    `Salam ${booking.contactName},`,
    ``,
    `Pembayaran anda telah DISAHKAN dan tempahan anda kini aktif. Terima kasih!`,
    ``,
    `— RESIT TRANSAKSI —`,
    `Kod tempahan : ${booking.code}`,
    `Kemudahan    : ${booking.court.name} (${booking.court.sport.name})`,
    `Tarikh & masa: ${when}`,
    `Jumlah dibayar: ${centsToRM(booking.totalPriceCents)}`,
    `Kaedah       : QR (DuitNow)`,
    `Tarikh bayar : ${format(paidAt, "d MMM yyyy, HH:mm", { locale: ms })}${ref}`,
    ``,
    `Tunjukkan kod tempahan anda di kaunter. Jumpa di gelanggang!`,
    `— PPUWTR Arena`,
  ].join("\n");

  await sendEmail({
    to: booking.contactEmail,
    subject: `Pembayaran disahkan · ${booking.code} · PPUWTR Arena`,
    body: emailBody,
    type: "PAYMENT_CONFIRMED",
    bookingId: booking.id,
    userId: booking.userId ?? undefined,
  });

  if (booking.userId) {
    await notifyUser({
      userId: booking.userId,
      type: "PAYMENT_CONFIRMED",
      bookingId: booking.id,
      title: "Pembayaran disahkan ✅",
      body: `Tempahan ${booking.code} (${booking.court.name}) telah disahkan. Resit dihantar ke emel anda.`,
    });
  }
}

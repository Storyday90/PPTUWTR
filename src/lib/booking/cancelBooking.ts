import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/booking/errors";

export async function cancelBooking(bookingId: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundError("Tempahan tidak dijumpai.");
    if (booking.status === "CANCELLED") return booking;

    // Free the slots immediately by deleting them — this is what actually
    // opens the unique-constrained (courtId, slotStart) rows back up.
    await tx.bookingSlot.deleteMany({ where: { bookingId } });

    if (booking.status === "CONFIRMED") {
      await tx.payment.updateMany({ where: { bookingId }, data: { status: "REFUNDED" } });
    }

    return tx.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  });
}

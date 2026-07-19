import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { slots: true, court: { include: { sport: true } }, payment: true },
    });
    if (!booking) return jsonError("Tempahan tidak dijumpai.", 404, "NOT_FOUND");

    const holdExpiresAt = booking.slots[0]?.holdExpiresAt ?? null;

    return NextResponse.json({
      booking: {
        id: booking.id,
        code: booking.code,
        status: booking.status,
        startAt: booking.startAt,
        endAt: booking.endAt,
        totalPriceCents: booking.totalPriceCents,
        contactName: booking.contactName,
        contactPhone: booking.contactPhone,
        contactEmail: booking.contactEmail,
        purpose: booking.purpose,
        holdExpiresAt,
        court: { id: booking.court.id, name: booking.court.name, sport: booking.court.sport.name },
        payment: booking.payment ? { status: booking.payment.status } : null,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

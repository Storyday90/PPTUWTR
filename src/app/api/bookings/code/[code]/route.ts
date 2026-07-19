import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const booking = await prisma.booking.findUnique({
      where: { code },
      include: { court: { include: { sport: true } }, payment: true },
    });
    if (!booking) return jsonError("Tempahan tidak dijumpai. Sila semak kod tempahan anda.", 404, "NOT_FOUND");

    return NextResponse.json({
      booking: {
        id: booking.id,
        code: booking.code,
        status: booking.status,
        startAt: booking.startAt,
        endAt: booking.endAt,
        totalPriceCents: booking.totalPriceCents,
        contactName: booking.contactName,
        court: { name: booking.court.name, sport: booking.court.sport.name },
        payment: booking.payment ? { status: booking.payment.status } : null,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

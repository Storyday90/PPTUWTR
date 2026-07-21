import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    const session = await requireUser();

    // Catch both bookings tied to the account AND guest bookings made with the
    // same email before/without logging in.
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [{ userId: session.userId }, { contactEmail: session.email }],
      },
      orderBy: { startAt: "desc" },
      include: {
        court: { include: { sport: true } },
        payment: true,
      },
      take: 100,
    });

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        code: b.code,
        status: b.status,
        startAt: b.startAt,
        endAt: b.endAt,
        totalPriceCents: b.totalPriceCents,
        courtId: b.courtId,
        court: { name: b.court.name, sport: b.court.sport.name },
        payment: b.payment
          ? {
              status: b.payment.status,
              amountCents: b.payment.amountCents,
              paidAt: b.payment.paidAt,
              provider: b.payment.provider,
              providerRef: b.payment.providerRef,
            }
          : null,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

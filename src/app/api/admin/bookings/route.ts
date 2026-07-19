import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/respond";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: status ? { status } : undefined,
      include: { court: { include: { sport: true } }, payment: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        code: b.code,
        status: b.status,
        startAt: b.startAt,
        endAt: b.endAt,
        totalPriceCents: b.totalPriceCents,
        contactName: b.contactName,
        contactPhone: b.contactPhone,
        contactEmail: b.contactEmail,
        purpose: b.purpose,
        createdAt: b.createdAt,
        court: { id: b.court.id, name: b.court.name, sport: b.court.sport.name },
        payment: b.payment ? { status: b.payment.status } : null,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

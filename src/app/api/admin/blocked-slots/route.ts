import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { createBlockedSlotSchema } from "@/lib/validation/admin.schema";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const courtId = searchParams.get("courtId") ?? undefined;

    const blocked = await prisma.blockedSlot.findMany({
      where: courtId ? { courtId } : undefined,
      include: { court: true },
      orderBy: { startAt: "desc" },
      take: 200,
    });

    return NextResponse.json({
      blockedSlots: blocked.map((b) => ({
        id: b.id,
        courtId: b.courtId,
        courtName: b.court.name,
        startAt: b.startAt,
        endAt: b.endAt,
        reason: b.reason,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const input = createBlockedSlotSchema.parse(await req.json());
    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);

    const overlappingConfirmed = await prisma.bookingSlot.findFirst({
      where: { courtId: input.courtId, status: "CONFIRMED", slotStart: { gte: startAt, lt: endAt } },
    });
    if (overlappingConfirmed) {
      return jsonError(
        "Terdapat tempahan yang telah disahkan pada waktu ini. Sila batalkan tempahan tersebut dahulu.",
        409,
        "SLOT_CONFLICT",
      );
    }

    const blocked = await prisma.blockedSlot.create({
      data: { courtId: input.courtId, startAt, endAt, reason: input.reason, createdBy: admin.userId },
    });

    return NextResponse.json({ blockedSlot: blocked }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

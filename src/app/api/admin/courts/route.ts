import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { createCourtSchema } from "@/lib/validation/admin.schema";
import { shapeCourt } from "@/lib/facilities/shape";
import { toJson } from "@/lib/utils/json";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    await requireAdmin();
    const courts = await prisma.court.findMany({
      include: { sport: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ courts: courts.map(shapeCourt) });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const input = createCourtSchema.parse(await req.json());

    const court = await prisma.court.create({
      data: {
        facilityId: input.facilityId,
        sportId: input.sportId,
        name: input.name,
        description: input.description,
        capacity: input.capacity,
        hourlyPriceCents: input.hourlyPriceCents,
        amenitiesJson: toJson(input.amenities),
        photosJson: toJson([]),
        slotMinutes: input.slotMinutes,
        openTime: input.openTime,
        closeTime: input.closeTime,
      },
      include: { sport: true },
    });

    return NextResponse.json({ court: shapeCourt(court) }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

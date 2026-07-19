import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shapeCourt } from "@/lib/facilities/shape";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const court = await prisma.court.findUnique({
      where: { id },
      include: { sport: true, facility: true },
    });
    if (!court) return jsonError("Gelanggang tidak dijumpai.", 404, "NOT_FOUND");

    return NextResponse.json({
      court: {
        ...shapeCourt(court),
        facility: { id: court.facility.id, name: court.facility.name, slug: court.facility.slug },
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { updateCourtSchema } from "@/lib/validation/admin.schema";
import { shapeCourt } from "@/lib/facilities/shape";
import { toJson } from "@/lib/utils/json";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { amenities, ...rest } = updateCourtSchema.parse(await req.json());

    const court = await prisma.court.update({
      where: { id },
      data: {
        ...rest,
        amenitiesJson: amenities ? toJson(amenities) : undefined,
      },
      include: { sport: true },
    });

    return NextResponse.json({ court: shapeCourt(court) });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const court = await prisma.court.findUnique({ where: { id } });
    if (!court) return jsonError("Gelanggang tidak dijumpai.", 404, "NOT_FOUND");

    // Soft-deactivate rather than hard delete — preserves booking history/relations.
    await prisma.court.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}

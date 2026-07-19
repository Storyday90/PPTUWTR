import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shapeCourt } from "@/lib/facilities/shape";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const facility = await prisma.facility.findUnique({
      where: { slug },
      include: {
        courts: { where: { isActive: true }, include: { sport: true } },
      },
    });

    if (!facility) return jsonError("Kemudahan tidak dijumpai.", 404, "NOT_FOUND");

    return NextResponse.json({
      facility: {
        id: facility.id,
        name: facility.name,
        slug: facility.slug,
        description: facility.description,
        address: facility.address,
        mapUrl: facility.mapUrl,
        heroImage: facility.heroImage,
        courts: facility.courts.map(shapeCourt),
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

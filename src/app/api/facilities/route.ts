import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shapeCourt } from "@/lib/facilities/shape";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        courts: {
          where: { isActive: true },
          include: { sport: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const shaped = facilities.map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      description: f.description,
      address: f.address,
      mapUrl: f.mapUrl,
      heroImage: f.heroImage,
      courts: f.courts.map(shapeCourt),
    }));

    return NextResponse.json({ facilities: shaped });
  } catch (err) {
    return handleApiError(err);
  }
}

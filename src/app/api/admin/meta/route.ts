import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    await requireAdmin();
    const [facilities, sports] = await Promise.all([
      prisma.facility.findMany({ select: { id: true, name: true } }),
      prisma.sport.findMany({ select: { id: true, name: true } }),
    ]);
    return NextResponse.json({ facilities, sports });
  } catch (err) {
    return handleApiError(err);
  }
}

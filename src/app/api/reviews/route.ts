import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { createReviewSchema } from "@/lib/validation/review.schema";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET(req: Request) {
  try {
    const courtId = new URL(req.url).searchParams.get("courtId");
    if (!courtId) return jsonError("courtId diperlukan.", 400, "VALIDATION_ERROR");

    const reviews = await prisma.review.findMany({
      where: { courtId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const count = reviews.length;
    const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
      summary: { count, average: Math.round(average * 10) / 10 },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const input = createReviewSchema.parse(await req.json());

    const authorName = session?.name ?? input.authorName;
    if (!authorName) return jsonError("Sila masukkan nama anda.", 400, "VALIDATION_ERROR");

    const court = await prisma.court.findUnique({ where: { id: input.courtId } });
    if (!court) return jsonError("Gelanggang tidak dijumpai.", 404, "NOT_FOUND");

    const review = await prisma.review.create({
      data: {
        courtId: input.courtId,
        userId: session?.userId,
        authorName,
        rating: input.rating,
        comment: input.comment ? input.comment : null,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

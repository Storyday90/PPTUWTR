import { NextResponse } from "next/server";
import { startOfDay, addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getCourtAvailability } from "@/lib/booking/availability";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = addDays(todayStart, 1);

    const [totalCourts, bookingsToday, sportCount, activeCourts] = await Promise.all([
      prisma.court.count({ where: { isActive: true } }),
      prisma.booking.count({ where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } } }),
      prisma.sport.count(),
      prisma.court.findMany({ where: { isActive: true }, select: { id: true } }),
    ]);

    const availabilityPerCourt = await Promise.all(
      activeCourts.map((c) => getCourtAvailability(c.id, todayStart, todayEnd)),
    );
    const availableSlotsToday = availabilityPerCourt
      .flat()
      .filter((s) => s.status === "AVAILABLE").length;

    return NextResponse.json({ totalCourts, bookingsToday, availableSlotsToday, sportCount });
  } catch (err) {
    return handleApiError(err);
  }
}

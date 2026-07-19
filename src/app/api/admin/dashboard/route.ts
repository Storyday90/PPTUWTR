import { NextResponse } from "next/server";
import { startOfDay, startOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    await requireAdmin();
    const now = new Date();
    const todayStart = startOfDay(now);
    const monthStart = startOfMonth(now);

    const [revenueToday, revenueMonth, bookingsToday, pendingCount, activeCourts, confirmedSlotsToday] =
      await Promise.all([
        prisma.payment.aggregate({
          _sum: { amountCents: true },
          where: { status: "PAID", paidAt: { gte: todayStart } },
        }),
        prisma.payment.aggregate({
          _sum: { amountCents: true },
          where: { status: "PAID", paidAt: { gte: monthStart } },
        }),
        prisma.booking.count({ where: { createdAt: { gte: todayStart } } }),
        prisma.booking.count({ where: { status: "PENDING_PAYMENT" } }),
        prisma.court.findMany({ where: { isActive: true }, select: { openTime: true, closeTime: true, slotMinutes: true } }),
        prisma.bookingSlot.count({ where: { status: "CONFIRMED", slotStart: { gte: todayStart } } }),
      ]);

    const totalSlotsToday = activeCourts.reduce((sum, c) => {
      const [oh, om] = c.openTime.split(":").map(Number);
      const [ch, cm] = c.closeTime.split(":").map(Number);
      const minutes = ch * 60 + cm - (oh * 60 + om);
      return sum + Math.max(0, Math.floor(minutes / c.slotMinutes));
    }, 0);

    const utilizationRate = totalSlotsToday > 0 ? confirmedSlotsToday / totalSlotsToday : 0;

    const recentBookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { court: { include: { sport: true } } },
    });

    return NextResponse.json({
      revenueTodayCents: revenueToday._sum.amountCents ?? 0,
      revenueMonthCents: revenueMonth._sum.amountCents ?? 0,
      bookingsToday,
      pendingCount,
      totalCourts: activeCourts.length,
      utilizationRate,
      recentBookings: recentBookings.map((b) => ({
        id: b.id,
        code: b.code,
        status: b.status,
        contactName: b.contactName,
        startAt: b.startAt,
        totalPriceCents: b.totalPriceCents,
        court: { name: b.court.name, sport: b.court.sport.name },
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

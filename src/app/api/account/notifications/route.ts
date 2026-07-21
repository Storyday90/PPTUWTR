import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/respond";
import { fromJson } from "@/lib/utils/json";

export async function GET() {
  try {
    const session = await requireUser();
    const rows = await prisma.notification.findMany({
      where: { userId: session.userId, channel: "INAPP" },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const notifications = rows.map((n) => {
      const payload = fromJson<{ title?: string; body?: string }>(n.payloadJson, {});
      return {
        id: n.id,
        type: n.type,
        bookingId: n.bookingId,
        title: payload.title ?? "Notifikasi",
        body: payload.body ?? "",
        readAt: n.readAt,
        createdAt: n.createdAt,
      };
    });

    return NextResponse.json({
      notifications,
      unread: notifications.filter((n) => !n.readAt).length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Mark all (or one) of the user's in-app notifications as read. */
export async function POST(req: Request) {
  try {
    const session = await requireUser();
    let id: string | undefined;
    try {
      const body = await req.json();
      if (typeof body?.id === "string") id = body.id;
    } catch {
      // mark-all when no body
    }
    await prisma.notification.updateMany({
      where: { userId: session.userId, channel: "INAPP", readAt: null, ...(id ? { id } : {}) },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}

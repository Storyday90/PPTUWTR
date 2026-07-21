import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { profileSchema } from "@/lib/validation/account.schema";
import { handleApiError, jsonError } from "@/lib/api/respond";

export async function GET() {
  try {
    const session = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    if (!user) return jsonError("Pengguna tidak dijumpai.", 404, "NOT_FOUND");
    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const input = profileSchema.parse(body);

    // Guard email uniqueness — allow keeping your own email, block taking someone else's.
    const emailOwner = await prisma.user.findUnique({ where: { email: input.email } });
    if (emailOwner && emailOwner.id !== session.userId) {
      return jsonError("Emel ini telah digunakan oleh akaun lain.", 409, "EMAIL_IN_USE");
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone ? input.phone : null,
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

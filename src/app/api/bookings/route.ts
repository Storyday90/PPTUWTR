import { NextResponse } from "next/server";
import { createBookingSchema } from "@/lib/validation/booking.schema";
import { createBookingHold } from "@/lib/booking/createHold";
import { handleApiError, tooManyRequests } from "@/lib/api/respond";
import { rateLimit, clientIp } from "@/lib/api/rateLimit";
// NOTE: wired up to the real session in the auth step — see src/lib/auth/session.ts.
import { getOptionalUserId } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`create-booking:${clientIp(req)}`, 20, 60_000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const body = await req.json();
    const input = createBookingSchema.parse(body);
    const userId = await getOptionalUserId();

    const booking = await createBookingHold({
      courtId: input.courtId,
      slotStarts: input.slotStarts.map((s) => new Date(s)),
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      purpose: input.purpose,
      notes: input.notes,
      userId,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

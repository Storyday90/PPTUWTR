import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { bookingActionSchema } from "@/lib/validation/admin.schema";
import { confirmPayment } from "@/lib/booking/confirmPayment";
import { cancelBooking } from "@/lib/booking/cancelBooking";
import { handleApiError } from "@/lib/api/respond";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { action } = bookingActionSchema.parse(await req.json());

    // Admin approve/cancel reuse the exact same domain functions the public
    // flow uses — one source of truth for how a booking is confirmed or freed.
    const booking = action === "approve" ? await confirmPayment(id) : await cancelBooking(id);

    return NextResponse.json({ booking });
  } catch (err) {
    return handleApiError(err);
  }
}

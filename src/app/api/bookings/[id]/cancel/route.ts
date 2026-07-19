import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/booking/cancelBooking";
import { handleApiError } from "@/lib/api/respond";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await cancelBooking(id);
    return NextResponse.json({ booking });
  } catch (err) {
    return handleApiError(err);
  }
}

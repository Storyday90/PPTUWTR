import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/booking/confirmPayment";
import { handleApiError } from "@/lib/api/respond";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await confirmPayment(id);
    return NextResponse.json({ booking });
  } catch (err) {
    return handleApiError(err);
  }
}

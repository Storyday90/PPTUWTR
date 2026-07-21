import { NextResponse } from "next/server";
import { submitPayment } from "@/lib/booking/submitPayment";
import { handleApiError } from "@/lib/api/respond";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    let reference: string | undefined;
    try {
      const body = await req.json();
      if (typeof body?.reference === "string") reference = body.reference.trim() || undefined;
    } catch {
      // no body is fine
    }
    const booking = await submitPayment(id, reference);
    return NextResponse.json({ booking });
  } catch (err) {
    return handleApiError(err);
  }
}

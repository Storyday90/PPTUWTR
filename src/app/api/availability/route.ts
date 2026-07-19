import { NextResponse } from "next/server";
import { availabilityQuerySchema } from "@/lib/validation/booking.schema";
import { getCourtAvailability } from "@/lib/booking/availability";
import { handleApiError } from "@/lib/api/respond";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = availabilityQuerySchema.parse({
      courtId: searchParams.get("courtId"),
      start: searchParams.get("start"),
      end: searchParams.get("end"),
    });

    const slots = await getCourtAvailability(parsed.courtId, new Date(parsed.start), new Date(parsed.end));

    return NextResponse.json({ courtId: parsed.courtId, slots });
  } catch (err) {
    return handleApiError(err);
  }
}

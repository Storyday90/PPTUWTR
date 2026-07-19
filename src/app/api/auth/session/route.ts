import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/respond";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ user: session });
  } catch (err) {
    return handleApiError(err);
  }
}

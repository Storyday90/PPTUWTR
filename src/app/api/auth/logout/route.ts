import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authProvider, SESSION_COOKIE } from "@/lib/auth";
import { handleApiError } from "@/lib/api/respond";

export async function POST() {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (token) await authProvider.logout(token);
    store.delete(SESSION_COOKIE);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}

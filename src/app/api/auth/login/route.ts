import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authProvider, SESSION_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth.schema";
import { handleApiError, tooManyRequests } from "@/lib/api/respond";
import { rateLimit, clientIp } from "@/lib/api/rateLimit";

export async function POST(req: Request) {
  try {
    const limit = rateLimit(`login:${clientIp(req)}`, 10, 60_000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const body = await req.json();
    const input = loginSchema.parse(body);
    const { token, expiresAt, user } = await authProvider.login(input);

    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

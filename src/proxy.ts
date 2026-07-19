import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// Cheap edge-side gate: only checks the cookie exists (no DB call — better-sqlite3
// needs the Node runtime). The real ADMIN role check happens in
// src/app/(admin)/admin/layout.tsx, which runs server-side with full DB access.
export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

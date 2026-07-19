import { cookies } from "next/headers";
import { authProvider, SESSION_COOKIE } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth/provider";
import { UnauthorizedError, ForbiddenError } from "@/lib/auth/errors";

export async function getSession(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return authProvider.validateSession(token);
}

export async function getOptionalUserId(): Promise<string | undefined> {
  const session = await getSession();
  return session?.userId;
}

export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

export async function requireAdmin(): Promise<AuthUser> {
  const session = await requireUser();
  if (session.role !== "ADMIN") throw new ForbiddenError();
  return session;
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { SlotConflictError, HoldExpiredError, NotFoundError } from "@/lib/booking/errors";
import { UnauthorizedError, ForbiddenError, EmailInUseError, InvalidCredentialsError } from "@/lib/auth/errors";

export function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json({ error: code ?? "ERROR", message }, { status });
}

export function tooManyRequests(retryAfterSeconds: number) {
  const res = jsonError("Terlalu banyak percubaan. Sila cuba lagi sebentar.", 429, "RATE_LIMITED");
  res.headers.set("Retry-After", String(retryAfterSeconds));
  return res;
}

/** Maps known domain errors to the right HTTP status; rethrows anything unexpected. */
export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError(err.issues[0]?.message ?? "Data tidak sah.", 400, "VALIDATION_ERROR");
  }
  if (err instanceof SlotConflictError) {
    return jsonError(err.message, 409, "SLOT_CONFLICT");
  }
  if (err instanceof HoldExpiredError) {
    return jsonError(err.message, 410, "HOLD_EXPIRED");
  }
  if (err instanceof NotFoundError) {
    return jsonError(err.message, 404, "NOT_FOUND");
  }
  if (err instanceof UnauthorizedError) {
    return jsonError(err.message, 401, "UNAUTHORIZED");
  }
  if (err instanceof ForbiddenError) {
    return jsonError(err.message, 403, "FORBIDDEN");
  }
  if (err instanceof EmailInUseError) {
    return jsonError(err.message, 409, "EMAIL_IN_USE");
  }
  if (err instanceof InvalidCredentialsError) {
    return jsonError(err.message, 401, "INVALID_CREDENTIALS");
  }
  console.error(err);
  return jsonError("Ralat pelayan dalaman.", 500, "INTERNAL_ERROR");
}

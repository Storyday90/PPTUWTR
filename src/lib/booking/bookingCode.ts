import { format } from "date-fns";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

function randomSuffix(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/** Human-friendly booking reference, e.g. PPUWTR-20260719-4F2K */
export function generateBookingCode(now: Date): string {
  return `PPUWTR-${format(now, "yyyyMMdd")}-${randomSuffix(4)}`;
}

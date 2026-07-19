export function centsToRM(cents: number): string {
  return `RM ${(cents / 100).toFixed(2)}`;
}

export function rmToCents(rm: number): number {
  return Math.round(rm * 100);
}

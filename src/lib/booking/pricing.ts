export function calcTotalPriceCents(hourlyPriceCents: number, slotMinutes: number, slotCount: number): number {
  return Math.round(hourlyPriceCents * (slotMinutes / 60) * slotCount);
}

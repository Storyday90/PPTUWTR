import { addMinutes, format, parse, startOfDay } from "date-fns";

export { addMinutes };

/** Parses "HH:mm" against a given day and returns the resulting Date. */
export function timeOnDay(day: Date, time: string): Date {
  return parse(time, "HH:mm", startOfDay(day));
}

/** Builds the list of slot-start Date objects for one court on one day. */
export function generateSlotGrid(day: Date, openTime: string, closeTime: string, slotMinutes: number): Date[] {
  const open = timeOnDay(day, openTime);
  const close = timeOnDay(day, closeTime);
  const slots: Date[] = [];
  let cursor = open;
  while (cursor < close) {
    slots.push(cursor);
    cursor = addMinutes(cursor, slotMinutes);
  }
  return slots;
}

export function isoDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

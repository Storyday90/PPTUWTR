import { z } from "zod";

export const createCourtSchema = z.object({
  facilityId: z.string().min(1),
  sportId: z.string().min(1),
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
  capacity: z.coerce.number().int().positive(),
  hourlyPriceCents: z.coerce.number().int().nonnegative(),
  amenities: z.array(z.string()).optional().default([]),
  slotMinutes: z.coerce.number().int().positive().optional().default(60),
  openTime: z.string().optional().default("08:00"),
  closeTime: z.string().optional().default("23:00"),
});

export const updateCourtSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  hourlyPriceCents: z.coerce.number().int().nonnegative().optional(),
  amenities: z.array(z.string()).optional(),
  slotMinutes: z.coerce.number().int().positive().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createBlockedSlotSchema = z.object({
  courtId: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  reason: z.string().trim().min(2, "Sila nyatakan sebab penutupan."),
});

export const bookingActionSchema = z.object({
  action: z.enum(["approve", "cancel"]),
});

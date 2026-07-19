import { z } from "zod";

export const availabilityQuerySchema = z.object({
  courtId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const createBookingSchema = z.object({
  courtId: z.string().min(1),
  slotStarts: z.array(z.string().datetime()).min(1, "Sila pilih sekurang-kurangnya satu slot."),
  contactName: z.string().trim().min(2, "Sila masukkan nama penuh."),
  contactPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Sila masukkan nombor telefon yang sah."),
  contactEmail: z.string().trim().email("Sila masukkan alamat emel yang sah."),
  purpose: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const contactDetailsSchema = createBookingSchema.pick({
  contactName: true,
  contactPhone: true,
  contactEmail: true,
  purpose: true,
  notes: true,
});

export type ContactDetailsInput = z.infer<typeof contactDetailsSchema>;

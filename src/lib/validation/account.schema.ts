import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Sila masukkan nama penuh."),
  email: z.string().trim().email("Sila masukkan alamat emel yang sah."),
  phone: z
    .string()
    .trim()
    .max(20, "Nombor telefon terlalu panjang.")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormInput = z.infer<typeof profileSchema>;

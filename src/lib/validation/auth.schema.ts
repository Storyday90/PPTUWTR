import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Sila masukkan nama penuh."),
  email: z.string().trim().email("Sila masukkan alamat emel yang sah."),
  phone: z.string().trim().optional(),
  password: z.string().min(8, "Kata laluan mesti sekurang-kurangnya 8 aksara."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Sila masukkan alamat emel yang sah."),
  password: z.string().min(1, "Sila masukkan kata laluan."),
});

export type RegisterFormInput = z.infer<typeof registerSchema>;
export type LoginFormInput = z.infer<typeof loginSchema>;

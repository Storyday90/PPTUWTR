import { z } from "zod";

export const createReviewSchema = z.object({
  courtId: z.string().min(1, "Gelanggang diperlukan."),
  rating: z.coerce.number().int().min(1, "Sila beri penilaian.").max(5),
  comment: z.string().trim().max(500, "Ulasan terlalu panjang.").optional().or(z.literal("")),
  authorName: z.string().trim().min(2, "Sila masukkan nama anda.").max(60).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

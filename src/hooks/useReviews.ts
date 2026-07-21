"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateReviewInput } from "@/lib/validation/review.schema";

export interface CourtReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: CourtReview[];
  summary: { count: number; average: number };
}

export function useReviews(courtId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", courtId],
    enabled: Boolean(courtId),
    queryFn: async (): Promise<ReviewsResponse> => {
      const res = await fetch(`/api/reviews?courtId=${courtId}`);
      if (!res.ok) return { reviews: [], summary: { count: 0, average: 0 } };
      return res.json();
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Gagal menghantar ulasan.");
      return data.review;
    },
    onSuccess: (_d, input) => qc.invalidateQueries({ queryKey: ["reviews", input.courtId] }),
  });
}

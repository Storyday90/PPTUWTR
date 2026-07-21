"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProfileFormInput } from "@/lib/validation/account.schema";

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt?: string;
}

export interface AccountBooking {
  id: string;
  code: string;
  status: string;
  startAt: string;
  endAt: string;
  totalPriceCents: number;
  courtId: string;
  court: { name: string; sport: string };
  payment: {
    status: string;
    amountCents: number;
    paidAt: string | null;
    provider: string;
    providerRef: string | null;
  } | null;
}

export function useProfile() {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: async (): Promise<AccountProfile> => {
      const res = await fetch("/api/account/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Gagal memuatkan profil.");
      return data.user;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProfileFormInput): Promise<AccountProfile> => {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Gagal mengemas kini profil.");
      return data.user;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["account", "profile"] });
      qc.invalidateQueries({ queryKey: ["session"] });
    },
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ["account", "bookings"],
    queryFn: async (): Promise<AccountBooking[]> => {
      const res = await fetch("/api/account/bookings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Gagal memuatkan sejarah tempahan.");
      return data.bookings;
    },
  });
}

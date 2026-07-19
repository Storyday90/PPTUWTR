"use client";

import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Gagal memuatkan papan pemuka.");
      return res.json();
    },
    refetchInterval: 30_000,
  });
}

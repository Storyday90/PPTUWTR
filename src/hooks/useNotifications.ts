"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AppNotification {
  id: string;
  type: string;
  bookingId: string | null;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    enabled,
    refetchInterval: 30_000,
    queryFn: async (): Promise<{ notifications: AppNotification[]; unread: number }> => {
      const res = await fetch("/api/account/notifications");
      if (!res.ok) return { notifications: [], unread: 0 };
      return res.json();
    },
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id?: string) => {
      await fetch("/api/account/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : {}),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

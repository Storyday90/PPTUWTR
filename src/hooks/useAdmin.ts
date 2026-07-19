"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getJson(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Ralat berlaku.");
  return data;
}

async function sendJson(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Ralat berlaku.");
  return data;
}

export function useAdminBookings(status?: string) {
  return useQuery({
    queryKey: ["admin-bookings", status ?? "all"],
    queryFn: async () => {
      const qs = status ? `?status=${status}` : "";
      const data = await getJson(`/api/admin/bookings${qs}`);
      return data.bookings;
    },
  });
}

export function useAdminBookingAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "cancel" }) =>
      sendJson(`/api/admin/bookings/${id}`, "PATCH", { action }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
}

export function useAdminMeta() {
  return useQuery({
    queryKey: ["admin-meta"],
    queryFn: () => getJson("/api/admin/meta"),
  });
}

export function useAdminCourts() {
  return useQuery({
    queryKey: ["admin-courts"],
    queryFn: async () => (await getJson("/api/admin/courts")).courts,
  });
}

export function useCreateCourt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: unknown) => sendJson("/api/admin/courts", "POST", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courts"] }),
  });
}

export function useUpdateCourt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: unknown }) =>
      sendJson(`/api/admin/courts/${id}`, "PATCH", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courts"] }),
  });
}

export function useDeactivateCourt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendJson(`/api/admin/courts/${id}`, "DELETE"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courts"] }),
  });
}

export function useAdminBlockedSlots() {
  return useQuery({
    queryKey: ["admin-blocked-slots"],
    queryFn: async () => (await getJson("/api/admin/blocked-slots")).blockedSlots,
  });
}

export function useCreateBlockedSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: unknown) => sendJson("/api/admin/blocked-slots", "POST", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blocked-slots"] }),
  });
}

export function useDeleteBlockedSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendJson(`/api/admin/blocked-slots/${id}`, "DELETE"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blocked-slots"] }),
  });
}

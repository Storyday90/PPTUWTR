"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginFormInput, RegisterFormInput } from "@/lib/validation/auth.schema";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message ?? "Ralat berlaku.") as Error & { code?: string };
    err.code = data.error;
    throw err;
  }
  return data;
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      return data.user as { userId: string; name: string; email: string; role: string } | null;
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginFormInput) => postJson("/api/auth/login", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["session"] }),
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterFormInput) => postJson("/api/auth/register", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["session"] }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => postJson("/api/auth/logout", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["session"] }),
  });
}

"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetIso: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetIso) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  const remainingMs = targetIso ? Math.max(0, new Date(targetIso).getTime() - now) : null;
  const minutes = remainingMs !== null ? Math.floor(remainingMs / 60_000) : null;
  const seconds = remainingMs !== null ? Math.floor((remainingMs % 60_000) / 1000) : null;

  return { remainingMs, minutes, seconds, expired: remainingMs !== null && remainingMs <= 0 };
}

import type { SlotStatus } from "@/lib/types";

export const SLOT_STATUS_META: Record<
  SlotStatus,
  { label: string; dot: string; badgeClass: string; selectable: boolean }
> = {
  AVAILABLE: {
    label: "Kosong",
    dot: "bg-success",
    badgeClass: "border-success/40 bg-white text-success hover:bg-success/10",
    selectable: true,
  },
  HELD: {
    label: "Menunggu Bayaran",
    dot: "bg-amber-500",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-700",
    selectable: false,
  },
  CONFIRMED: {
    label: "Penuh",
    dot: "bg-destructive",
    badgeClass: "border-destructive bg-destructive text-white",
    selectable: false,
  },
  CLOSED: {
    label: "Ditutup",
    dot: "bg-slate-400",
    badgeClass: "border-transparent bg-muted text-muted-foreground/60",
    selectable: false,
  },
};

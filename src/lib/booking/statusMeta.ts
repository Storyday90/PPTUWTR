import type { SlotStatus } from "@/lib/types";

export const SLOT_STATUS_META: Record<
  SlotStatus,
  { label: string; dot: string; badgeClass: string; selectable: boolean }
> = {
  AVAILABLE: {
    label: "Kosong",
    dot: "bg-success",
    badgeClass: "bg-success/10 text-success border-success/30",
    selectable: true,
  },
  HELD: {
    label: "Menunggu Bayaran",
    dot: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-300",
    selectable: false,
  },
  CONFIRMED: {
    label: "Ditempah",
    dot: "bg-destructive",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/30",
    selectable: false,
  },
  CLOSED: {
    label: "Ditutup",
    dot: "bg-slate-500",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-300",
    selectable: false,
  },
};

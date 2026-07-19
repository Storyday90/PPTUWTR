export const BOOKING_STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  PENDING_PAYMENT: { label: "Menunggu Pembayaran", badgeClass: "bg-amber-50 text-amber-700 border-amber-300" },
  CONFIRMED: { label: "Disahkan", badgeClass: "bg-success/10 text-success border-success/30" },
  CANCELLED: { label: "Dibatalkan", badgeClass: "bg-slate-100 text-slate-600 border-slate-300" },
  EXPIRED: { label: "Tamat Tempoh", badgeClass: "bg-destructive/10 text-destructive border-destructive/30" },
};

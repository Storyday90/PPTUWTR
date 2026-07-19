import { SLOT_STATUS_META } from "@/lib/booking/statusMeta";

export function StatusLegend({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className ?? ""}`}>
      {Object.entries(SLOT_STATUS_META).map(([status, meta]) => (
        <div key={status} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <span className="text-muted-foreground">{meta.label}</span>
        </div>
      ))}
    </div>
  );
}

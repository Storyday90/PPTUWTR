const LEGEND = [
  { label: "Kosong — boleh ditempah", swatch: "border border-success/40 bg-white" },
  { label: "Dipilih", swatch: "bg-primary" },
  { label: "Penuh", swatch: "bg-destructive" },
  { label: "Menunggu bayaran", swatch: "border border-amber-300 bg-amber-50" },
  { label: "Ditutup", swatch: "bg-muted" },
];

export function StatusLegend({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs ${className ?? ""}`}>
      {LEGEND.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-sm ${item.swatch}`} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

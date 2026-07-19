/** Subtle repeating court-line texture used as a decorative background overlay. */
export function CourtLinesPattern({ className }: { className?: string }) {
  const id = "court-lines";
  return (
    <svg className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <rect x="4" y="4" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="28" y1="4" x2="28" y2="52" stroke="currentColor" strokeWidth="1" />
          <circle cx="28" cy="28" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

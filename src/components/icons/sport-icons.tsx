import { Presentation, type LucideProps } from "lucide-react";

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Shuttlecock — a compact dome with a narrow feather fan, unique silhouette at a glance. */
export function BadmintonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.5 15.5a3.5 3.5 0 0 1 7 0Z" />
      <path d="M12 15.5V6M12 15.5 9 6.8M12 15.5l3-8.7" />
    </svg>
  );
}

/** Tall rounded paddle face — no handle, so it can't be mistaken for a balloon/mic glyph. */
export function PickleballIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="6.5" y="3" width="11" height="16" rx="5.5" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Round paddle paired with a separate ball — the pairing reads as table tennis without needing a handle. */
export function PingPongIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="10" cy="13" r="7" />
      <circle cx="19" cy="5.5" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FutsalIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2 15.5 9.8 14.2 14 9.8 14 8.5 9.8Z" />
      <path d="M12 7.2V3.6M15.5 9.8l3.4-1.1M14.2 14l2.1 2.9M9.8 14l-2.1 2.9M8.5 9.8 5.1 8.7" opacity="0.7" />
    </svg>
  );
}

export const SPORT_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  badminton: BadmintonIcon,
  pickleball: PickleballIcon,
  futsal: FutsalIcon,
  "ping-pong": PingPongIcon,
  "dewan-seminar": (props: IconProps) => <Presentation {...(props as LucideProps)} strokeWidth={1.8} />,
};

export function SportIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = SPORT_ICONS[slug];
  if (!Icon) return <Presentation className={className} strokeWidth={1.8} />;
  return <Icon className={className} />;
}

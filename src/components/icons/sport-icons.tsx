import { Feather, Volleyball, CircleDot, Presentation, type LucideProps } from "lucide-react";

type IconProps = { className?: string };

/** Distinct paddle-face silhouette (no handle) — avoids the "balloon/lollipop" read of a circle-on-a-stick glyph. */
function PickleballIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="6" />
    </svg>
  );
}

export const SPORT_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  badminton: (props: IconProps) => <Feather {...(props as LucideProps)} strokeWidth={1.8} />,
  pickleball: PickleballIcon,
  futsal: (props: IconProps) => <Volleyball {...(props as LucideProps)} strokeWidth={1.8} />,
  "ping-pong": (props: IconProps) => <CircleDot {...(props as LucideProps)} strokeWidth={1.8} />,
  "dewan-seminar": (props: IconProps) => <Presentation {...(props as LucideProps)} strokeWidth={1.8} />,
};

export function SportIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = SPORT_ICONS[slug];
  if (!Icon) return <Presentation className={className} strokeWidth={1.8} />;
  return <Icon className={className} />;
}

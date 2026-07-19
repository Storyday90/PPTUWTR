const SPORTS = ["Badminton", "Pickleball", "Futsal", "Ping Pong", "Dewan Seminar"];

function TickerRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {SPORTS.map((name) => (
        <span key={name} className="flex items-center">
          <span className="px-6 font-heading text-lg font-bold uppercase tracking-[0.15em] sm:px-8 sm:text-xl">
            {name}
          </span>
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-pitch/40" />
        </span>
      ))}
    </div>
  );
}

/** Editorial gold ticker — the sports on offer, on loop. */
export function SportsTicker() {
  return (
    <div className="overflow-hidden border-y border-pitch/10 bg-accent py-3 text-accent-foreground">
      <div className="flex w-max animate-ticker">
        <TickerRow />
        <TickerRow ariaHidden />
      </div>
    </div>
  );
}

const SPORTS = ["Badminton", "Pickleball", "Futsal", "Ping Pong", "Dewan Seminar"];

function TickerRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {SPORTS.map((name) => (
        <span key={name} className="flex items-center">
          <span className="display px-6 text-lg sm:px-8 sm:text-2xl">{name}</span>
          <span aria-hidden className="h-2 w-2 rotate-45 bg-accent-foreground/50" />
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

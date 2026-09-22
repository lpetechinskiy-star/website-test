const ITEMS = [
  'имплантация',
  'без боли',
  'детский приём',
  'отбеливание',
  'элайнеры',
  'цифровой снимок',
  'гарантия',
  'гигиена',
];

/** Slow ticker strip that keeps the page alive between hero and services. */
export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/60 py-4">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 pr-10 will-change-transform motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-10" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span
                key={item}
                className="flex items-center gap-10 font-display text-sm tracking-[0.18em] text-muted-foreground uppercase"
              >
                {item}
                <span className="size-1.5 rounded-full bg-blush" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

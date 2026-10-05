'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Card that lights up under the cursor: the pointer position is written to CSS
 * variables and a radial highlight follows it. Falls back to a plain card when
 * nothing hovers (touch, keyboard).
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-7',
        'transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 hover:shadow-[0_24px_60px_-28px_rgba(111,91,208,0.55)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), rgba(111,91,208,0.12), transparent 65%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

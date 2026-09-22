import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * One sweep of curved strokes. The shape comes from the original component;
 * the motion no longer does: instead of animating 36 paths per layer from
 * JavaScript, the whole layer drifts with one composited CSS transform, which
 * costs the main thread nothing.
 */
function PathField({ count, className }: { count: number; className?: string }) {
  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 11} -${189 + i * 13}C-${380 - i * 11} -${189 + i * 13} -${312 - i * 11} ${216 - i * 13} ${
      152 - i * 11
    } ${343 - i * 13}C${616 - i * 11} ${470 - i * 13} ${684 - i * 11} ${875 - i * 13} ${684 - i * 11} ${875 - i * 13}`,
    width: 0.7 + i * 0.11,
    opacity: 0.09 + i * 0.03,
  }));

  return (
    <svg
      className={cn('absolute inset-0 h-full w-full text-violet', className)}
      viewBox="0 0 696 316"
      fill="none"
      aria-hidden="true"
    >
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('relative w-full overflow-hidden bg-lavender', className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <PathField count={16} className="drift-a" />
        <PathField count={16} className="drift-b opacity-70" />
        {/* Soft halo so the copy stays readable where lines cross it. */}
        <div className="halo absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-lavender" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
        {title ? (
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-black tracking-tight text-balance">
            {title}
          </h1>
        ) : null}
        {children}
      </div>
    </div>
  );
}

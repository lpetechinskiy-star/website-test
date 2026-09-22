'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Lifts a block into place the first time it scrolls into view.
 *
 * The content is visible by default and only hidden once this component is
 * alive and able to bring it back — plus a hard deadline, so a stalled
 * observer can never leave a section blank.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    const show = () => element.classList.add('is-revealed');
    element.classList.add('is-armed');

    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        watcher.disconnect();
      },
      // Start well before the block reaches the viewport, so by the time the
      // viewer can see it the fade is already finished.
      { rootMargin: '320px 0px 320px 0px' },
    );
    watcher.observe(element);

    // Safety net: if the observer never fires for a block that is already on
    // screen, show it anyway rather than leaving a blank gap.
    const deadline = window.setTimeout(() => {
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) show();
    }, 1500);

    return () => {
      watcher.disconnect();
      window.clearTimeout(deadline);
    };
  }, []);

  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  );
}

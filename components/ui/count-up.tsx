'use client';

import { useEffect, useRef, useState } from 'react';

const format = (value: number, decimals: number) =>
  value.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Counts up to `value` when the number scrolls into view. It renders the real
 * figure from the start, so a viewer whose scripts never run — or run late —
 * still reads the right number.
 */
export function CountUp({
  value,
  suffix = '',
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const duration = 900;
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setShown(value * eased);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      setShown(0);
      frame = requestAnimationFrame(step);
    };

    const watcher = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      run();
      watcher.disconnect();
    });
    watcher.observe(element);

    return () => {
      watcher.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {format(shown, decimals)}
      {suffix}
    </span>
  );
}

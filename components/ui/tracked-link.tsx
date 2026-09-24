'use client';

import type { ReactNode } from 'react';

import { track, type ConversionEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/** Link that reports a conversion event before it follows the href. */
export function TrackedLink({
  href,
  event,
  children,
  className,
  external,
  ...rest
}: {
  href: string;
  event: ConversionEvent;
  children: ReactNode;
  className?: string;
  external?: boolean;
  'aria-label'?: string;
}) {
  return (
    <a
      href={href}
      className={cn(className)}
      onClick={() => track(event, { href })}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
      {...rest}
    >
      {children}
    </a>
  );
}

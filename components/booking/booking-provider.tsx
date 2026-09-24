'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { BookingDialog } from './booking-dialog';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const BookingContext = createContext<{ open: () => void } | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => {
    track('booking_open');
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog open={isOpen} onClose={close} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used inside BookingProvider');
  return context;
}

/** Any button that should open the booking window. */
export function BookingButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open } = useBooking();
  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-ink font-semibold text-primary-foreground',
        'transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-lavender',
        className,
      )}
    >
      {children}
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';

import BrandLogo from '@/app/brand-logo';
import { BookingButton } from '@/components/booking/booking-provider';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#about', label: 'О нас' },
  { href: '#process', label: 'Как проходит приём' },
  { href: '#contacts', label: 'Контакты' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full px-5 py-2.5 transition-all duration-300 md:px-6',
          scrolled
            ? 'border border-border bg-lavender shadow-[0_10px_40px_-24px_rgba(8,9,9,0.45)]'
            : 'border border-transparent bg-transparent',
        )}
      >
        <a
          href="#top"
          aria-label="В начало страницы"
          className="block w-[104px] text-ink md:w-[124px] [&>svg]:h-auto [&>svg]:w-full"
        >
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-7 text-[0.95rem] text-muted-foreground lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <BookingButton className="rounded-full px-5 py-2.5 text-sm">Записаться</BookingButton>
      </div>
    </header>
  );
}

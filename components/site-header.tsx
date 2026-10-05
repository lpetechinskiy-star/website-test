'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import BrandLogo from '@/app/brand-logo';
import { BookingButton } from '@/components/booking/booking-provider';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#doctors', label: 'Врачи' },
  { href: '#prices', label: 'Цены' },
  { href: '#about', label: 'О клинике' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc closes the mobile menu, the same way it closes the booking window.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300',
        scrolled || menuOpen ? 'py-2' : 'py-4',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl rounded-3xl transition-all duration-300',
          scrolled || menuOpen
            ? 'border border-border bg-lavender shadow-[0_10px_40px_-24px_rgba(8,9,9,0.45)]'
            : 'border border-transparent bg-transparent',
        )}
      >
        <div className="flex items-center justify-between gap-6 px-5 py-2.5 md:px-6">
          <a
            href="#top"
            aria-label="В начало страницы"
            className="flex min-h-11 w-[104px] items-center text-ink md:w-[124px] [&>svg]:h-auto [&>svg]:w-full"
          >
            <BrandLogo />
          </a>

          <nav aria-label="Основная навигация" className="hidden items-center gap-6 text-[0.95rem] text-muted-foreground lg:flex">
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

          <div className="flex items-center gap-2">
            <BookingButton className="rounded-full px-5 py-2.5 text-sm">Записаться</BookingButton>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:border-violet/50 lg:hidden"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Основная навигация"
          hidden={!menuOpen}
          className="border-t border-border px-3 pt-2 pb-3 lg:hidden"
        >
          <ul className="grid grid-cols-2 gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-2xl px-3 text-[0.98rem] transition-colors hover:bg-card"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

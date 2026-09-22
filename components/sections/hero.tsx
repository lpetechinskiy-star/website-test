import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';

import { BookingButton } from '@/components/booking/booking-provider';
import { ToothCharacter } from '@/components/tooth-character';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { Button } from '@/components/ui/button';

const TRUST = [
  { icon: ShieldCheck, label: 'Лечение без боли' },
  { icon: Sparkles, label: 'Цифровая диагностика' },
  { icon: Star, label: 'Врачи с опытом от 10 лет' },
];

export function Hero() {
  return (
    <section id="top">
      <BackgroundPaths className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6">
          <div className="hero-copy text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              стоматология для всей семьи
            </span>

            <h1 className="mt-6 font-display text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[1.04] font-black tracking-tight text-balance">
              Здоровая улыбка
              <br />
              без страха
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0 md:text-xl">
              Спокойный приём, честный план лечения и результат, который хочется
              показывать.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center">
              <BookingButton className="px-8 py-4 text-base shadow-lg shadow-ink/15">
                Записаться на приём
                <ArrowRight className="size-4" aria-hidden />
              </BookingButton>

              <Button
                asChild
                variant="outline"
                className="h-auto rounded-2xl border-ink/15 bg-card px-8 py-4 text-base font-medium text-ink transition-transform duration-200 hover:bg-card hover:-translate-y-0.5 active:translate-y-0"
              >
                <a href="#services">Посмотреть услуги</a>
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-muted-foreground lg:justify-start">
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="size-4 text-violet" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* The clip's own background is the hero's lavender, so the character
              stands in the page instead of sitting in a box. */}
          <ToothCharacter className="hero-tooth" />
        </div>
      </BackgroundPaths>
    </section>
  );
}

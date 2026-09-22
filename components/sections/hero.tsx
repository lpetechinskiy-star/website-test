'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';

import { BackgroundPaths } from '@/components/ui/background-paths';
import { Button } from '@/components/ui/button';

const TRUST = [
  { icon: ShieldCheck, label: 'Лечение без боли' },
  { icon: Sparkles, label: 'Цифровая диагностика' },
  { icon: Star, label: 'Врачи с опытом от 10 лет' },
];

export function Hero() {
  return (
    <section id="top" className="relative">
      <BackgroundPaths
        title="Здоровая улыбка"
        className="min-h-[100svh] pt-28 pb-20 md:pt-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          Бережная стоматология для всей семьи: спокойный приём, честный план лечения
          и результат, который хочется показывать.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <div className="group relative inline-block overflow-hidden rounded-2xl bg-gradient-to-b from-ink/15 to-blush/30 p-px shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <Button
              asChild
              className="rounded-[0.95rem] bg-ink px-8 py-6 text-base font-semibold text-primary-foreground transition-all duration-300 group-hover:-translate-y-0.5 hover:bg-ink"
            >
              <a href="#contacts">
                <span>Записаться на приём</span>
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-ink/15 bg-card/70 px-8 py-6 text-base font-medium backdrop-blur-md hover:bg-card"
          >
            <a href="#services">Посмотреть услуги</a>
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          {TRUST.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-violet" aria-hidden />
              {label}
            </li>
          ))}
        </motion.ul>
      </BackgroundPaths>
    </section>
  );
}

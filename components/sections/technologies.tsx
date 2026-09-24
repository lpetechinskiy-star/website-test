import { Microscope, Radiation, ScanLine, Sparkles, Waves } from 'lucide-react';

import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const TECH = [
  {
    icon: ScanLine,
    title: 'Цифровая диагностика',
    text: 'Снимок и фотопротокол сразу на приёме — видно то, что не заметно глазом.',
  },
  {
    icon: Microscope,
    title: 'Микроскоп',
    text: 'Лечение каналов под увеличением: меньше здоровых тканей идёт под бор.',
  },
  {
    icon: Radiation,
    title: '3D-снимок',
    text: 'Объёмная томография перед имплантацией и сложным лечением.',
  },
  {
    icon: Waves,
    title: 'Цифровое сканирование',
    text: 'Слепки без ложки и массы: скан во рту, коронка по цифровой модели.',
  },
  {
    icon: Sparkles,
    title: 'Современная стерилизация',
    text: 'Инструменты проходят полный цикл обработки, одноразовое — из упаковки при вас.',
  },
];

export function Technologies() {
  return (
    <section id="tech" className="bg-lavender py-24 md:py-28" aria-labelledby="tech-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground">
            технологии
          </span>
          <h2 id="tech-title" className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Оборудование, которое решает
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TECH.map(({ icon: Icon, title, text }) => (
            <Reveal key={title}>
              <SpotlightCard className="h-full">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-ink">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-xl font-black">{title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-muted-foreground">{text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

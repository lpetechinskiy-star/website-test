import { Baby, HeartPulse, ScanLine, ShieldCheck, Smile, Sparkles } from 'lucide-react';

import { Reveal } from '@/components/ui/reveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const SERVICES = [
  {
    icon: ShieldCheck,
    title: 'Лечение кариеса',
    text: 'Под микроскопом и с комфортной анестезией — сохраняем максимум своего зуба.',
  },
  {
    icon: Sparkles,
    title: 'Гигиена и отбеливание',
    text: 'Профессиональная чистка, полировка и мягкое отбеливание без чувствительности.',
  },
  {
    icon: Smile,
    title: 'Импланты и протезирование',
    text: 'Возвращаем жевание и эстетику: от одного импланта до полного восстановления.',
  },
  {
    icon: ScanLine,
    title: 'Элайнеры и брекеты',
    text: 'Цифровой план движения зубов — вы видите результат ещё до начала лечения.',
  },
  {
    icon: Baby,
    title: 'Детский приём',
    text: 'Знакомство с креслом через игру: ребёнок уходит без страха и с подарком.',
  },
  {
    icon: HeartPulse,
    title: 'Неотложная помощь',
    text: 'Острая боль — принимаем в день обращения и снимаем симптом сразу.',
  },
];

export function Services() {
  return (
    <section id="services" className="bg-lavender py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground">
            услуги
          </span>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Всё, что нужно вашим зубам — в одном месте
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Один врач ведёт вас от первого снимка до контрольного визита. Никаких
            «пойдите в другую клинику».
          </p>
        </Reveal>

        <div className="mt-9 grid md:mt-14 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, text }) => (
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

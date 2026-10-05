import { CalendarCheck, HeartHandshake, Microscope, ScrollText, ShieldCheck, Smile } from 'lucide-react';

import { Reveal } from '@/components/ui/reveal';

const POINTS = [
  {
    icon: Microscope,
    title: 'Современная диагностика',
    text: 'Снимок и фотопротокол на первом приёме — решение принимается по фактам, а не на глаз.',
  },
  {
    icon: ScrollText,
    title: 'Понятный план лечения',
    text: 'Расписываем этапы, сроки и стоимость до начала работ и не меняем их по ходу.',
  },
  {
    icon: HeartHandshake,
    title: 'Несколько вариантов',
    text: 'Показываем и бюджетный, и оптимальный путь. Выбираете вы, а не за вас.',
  },
  {
    icon: Smile,
    title: 'Опытные врачи',
    text: 'Профильные специалисты: терапевт, хирург-имплантолог, ортодонт, детский стоматолог.',
  },
  {
    icon: CalendarCheck,
    title: 'Комфортный приём',
    text: 'Без очередей и спешки: на визит отводится столько времени, сколько нужно.',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантия на работы',
    text: 'Гарантийный срок фиксируем в договоре, контрольный визит — бесплатный.',
  },
];

export function WhyUs() {
  return (
    <section id="why" className="bg-card py-16 md:py-28" aria-labelledby="why-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-lavender px-4 py-1.5 text-sm text-muted-foreground">
            почему мы
          </span>
          <h2 id="why-title" className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Шесть причин остаться нашим пациентом
          </h2>
        </Reveal>

        <ul className="mt-8 grid md:mt-12 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <Reveal key={title}>
              <li className="flex h-full gap-4 rounded-3xl border border-border bg-lavender p-6 transition-colors duration-300 hover:border-violet/40">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-card text-violet">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-tight font-black">{title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

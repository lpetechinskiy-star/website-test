import { Check } from 'lucide-react';

import { CountUp } from '@/components/ui/count-up';
import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: цифры-заглушки — замените на реальные показатели клиники.
const STATS = [
  { value: 12, suffix: ' лет', label: 'принимаем пациентов' },
  { value: 18000, suffix: '+', label: 'вылеченных зубов' },
  { value: 4.9, suffix: '', label: 'средняя оценка', decimals: 1 },
  { value: 2, suffix: ' года', label: 'гарантия на работы' },
];

const POINTS = [
  'Честный план лечения с ценой до начала работ',
  'Своя зуботехническая лаборатория — меньше визитов',
  'Стерилизация по протоколу, одноразовые наборы',
  'Контрольный визит и напоминания о гигиене',
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-card py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 42% at 88% 8%, rgba(255,227,237,0.75) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 md:px-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-lavender px-4 py-1.5 text-sm text-muted-foreground">
            о нас
          </span>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Клиника, куда возвращаются всей семьёй
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Мы лечим спокойно и предсказуемо: объясняем каждый шаг, показываем снимки
            до и после, не навязываем лишнего. Если проблему можно решить бережнее —
            выберем этот путь.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[1.02rem]">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blush/25 text-ink">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-border bg-lavender p-7 transition-colors duration-300 hover:border-violet/40"
              >
                <p className="font-display text-[clamp(2rem,5vw,2.75rem)] leading-none font-black">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </p>
                <p className="mt-3 text-sm leading-snug text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from '@/components/ui/reveal';

const STEPS = [
  {
    title: 'Знакомство',
    text: 'Расспрашиваем о жалобах и страхах, осматриваем полость рта без спешки.',
  },
  {
    title: 'Диагностика',
    text: 'Цифровой снимок и фотопротокол — видим то, что не видно глазом.',
  },
  {
    title: 'План и цена',
    text: 'Показываем варианты лечения, сроки и стоимость. Решение остаётся за вами.',
  },
  {
    title: 'Лечение и контроль',
    text: 'Работаем по плану, а через две недели приглашаем на контрольный визит.',
  },
];

export function Process() {
  return (
    <section id="process" className="bg-lavender py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground">
            как проходит приём
          </span>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Четыре шага без сюрпризов
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="group relative h-full list-none overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(8,9,9,0.4)]">
                <span className="font-display text-5xl leading-none font-black text-blush transition-colors duration-300 group-hover:text-violet">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

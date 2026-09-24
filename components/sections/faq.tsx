import { Reveal } from '@/components/ui/reveal';

const QUESTIONS = [
  {
    q: 'Больно ли лечить зубы?',
    a: 'Лечение идёт под анестезией: сначала обезболиваем место укола гелем, потом ставим анестетик. Если почувствуете дискомфорт — скажите врачу, приём остановят и добавят обезболивание.',
  },
  {
    q: 'Сколько длится первый приём?',
    a: 'Обычно около часа: осмотр, снимок, обсуждение плана лечения и стоимости. Если нужно снять острую боль, помогаем в этот же визит.',
  },
  {
    q: 'Можно ли прийти только на консультацию?',
    a: 'Да. Вы получите осмотр, снимок и план лечения с ценой — и решите, что делать дальше. Начинать лечение в тот же день не обязательно.',
  },
  {
    q: 'Делаете ли вы снимок на первом приёме?',
    a: 'Да, диагностика входит в первичный приём: прицельный снимок или панорамный, а перед имплантацией — объёмный 3D.',
  },
  {
    q: 'Как подготовиться к приёму?',
    a: 'Достаточно почистить зубы и взять документы. Если принимаете лекарства, есть аллергия или хронические заболевания — скажите об этом врачу до начала лечения.',
  },
  {
    q: 'Есть ли лечение для детей?',
    a: 'Да, детский приём ведёт отдельный врач. Первый визит — знакомство без лечения, чтобы ребёнок спокойно отнёсся к креслу.',
  },
  {
    q: 'Можно ли узнать стоимость до лечения?',
    a: 'Да. После осмотра вы получаете план с перечнем работ и ценой каждой позиции. Стоимость не меняется по ходу лечения без вашего согласия.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-lavender py-24 md:py-28" aria-labelledby="faq-title">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground">
            вопросы
          </span>
          <h2 id="faq-title" className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Частые вопросы
          </h2>
        </Reveal>

        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            {QUESTIONS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>
                  <span>{item.q}</span>
                  <span className="faq-sign" aria-hidden />
                </summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Разметка для поисковиков: те же вопросы и ответы, что и на странице. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: QUESTIONS.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />
    </section>
  );
}

import { Star } from 'lucide-react';

import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: отзывы-заглушки. Подставьте настоящие — с именем, текстом,
// оценкой и площадкой, откуда отзыв взят. Выдуманные отзывы публиковать нельзя.
const REVIEWS = [
  { name: 'Имя Ф.', rating: 5, source: 'источник отзыва', text: 'Здесь будет текст отзыва пациента: с чем пришёл, как прошло лечение, что понравилось.' },
  { name: 'Имя Ф.', rating: 5, source: 'источник отзыва', text: 'Здесь будет текст отзыва пациента: с чем пришёл, как прошло лечение, что понравилось.' },
  { name: 'Имя Ф.', rating: 5, source: 'источник отзыва', text: 'Здесь будет текст отзыва пациента: с чем пришёл, как прошло лечение, что понравилось.' },
  { name: 'Имя Ф.', rating: 4, source: 'источник отзыва', text: 'Здесь будет текст отзыва пациента: с чем пришёл, как прошло лечение, что понравилось.' },
  { name: 'Имя Ф.', rating: 5, source: 'источник отзыва', text: 'Здесь будет текст отзыва пациента: с чем пришёл, как прошло лечение, что понравилось.' },
  { name: 'Имя Ф.', rating: 5, source: 'источник отзыва', text: 'Здесь будет текст отзыва пациента: с чем пришёл, как прошло лечение, что понравилось.' },
];

function Rating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={star <= value ? 'size-4 fill-blush text-blush' : 'size-4 text-border'}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="bg-card py-24 md:py-28" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-lavender px-4 py-1.5 text-sm text-muted-foreground">
            отзывы
          </span>
          <h2 id="reviews-title" className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Что говорят пациенты
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Карточки ниже — шаблон под настоящие отзывы с вашей площадки.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <Reveal key={index}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-lavender p-6 transition-colors duration-300 hover:border-violet/40">
                <Rating value={review.rating} />
                <blockquote className="mt-4 flex-1 text-[0.97rem] leading-relaxed text-muted-foreground">
                  {review.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                  <span className="font-display font-black">{review.name}</span>
                  <span className="text-muted-foreground">{review.source}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

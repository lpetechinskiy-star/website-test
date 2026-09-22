import { Clock, MapPin, Phone } from 'lucide-react';

import { BookingButton } from '@/components/booking/booking-provider';
import { ToothCharacter } from '@/components/tooth-character';
import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: контакты-заглушки — подставьте телефон, адрес и часы работы клиники.
const CONTACTS = [
  { icon: Phone, label: 'Телефон', value: '+7 (000) 000-00-00' },
  { icon: MapPin, label: 'Адрес', value: 'г. Город, ул. Улица, 1' },
  { icon: Clock, label: 'Часы работы', value: 'пн–сб, 9:00–21:00' },
];

const SPARKS = [
  { top: '18%', left: '12%', size: 8, delay: '0s' },
  { top: '64%', left: '7%', size: 5, delay: '1.4s' },
  { top: '26%', left: '86%', size: 6, delay: '.7s' },
  { top: '74%', left: '92%', size: 9, delay: '2.1s' },
  { top: '8%', left: '62%', size: 5, delay: '1.1s' },
];

export function ContactCta() {
  return (
    <section className="bg-card py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <div className="cta-card relative overflow-hidden rounded-[2rem] bg-ink px-7 py-14 md:px-14 md:py-16">
            {/* Slow drifting light behind the copy: two gradients on their own
                layers, moved with transforms only. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="aurora aurora-a" />
              <div className="aurora aurora-b" />
              {SPARKS.map((spark) => (
                <span
                  key={`${spark.top}-${spark.left}`}
                  className="spark"
                  style={{
                    top: spark.top,
                    left: spark.left,
                    width: spark.size,
                    height: spark.size,
                    animationDelay: spark.delay,
                  }}
                />
              ))}
            </div>

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-lavender/20 px-4 py-1.5 text-xs tracking-[0.18em] text-lavender/70 uppercase">
                  <span className="size-1.5 rounded-full bg-blush" />
                  запись онлайн
                </span>

                <h2 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.08] font-black text-lavender text-balance">
                  Запишитесь на осмотр — и узнайте, что{' '}
                  <span className="cta-shine">действительно нужно</span> вашим зубам
                </h2>
                <p className="mt-5 max-w-xl text-lg text-lavender/70 lg:mx-0 mx-auto">
                  Первичная консультация со снимком и планом лечения. Без давления и
                  лишних процедур.
                </p>

                <BookingButton className="mt-9 bg-lavender px-9 py-4 text-base text-ink hover:bg-white focus-visible:ring-offset-ink">
                  Записаться на приём
                </BookingButton>
              </div>

              {/* The character turns up again here and keeps watching the
                  cursor, which is the moment people stop to play with. */}
              <div className="cta-character relative mx-auto w-full max-w-[360px]">
                <div aria-hidden className="cta-glow" />
                <div aria-hidden className="cta-ring">
                  <svg viewBox="0 0 200 200" className="size-full">
                    <defs>
                      <path
                        id="cta-ring-path"
                        d="M100 100 m -92 0 a 92 92 0 1 1 184 0 a 92 92 0 1 1 -184 0"
                        fill="none"
                      />
                    </defs>
                    <text
                      fill="currentColor"
                      fontSize="11"
                      letterSpacing="4.2"
                      fontFamily="Manrope, Arial, sans-serif"
                    >
                      <textPath href="#cta-ring-path">
                        ЗДОРОВАЯ УЛЫБКА · БЕЗ СТРАХА · ЗДОРОВАЯ УЛЫБКА · БЕЗ СТРАХА ·
                      </textPath>
                    </text>
                  </svg>
                </div>
                <ToothCharacter className="cta-tooth" groundShadow={false} />
              </div>
            </div>

            <dl className="relative mt-14 grid gap-4 text-left sm:grid-cols-3">
              {CONTACTS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-lavender/15 p-5 transition-colors duration-300 hover:border-lavender/40"
                >
                  <dt className="flex items-center gap-2 text-sm text-lavender/60">
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </dt>
                  <dd className="mt-2 text-lavender">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Clock, MapPin, MessageCircle, Navigation, Phone, Send } from 'lucide-react';

import { BookingButton } from '@/components/booking/booking-provider';
import { ToothCharacter } from '@/components/tooth-character';
import { Reveal } from '@/components/ui/reveal';
import { TrackedLink } from '@/components/ui/tracked-link';
import { CLINIC } from '@/lib/clinic';

const SPARKS = [
  { top: '18%', left: '12%', size: 8, delay: '0s' },
  { top: '64%', left: '7%', size: 5, delay: '1.4s' },
  { top: '26%', left: '86%', size: 6, delay: '.7s' },
  { top: '74%', left: '92%', size: 9, delay: '2.1s' },
  { top: '8%', left: '62%', size: 5, delay: '1.1s' },
];

export function ContactCta() {
  return (
    <section className="bg-card py-16 md:py-28">
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

                <BookingButton className="mt-9 w-full bg-lavender px-9 py-4 text-base text-ink hover:bg-white focus-visible:ring-offset-ink sm:w-auto">
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

            <dl className="relative mt-9 grid md:mt-14 gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-lavender/15 p-5 transition-colors duration-300 hover:border-lavender/40">
                <dt className="flex items-center gap-2 text-sm text-lavender/60">
                  <Phone className="size-4" aria-hidden />
                  Телефон
                </dt>
                <dd className="mt-2">
                  <TrackedLink
                    href={CLINIC.phoneHref}
                    event="phone_click"
                    className="inline-flex min-h-11 items-center text-lavender underline-offset-4 hover:underline"
                    aria-label={`Позвонить по номеру ${CLINIC.phone}`}
                  >
                    {CLINIC.phone}
                  </TrackedLink>
                </dd>
                <dd className="mt-3 flex gap-2">
                  <TrackedLink
                    href={CLINIC.whatsapp}
                    event="messenger_click"
                    external
                    aria-label="Написать в WhatsApp"
                    className="flex size-11 items-center justify-center rounded-full border border-lavender/20 text-lavender/80 transition-colors hover:border-lavender/50 hover:text-lavender"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                  </TrackedLink>
                  <TrackedLink
                    href={CLINIC.telegram}
                    event="messenger_click"
                    external
                    aria-label="Написать в Telegram"
                    className="flex size-11 items-center justify-center rounded-full border border-lavender/20 text-lavender/80 transition-colors hover:border-lavender/50 hover:text-lavender"
                  >
                    <Send className="size-4" aria-hidden />
                  </TrackedLink>
                </dd>
              </div>

              <div className="rounded-2xl border border-lavender/15 p-5 transition-colors duration-300 hover:border-lavender/40">
                <dt className="flex items-center gap-2 text-sm text-lavender/60">
                  <MapPin className="size-4" aria-hidden />
                  Адрес
                </dt>
                <dd className="mt-2 text-lavender">{CLINIC.address}</dd>
                <dd className="mt-3">
                  <TrackedLink
                    href={CLINIC.routeUrl}
                    event="route_click"
                    external
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lavender/25 px-5 py-2 text-sm text-lavender transition-colors hover:border-lavender/60 hover:bg-lavender/10"
                  >
                    <Navigation className="size-4" aria-hidden />
                    Построить маршрут
                  </TrackedLink>
                </dd>
              </div>

              <div className="rounded-2xl border border-lavender/15 p-5 transition-colors duration-300 hover:border-lavender/40">
                <dt className="flex items-center gap-2 text-sm text-lavender/60">
                  <Clock className="size-4" aria-hidden />
                  Часы работы
                </dt>
                <dd className="mt-2 text-lavender">{CLINIC.hours}</dd>
                <dd className="mt-3 text-sm text-lavender/60">Приём по записи</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        {/* ЗАПОЛНИТЕ: вставьте сюда iframe Яндекс.Карт или 2ГИС с точкой клиники —
            контейнер уже готов и держит пропорции. */}
        <Reveal className="mt-6">
          <div className="map-frame" role="img" aria-label="Карта проезда к клинике — заглушка">
            <div className="map-pin">
              <MapPin className="size-5" aria-hidden />
            </div>
            <p className="font-display text-lg font-black">Здесь будет карта</p>
            <p className="mt-1 text-sm text-muted-foreground">{CLINIC.address}</p>
            <TrackedLink
              href={CLINIC.routeUrl}
              event="route_click"
              external
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm transition-colors hover:border-violet/50"
            >
              <Navigation className="size-4" aria-hidden />
              Построить маршрут
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

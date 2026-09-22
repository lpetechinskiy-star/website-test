import { Clock, MapPin, Phone } from 'lucide-react';

import { BookingButton } from '@/components/booking/booking-provider';
import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: контакты-заглушки — подставьте телефон, адрес и часы работы клиники.
const CONTACTS = [
  { icon: Phone, label: 'Телефон', value: '+7 (000) 000-00-00' },
  { icon: MapPin, label: 'Адрес', value: 'г. Город, ул. Улица, 1' },
  { icon: Clock, label: 'Часы работы', value: 'пн–сб, 9:00–21:00' },
];

export function ContactCta() {
  return (
    <section className="bg-card py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-center md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(55% 55% at 50% 0%, rgba(111,91,208,0.45) 0%, transparent 70%)',
              }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.1] font-black text-lavender">
                Запишитесь на осмотр — и узнайте, что действительно нужно вашим зубам
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-lavender/70">
                Первичная консультация со снимком и планом лечения. Без давления и
                лишних процедур.
              </p>

              <BookingButton className="mt-9 bg-lavender px-9 py-4 text-base text-ink hover:bg-white focus-visible:ring-offset-ink">
                Записаться на приём
              </BookingButton>

              <dl className="mx-auto mt-14 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
                {CONTACTS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-lavender/15 p-5">
                    <dt className="flex items-center gap-2 text-sm text-lavender/60">
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </dt>
                    <dd className="mt-2 text-lavender">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

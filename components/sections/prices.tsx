import { BookingButton } from '@/components/booking/booking-provider';
import { Reveal } from '@/components/ui/reveal';

// ЗАПОЛНИТЕ: цены-заглушки. Подставьте прайс клиники — формат строки любой.
const PRICES = [
  { title: 'Консультация и осмотр', note: 'со снимком и планом лечения', price: 'от 0 000 ₽' },
  { title: 'Лечение кариеса', note: 'с анестезией и реставрацией', price: 'от 0 000 ₽' },
  { title: 'Профессиональная гигиена', note: 'чистка, полировка, фторирование', price: 'от 0 000 ₽' },
  { title: 'Отбеливание', note: 'кабинетное, за один визит', price: 'от 0 000 ₽' },
  { title: 'Имплантация', note: 'имплант с установкой', price: 'от 00 000 ₽' },
  { title: 'Лечение зубов детям', note: 'приём с адаптацией', price: 'от 0 000 ₽' },
];

export function Prices() {
  return (
    <section id="prices" className="bg-card py-16 md:py-28" aria-labelledby="prices-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-lavender px-4 py-1.5 text-sm text-muted-foreground">
            цены
          </span>
          <h2 id="prices-title" className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] font-black">
            Сколько это стоит
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Точную сумму называем после осмотра — в плане лечения, до начала работ.
          </p>
        </Reveal>

        <Reveal className="mt-8 md:mt-12">
          <ul className="overflow-hidden rounded-3xl border border-border">
            {PRICES.map((item) => (
              <li
                key={item.title}
                className="price-row bg-lavender px-6 py-5 transition-colors duration-200 hover:bg-accent/40 sm:px-8"
              >
                <div>
                  <h3 className="font-display text-lg font-black">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                </div>
                <span className="font-display text-lg font-black whitespace-nowrap text-violet">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <BookingButton className="w-full px-8 py-4 text-base sm:w-auto">Уточнить стоимость</BookingButton>
          <p className="text-sm text-muted-foreground">
            Назовём цену по вашему случаю на консультации.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

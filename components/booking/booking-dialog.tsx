'use client';

import { Check, Clock, Phone, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';

import { LegalLink } from '@/components/legal/legal-provider';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const SERVICES = [
  'Консультация и осмотр',
  'Лечение кариеса',
  'Гигиена и отбеливание',
  'Импланты и протезирование',
  'Элайнеры и брекеты',
  'Детский приём',
  'Острая боль',
];

// Клиника принимает пн–сб, 9:00–21:00 — приём длится полчаса.
const WORKING_DAYS = [1, 2, 3, 4, 5, 6];
const FIRST_SLOT = 9 * 60;
const LAST_SLOT = 20 * 60 + 30;

const slots = () => {
  const list: string[] = [];
  for (let minutes = FIRST_SLOT; minutes <= LAST_SLOT; minutes += 30) {
    list.push(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
  }
  return list;
};

/** The next ten working days, starting today. */
function upcomingDays() {
  const days: { iso: string; weekday: string; day: string; month: string }[] = [];
  const cursor = new Date();
  while (days.length < 10) {
    if (WORKING_DAYS.includes(cursor.getDay())) {
      days.push({
        iso: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`,
        weekday: cursor.toLocaleDateString('ru-RU', { weekday: 'short' }),
        day: String(cursor.getDate()),
        month: cursor.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

const digitsOf = (value: string) => value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);

function formatPhone(value: string) {
  const digits = digitsOf(value);
  if (!digits) return '';
  const rest = digits.startsWith('7') ? digits.slice(1) : digits;
  const parts = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10),
  ].filter(Boolean);
  let formatted = '+7';
  if (parts[0]) formatted += ` (${parts[0]}`;
  if (parts[0]?.length === 3) formatted += ')';
  if (parts[1]) formatted += ` ${parts[1]}`;
  if (parts[2]) formatted += `-${parts[2]}`;
  if (parts[3]) formatted += `-${parts[3]}`;
  return formatted;
}

export function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(SERVICES[0]);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearError = (field: string) =>
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  const [done, setDone] = useState(false);

  // Dates are built on the client only, so the markup rendered on the server
  // never disagrees with what the browser shows.
  const [days, setDays] = useState<ReturnType<typeof upcomingDays>>([]);
  const times = useMemo(slots, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      const list = upcomingDays();
      setDays(list);
      setDay((current) => current || list[0].iso);
      dialog.showModal();
      window.setTimeout(() => nameRef.current?.focus(), 60);
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const reset = () => {
    setDone(false);
    setErrors({});
    setName('');
    setPhone('');
    setTime('');
    setComment('');
    setConsent(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (name.trim().length < 2) found.name = 'Как к вам обращаться?';
    if (digitsOf(phone).length !== 11) found.phone = 'Введите номер полностью';
    if (!day) found.day = 'Выберите день';
    if (!time) found.time = 'Выберите время';
    if (!consent) found.consent = 'Нужно согласие на обработку данных';
    setErrors(found);
    if (Object.keys(found).length) return;

    // ЗАПОЛНИТЕ: бэкенда нет, поэтому заявка никуда не уходит — форма только
    // собирает данные. Подключите отправку сюда, например:
    //   await fetch('/api/booking', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, phone, service, day, time, comment }),
    //   });
    // и показывайте экран успеха только после успешного ответа.
    track('booking_submit', { service, day, time });
    setDone(true);
  };

  const chosenDay = days.find((item) => item.iso === day);

  return (
    <dialog ref={dialogRef} className="booking-dialog" aria-labelledby="booking-title">
      <div className="booking-panel">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-ink"
          aria-label="Закрыть"
        >
          <X className="size-5" aria-hidden />
        </button>

        {done ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-ink">
              <Check className="size-7" aria-hidden />
            </span>
            <h2 id="booking-title" className="mt-6 font-display text-2xl font-black">
              Спасибо! Заявка отправлена
            </h2>
            <p className="mt-3 text-muted-foreground">
              Мы свяжемся с вами для подтверждения записи{' '}
              <b className="text-ink">{chosenDay ? `${chosenDay.day} ${chosenDay.month}` : ''}, {time}</b>{' '}
              по номеру {formatPhone(phone)}.
            </p>
            <dl className="mt-7 grid gap-2 rounded-2xl bg-muted p-5 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Услуга</dt>
                <dd className="text-right">{service}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Дата и время</dt>
                <dd className="text-right">
                  {chosenDay ? `${chosenDay.weekday}, ${chosenDay.day} ${chosenDay.month}` : ''} · {time}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Телефон</dt>
                <dd className="text-right">{formatPhone(phone)}</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-ink px-7 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Готово
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-2xl border border-border px-7 py-3 font-medium transition-colors hover:bg-muted"
              >
                Записать ещё кого-то
              </button>
            </div>
            {/* Одну строку ниже можно убрать, как только форма начнёт уходить в CRM. */}
            <p className="mt-5 text-xs text-muted-foreground">
              Демонстрационная форма: заявка пока никуда не отправляется.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs tracking-wide text-ink uppercase">
              запись на приём
            </span>
            <h2 id="booking-title" className="mt-4 font-display text-2xl leading-tight font-black sm:text-3xl">
              Выберите удобное время
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Приём длится 30 минут. Администратор перезвонит и подтвердит запись.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="size-4" aria-hidden /> Как вас зовут
                </span>
                <input
                  ref={nameRef}
                  id="booking-name"
                  value={name}
                  onChange={(event) => { setName(event.target.value); clearError('name'); }}
                  placeholder="Анна"
                  autoComplete="name"
                  className={cn('booking-field', errors.name && 'booking-field-error')}
                />
                {errors.name ? <span className="booking-error">{errors.name}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4" aria-hidden /> Телефон
                </span>
                <input
                  id="booking-phone"
                  value={phone}
                  onChange={(event) => { setPhone(formatPhone(event.target.value)); clearError('phone'); }}
                  placeholder="+7 (900) 000-00-00"
                  inputMode="tel"
                  autoComplete="tel"
                  className={cn('booking-field', errors.phone && 'booking-field-error')}
                />
                {errors.phone ? <span className="booking-error">{errors.phone}</span> : null}
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm text-muted-foreground">Услуга</span>
              <select
                id="booking-service"
                value={service}
                onChange={(event) => setService(event.target.value)}
                className="booking-field"
              >
                {SERVICES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="mt-6">
              <span className="mb-2 block text-sm text-muted-foreground">День</span>
              <div className="booking-scroller flex gap-2 overflow-x-auto pb-1">
                {days.map((item) => (
                  <button
                    key={item.iso}
                    type="button"
                    onClick={() => { setDay(item.iso); clearError('day'); }}
                    aria-pressed={day === item.iso}
                    className={cn('booking-day', day === item.iso && 'booking-day-active')}
                  >
                    <span className="text-[0.7rem] tracking-wide uppercase opacity-70">{item.weekday}</span>
                    <span className="font-display text-lg leading-none font-black">{item.day}</span>
                    <span className="text-[0.7rem] opacity-70">{item.month}</span>
                  </button>
                ))}
              </div>
              {errors.day ? <span className="booking-error">{errors.day}</span> : null}
            </div>

            <div className="mt-6">
              <span className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" aria-hidden /> Время
              </span>
              <div className="booking-times grid grid-cols-3 gap-2 sm:grid-cols-6">
                {times.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => { setTime(item); clearError('time'); }}
                    aria-pressed={time === item}
                    className={cn('booking-time', time === item && 'booking-time-active')}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {errors.time ? <span className="booking-error">{errors.time}</span> : null}
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm text-muted-foreground">
                Комментарий <span className="text-muted-foreground/70">— необязательно</span>
              </span>
              <textarea
                id="booking-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                placeholder="Что беспокоит, удобно ли перезвонить, нужна ли помощь с выбором врача"
                className="booking-field resize-y"
              />
            </label>

            <label className="booking-consent mt-5">
              <input
                id="booking-consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => { setConsent(event.target.checked); clearError('consent'); }}
              />
              <span>
                Согласен на обработку персональных данных и принимаю{' '}
                <LegalLink document="privacy">политику конфиденциальности</LegalLink>.
              </span>
            </label>
            {errors.consent ? <span className="booking-error">{errors.consent}</span> : null}

            <div className="booking-actions">
              <button
                type="submit"
                className="w-full rounded-2xl bg-ink py-4 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Записаться
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Перезвоним в рабочее время, чтобы подтвердить запись.
              </p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

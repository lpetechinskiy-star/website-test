// Точки для аналитики конверсий. Ничего стороннего не подключено: функция
// просто кладёт событие в dataLayer, если он есть.
//
// ЗАПОЛНИТЕ: подключите свой счётчик — например, в app/layout.tsx добавьте
// скрипт Яндекс.Метрики или GA4, а здесь вызовите ym(ID,'reachGoal',event)
// либо gtag('event', event, payload).
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type ConversionEvent =
  | 'booking_open'      // нажата любая кнопка «Записаться»
  | 'booking_submit'    // форма записи заполнена и отправлена
  | 'phone_click'       // клик по номеру телефона
  | 'route_click'       // клик по кнопке «Построить маршрут»
  | 'messenger_click';  // клик по мессенджеру

export function track(event: ConversionEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}

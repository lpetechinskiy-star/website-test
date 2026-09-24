// ЗАПОЛНИТЕ: все значения ниже — заглушки. Подставьте данные клиники, и они
// сразу подтянутся в шапку, блок контактов, футер и разметку Schema.org.
export const CLINIC = {
  name: 'Стоматология',
  phone: '+7 (000) 000-00-00',
  phoneHref: 'tel:+70000000000',
  email: 'hello@example.com',
  address: 'г. Город, ул. Улица, 1',
  addressLocality: 'Город',
  postalCode: '000000',
  hours: 'пн–сб, 9:00–21:00',
  hoursSchema: 'Mo-Sa 09:00-21:00',
  // Маршрут строится поиском по адресу. Замените на прямую ссылку с точкой
  // клиники, когда появится карточка организации на картах.
  routeUrl: 'https://yandex.ru/maps/?text=' + encodeURIComponent('г. Город, ул. Улица, 1'),
  whatsapp: 'https://wa.me/70000000000',
  telegram: 'https://t.me/example',
  social: {
    linkedin: '#',
    instagram: '#',
    tiktok: '#',
  },
} as const;

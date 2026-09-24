import type { Metadata } from 'next';

import { CLINIC } from '@/lib/clinic';
import './globals.css';

export const metadata: Metadata = {
  title: 'Стоматология — лечение, имплантация и гигиена без страха',
  description:
    'Стоматология для всей семьи: консультация со снимком и планом лечения, лечение кариеса под микроскопом, имплантация, гигиена и детский приём. Запись онлайн.',
  keywords: [
    'стоматология',
    'лечение кариеса',
    'имплантация зубов',
    'профессиональная гигиена',
    'детский стоматолог',
    'запись к стоматологу',
  ],
  icons: { icon: '/logo.svg' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'Стоматология — здоровая улыбка без страха',
    description:
      'Спокойный приём, честный план лечения и цена до начала работ. Запись на приём онлайн.',
  },
};

// ЗАПОЛНИТЕ: разметка организации для поисковиков. Все значения берутся из
// lib/clinic.ts — замените их на реальные, и разметка обновится сама.
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: CLINIC.name,
  description:
    'Стоматологическая клиника: терапия, имплантация, гигиена, отбеливание, детский приём.',
  telephone: CLINIC.phone,
  email: CLINIC.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CLINIC.address,
    addressLocality: CLINIC.addressLocality,
    postalCode: CLINIC.postalCode,
    addressCountry: 'RU',
  },
  openingHours: CLINIC.hoursSchema,
  priceRange: '₽₽',
  availableService: [
    'Консультация и осмотр',
    'Лечение кариеса',
    'Профессиональная гигиена',
    'Отбеливание',
    'Имплантация',
    'Детская стоматология',
  ].map((name) => ({ '@type': 'MedicalProcedure', name })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        />
      </body>
    </html>
  );
}

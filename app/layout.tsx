import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Стоматология — Footer',
  description: 'Бережный уход, современные технологии и забота об улыбке.',
  icons: { icon: '/logo.svg' },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="ru"><body>{children}</body></html>;
}

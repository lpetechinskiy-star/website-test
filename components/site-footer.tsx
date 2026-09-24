import BrandLogo from '@/app/brand-logo';
import { TrackedLink } from '@/components/ui/tracked-link';
import { CLINIC } from '@/lib/clinic';

const NAV = [
  { href: '#services', label: 'Услуги' },
  { href: '#doctors', label: 'Врачи' },
  { href: '#prices', label: 'Цены' },
  { href: '#tech', label: 'Технологии' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'Вопросы' },
];

const SOCIAL = [
  { href: CLINIC.social.linkedin, src: '/linkedin.svg', label: 'LinkedIn' },
  { href: CLINIC.social.instagram, src: '/instagram.svg', label: 'Instagram' },
  { href: CLINIC.social.tiktok, src: '/tiktok.svg', label: 'TikTok' },
];

export function SiteFooter() {
  return (
    <footer className="footer" id="contacts" aria-label="Контакты и навигация">
      <div className="jobs">
        <span className="tag">нужен осмотр?</span>
        <span className="headline job-title">забота о вас<br />и мастерство</span>
        <nav className="footer-nav" aria-label="Разделы сайта">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="logo" role="img" aria-label="Логотип стоматологии">
        <BrandLogo />
      </div>

      <div className="contact">
        <span className="tag">записаться</span>
        <div className="headline contact-links">
          <span>приходите к нам!</span>
          <span>доверьте нам улыбку*</span>
        </div>

        <address className="footer-contacts">
          <TrackedLink href={CLINIC.phoneHref} event="phone_click" aria-label={`Позвонить по номеру ${CLINIC.phone}`}>
            {CLINIC.phone}
          </TrackedLink>
          <span>{CLINIC.address}</span>
          <span>{CLINIC.hours}</span>
        </address>

        <p className="note">*здоровая улыбка начинается с одного визита. ждём вас.</p>

        <div className="socials">
          {SOCIAL.map((item) => (
            <a key={item.label} href={item.href} aria-label={item.label}>
              <img src={item.src} alt="" width="35" height="35" />
            </a>
          ))}
        </div>

        {/* ЗАПОЛНИТЕ: замените тексты в public/privacy.html и public/consent.html
            на документы клиники. */}
        <div className="footer-legal">
          <a href="privacy.html">Политика конфиденциальности</a>
          <a href="consent.html">Согласие на обработку данных</a>
        </div>
      </div>
    </footer>
  );
}

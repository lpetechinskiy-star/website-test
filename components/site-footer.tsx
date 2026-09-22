import BrandLogo from '@/app/brand-logo';

export function SiteFooter() {
  return (
    <footer className="footer" id="contacts" aria-label="Footer">
      <div className="jobs">
        <span className="tag">нужен осмотр?</span>
        <span className="headline job-title">забота о вас<br />и мастерство</span>
        <div className="footer-nav">
          <span>Услуги</span>
          <span>О нас</span>
          <span>Технологии</span>
          <span>Контакты</span>
        </div>
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
        <p className="note">*здоровая улыбка начинается с одного визита. ждём вас.</p>
        <div className="socials">
          <span aria-label="LinkedIn"><img src="/linkedin.svg" alt="" width="35" height="35" /></span>
          <span aria-label="Instagram"><img src="/instagram.svg" alt="" width="35" height="35" /></span>
          <span aria-label="TikTok"><img src="/tiktok.svg" alt="" width="35" height="35" /></span>
        </div>
      </div>
    </footer>
  );
}

import { BookingProvider } from '@/components/booking/booking-provider';
import { LegalProvider } from '@/components/legal/legal-provider';
import { About } from '@/components/sections/about';
import { ContactCta } from '@/components/sections/contact-cta';
import { Doctors } from '@/components/sections/doctors';
import { Faq } from '@/components/sections/faq';
import { Hero } from '@/components/sections/hero';
import { Marquee } from '@/components/sections/marquee';
import { Prices } from '@/components/sections/prices';
import { Process } from '@/components/sections/process';
import { Reviews } from '@/components/sections/reviews';
import { Services } from '@/components/sections/services';
import { Technologies } from '@/components/sections/technologies';
import { WhyUs } from '@/components/sections/why-us';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function Home() {
  return (
    <LegalProvider>
      <BookingProvider>
        <SiteHeader />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <WhyUs />
          <Doctors />
          <Prices />
          <Technologies />
          <About />
          <Process />
          <Reviews />
          <Faq />
          <ContactCta />
        </main>
        <SiteFooter />
      </BookingProvider>
    </LegalProvider>
  );
}

import { About } from '@/components/sections/about';
import { ContactCta } from '@/components/sections/contact-cta';
import { Hero } from '@/components/sections/hero';
import { Marquee } from '@/components/sections/marquee';
import { Process } from '@/components/sections/process';
import { Services } from '@/components/sections/services';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Process />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  );
}

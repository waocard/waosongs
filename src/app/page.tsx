// src/app/page.tsx
import Header from '@/components/layout/header';
import Hero from '@/components/home/hero';
import Categories from '@/components/home/categories';
import HowItWorks from '@/components/home/how-it-works';
import Testimonials from '@/components/home/testimonials';
import CallToAction from '@/components/home/call-to-action';
import Footer from '@/components/layout/footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
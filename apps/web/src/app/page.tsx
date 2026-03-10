import { Metadata } from 'next';
import {
  HeroSection,
  StatsSection,
  ServicesPreviewSection,
  HowItWorksSection,
  TrustBadgesSection,
  WhoIsThisForSection,
  TestimonialsSection,
  HomeFAQSection,
  CTASection,
} from '@/components/sections';

export const metadata: Metadata = {
  title: 'Buy Followers YouTube & Grow Faster | Grow Media Fans',
  description:
    'Buy followers YouTube safely and effectively with Grow Media Fans. Get YouTube views, subscribers, watch time, likes, and comments. Fast delivery, 24/7 support.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://growmediafans.com'}/`,
  },
  openGraph: {
    title: 'Growmediafans - Premium YouTube Growth Services',
    description:
      'Boost your YouTube channel with premium growth services. Get real views, subscribers, watch time, and comments.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Preview */}
      <ServicesPreviewSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Trust Badges / Why Choose Us */}
      <TrustBadgesSection />

      {/* Who Is This For */}
      <WhoIsThisForSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Homepage FAQ */}
      <HomeFAQSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}

import { Metadata } from 'next';
import {
  HeroSection,
  StatsSection,
  ServicesPreviewSection,
  HowItWorksSection,
  TrustBadgesSection,
  TestimonialsSection,
  CTASection,
} from '@/components/sections';

export const metadata: Metadata = {
  title: 'AYN YouTube - Premium YouTube Growth Services',
  description:
    'Boost your YouTube channel with premium growth services. Get real views, subscribers, watch time, and comments. Trusted by 50,000+ creators.',
  openGraph: {
    title: 'AYN YouTube - Premium YouTube Growth Services',
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

      {/* Trust Badges */}
      <TrustBadgesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}

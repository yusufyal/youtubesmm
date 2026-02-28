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
  title: 'Get YouTube Followers & Grow Your YouTube Channel Fast',
  description:
    'Get YouTube followers and grow your YouTube channel faster. Buy YouTube followers safely with a trusted service. Start boosting your channel today!',
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

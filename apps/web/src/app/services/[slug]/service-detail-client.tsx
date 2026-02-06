'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Eye,
  Users,
  Clock,
  MessageCircle,
  Play,
  Shield,
  Zap,
  Check,
  Sparkles,
  Star,
  Lock,
  RefreshCcw,
  ArrowRight,
} from 'lucide-react';
import { FloatingElement } from '@/components/animations/floating';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { PackageCard } from '@/components/cards/package-card';
import { NewExpressCheckout } from '@/components/checkout/new-express-checkout';

// New SEO-focused sections
import { ServiceBenefits } from '@/components/sections/service-benefits';
import { ServiceHowItWorks } from '@/components/sections/service-how-it-works';
import { ServiceFAQ } from '@/components/sections/service-faq';
import { ServiceComparison } from '@/components/sections/service-comparison';
import { ServiceReviews } from '@/components/sections/service-reviews';
import { TrustBar, InlineTrustBar, CustomerCount } from '@/components/ui/trust-bar';
import { LiveNotification, LiveCounter, MiniNotification } from '@/components/ui/live-notification';

interface Package {
  id: number;
  name: string;
  quantity: number;
  price: number;
  original_price?: number;
  min_quantity: number;
  max_quantity: number;
  description?: string;
  featured?: boolean;
  estimated_time?: string;
}

interface Service {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  short_description?: string;
  packages?: Package[];
}

interface ServiceDetailClientProps {
  service: Service;
}

const serviceIcons: Record<string, React.ElementType> = {
  views: Eye,
  subscribers: Users,
  watch_time: Clock,
  comments: MessageCircle,
  default: Play,
};

const serviceColors: Record<string, { gradient: string; glow: string; bg: string }> = {
  views: {
    gradient: 'from-red-500 to-pink-500',
    glow: 'rgba(239, 68, 68, 0.4)',
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  subscribers: {
    gradient: 'from-purple-500 to-indigo-500',
    glow: 'rgba(139, 92, 246, 0.4)',
    bg: 'rgba(139, 92, 246, 0.1)',
  },
  watch_time: {
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6, 182, 212, 0.4)',
    bg: 'rgba(6, 182, 212, 0.1)',
  },
  comments: {
    gradient: 'from-green-500 to-emerald-500',
    glow: 'rgba(34, 197, 94, 0.4)',
    bg: 'rgba(34, 197, 94, 0.1)',
  },
  default: {
    gradient: 'from-neon-pink to-neon-purple',
    glow: 'rgba(255, 8, 68, 0.4)',
    bg: 'rgba(255, 8, 68, 0.1)',
  },
};

const features = [
  { icon: Shield, text: '100% Safe & Secure' },
  { icon: Zap, text: 'Fast Delivery' },
  { icon: Lock, text: 'No Password Required' },
  { icon: RefreshCcw, text: 'Refill Guarantee' },
  { icon: Star, text: '24/7 Support' },
];

// Extended SEO content for service types
const getServiceSEOContent = (serviceType: string, serviceName: string) => {
  const content: Record<string, { intro: string; whyBuy: string; ourService: string }> = {
    views: {
      intro: `Looking to buy YouTube views? You've come to the right place. AYN YouTube offers premium, high-quality YouTube views that help boost your video's visibility and credibility. Our views come from real accounts with genuine activity, ensuring your content gets the exposure it deserves while keeping your channel safe.`,
      whyBuy: `Buying YouTube views is one of the most effective strategies for kickstarting your channel's growth. When new viewers see a video with thousands of views, they're more likely to click, watch, and engage. This social proof creates a powerful snowball effect that can transform your channel's reach. YouTube's algorithm also favors videos with higher view counts, meaning more organic exposure in search results and recommendations.`,
      ourService: `At AYN YouTube, we've perfected the art of delivering high-quality YouTube views. Unlike other providers who use bots or low-quality sources, our views come from real accounts with genuine watch time. This means your videos don't just get numbers – they get engagement signals that YouTube's algorithm loves. Our gradual delivery system ensures natural-looking growth that protects your channel while maximizing results.`,
    },
    subscribers: {
      intro: `Want to grow your YouTube subscriber base quickly? AYN YouTube provides real, high-quality subscribers that help establish your channel's credibility and unlock new opportunities. Our subscribers come from genuine accounts, giving your channel the social proof it needs to attract even more organic growth.`,
      whyBuy: `Subscribers are the foundation of any successful YouTube channel. They're the first to see your new uploads, they help your videos gain initial traction, and they're essential for reaching YouTube's monetization requirements. Buying subscribers accelerates this process, helping you reach milestones faster and establish authority in your niche.`,
      ourService: `Our YouTube subscriber service delivers real accounts that help your channel grow sustainably. We focus on quality over quantity, ensuring each subscriber adds genuine value to your channel's metrics. With our gradual delivery and high retention rates, your subscriber count will grow naturally and safely.`,
    },
    watch_time: {
      intro: `Need to boost your YouTube watch time? AYN YouTube offers high-retention watch time packages designed to help you reach YouTube's monetization requirements faster. Our service delivers real watch hours that count toward your Partner Program eligibility.`,
      whyBuy: `Watch time is YouTube's most important ranking factor and a key requirement for monetization. You need 4,000 watch hours in the past 12 months to join the YouTube Partner Program. Building this organically can take years – our watch time service compresses that timeline significantly while maintaining quality and safety.`,
      ourService: `Our watch time service is specifically designed with monetization in mind. Every hour we deliver is from high-retention views that YouTube counts toward your total. We spread delivery naturally over time, ensuring your analytics look organic while helping you reach your monetization goals faster.`,
    },
    comments: {
      intro: `Looking to boost engagement on your YouTube videos? AYN YouTube provides authentic-looking comments that spark conversations and encourage organic interaction. Our comments help make your videos appear more popular and engaging to new viewers.`,
      whyBuy: `Comments are one of the strongest engagement signals on YouTube. Videos with active comment sections get promoted more by the algorithm and appear more trustworthy to viewers. Starting conversations on your videos encourages organic viewers to join in, creating a community around your content.`,
      ourService: `Our comment service delivers relevant, natural-looking comments that blend seamlessly with organic engagement. We offer both random relevant comments and custom comment options to match your content. All comments come from aged accounts with activity history, ensuring authenticity.`,
    },
    default: {
      intro: `Boost your YouTube presence with AYN YouTube's premium services. We offer high-quality, safe solutions to help grow your channel and reach your goals faster.`,
      whyBuy: `Growing a YouTube channel organically takes time and consistent effort. Our services help accelerate this process by providing the initial momentum and social proof needed to attract organic growth. Think of it as a strategic investment in your channel's future.`,
      ourService: `At AYN YouTube, quality and safety are our top priorities. We use only compliant methods that protect your channel while delivering real results. Our customer support team is available 24/7 to assist with any questions or concerns.`,
    },
  };

  return content[serviceType] || content.default;
};

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const Icon = serviceIcons[service.type] || serviceIcons.default;
  const colors = serviceColors[service.type] || serviceColors.default;
  const seoContent = getServiceSEOContent(service.type, service.name);

  const lowestPrice = service.packages?.[0]?.price;
  const highestQuantity = service.packages?.[service.packages.length - 1]?.quantity;

  return (
    <main className="relative min-h-screen pt-20">
      {/* Live Notifications - positioned fixed */}
      <LiveNotification serviceType={service.type} colors={colors} />

      {/* Background - Light mode */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: colors.bg, opacity: 0.2 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[128px]" />
      </div>

      {/* Floating decorations */}
      <FloatingElement
        className="absolute top-40 right-[5%] hidden xl:block z-0"
        duration={8}
        distance={25}
      >
        <motion.div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-glow-md`}
        >
          <Icon className="w-10 h-10 text-white" />
        </motion.div>
      </FloatingElement>

      <div className="container relative z-10 px-4 pb-24">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-500 mb-8 py-4"
        >
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/services" className="hover:text-gray-900 transition-colors">
            Services
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{service.name}</span>
        </motion.nav>

        {/* Hero Section with Checkout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left Column - Service Info */}
          <div>
            {/* Service Header */}
            <ScrollReveal>
              <div className="flex items-start gap-5 mb-8">
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-glow-md`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Buy {service.name}
                  </h1>
                  <p className="text-gray-600">
                    {service.short_description || 'Boost your YouTube presence with real, high-quality engagement'}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Live Counter */}
            <ScrollReveal delay={0.05}>
              <div className="mb-6">
                <LiveCounter serviceType={service.type} colors={colors} />
              </div>
            </ScrollReveal>

            {/* Price Preview */}
            {lowestPrice && (
              <ScrollReveal delay={0.1}>
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-gray-500">Starting at</span>
                  <span className={`text-4xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                    ${lowestPrice}
                  </span>
                  {highestQuantity && (
                    <span className="text-gray-500">
                      • Up to {highestQuantity.toLocaleString()} units
                    </span>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Features */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-glow-sm`}>
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* SEO Introduction Content */}
            <ScrollReveal delay={0.3}>
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-card mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-pink" />
                  About {service.name}
                </h2>
                <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                  <p>{seoContent.intro}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Customer Count & Trust */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap gap-4 items-center">
                <CustomerCount />
                <MiniNotification serviceType={service.type} colors={colors} />
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Checkout */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NewExpressCheckout service={service} colors={colors} />
              <InlineTrustBar colors={colors} />
            </motion.div>
          </div>
        </div>

        {/* Trust Bar */}
        <TrustBar colors={colors} />

        {/* Why Buy Section - SEO Content */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto my-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Why Buy {service.name} for Your YouTube Channel?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>{seoContent.whyBuy}</p>
              <p className="mt-4">{seoContent.ourService}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Benefits Section */}
        <ServiceBenefits
          serviceType={service.type}
          serviceName={service.name}
          colors={colors}
        />

        {/* How It Works Section */}
        <ServiceHowItWorks
          serviceName={service.name}
          serviceType={service.type}
          colors={colors}
        />

        {/* Comparison Section */}
        <ServiceComparison serviceName={service.name} colors={colors} />

        {/* Reviews Section */}
        <ServiceReviews
          serviceName={service.name}
          serviceType={service.type}
          colors={colors}
        />

        {/* FAQ Section */}
        <ServiceFAQ
          serviceName={service.name}
          serviceType={service.type}
          colors={colors}
        />

        {/* Bottom CTA */}
        <ScrollReveal>
          <div className="text-center py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Grow Your YouTube Channel?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join over 1 million satisfied customers who have boosted their YouTube presence with AYN YouTube. 
              Start seeing results today!
            </p>
            <motion.a
              href="#checkout"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r ${colors.gradient} text-white font-semibold text-lg shadow-glow-md`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

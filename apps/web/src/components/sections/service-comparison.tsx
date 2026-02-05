'use client';

import { motion } from 'framer-motion';
import {
  Check,
  X,
  AlertCircle,
  Shield,
  Clock,
  Headphones,
  DollarSign,
  RefreshCcw,
  Lock,
  Users,
  Zap,
  Award,
  Star,
} from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

interface ServiceComparisonProps {
  serviceName: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

interface ComparisonRow {
  feature: string;
  icon: React.ElementType;
  us: string | boolean;
  others: string | boolean;
  description?: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Real Accounts',
    icon: Users,
    us: true,
    others: 'Often bots',
    description: 'We only deliver from genuine accounts with real activity history',
  },
  {
    feature: 'Delivery Speed',
    icon: Zap,
    us: '5-30 min start',
    others: 'Hours or days',
    description: 'Your order starts processing within minutes of payment',
  },
  {
    feature: 'Pricing',
    icon: DollarSign,
    us: 'Transparent',
    others: 'Hidden fees',
    description: 'No hidden charges or surprise fees - what you see is what you pay',
  },
  {
    feature: 'Customer Support',
    icon: Headphones,
    us: '24/7 Live',
    others: 'Limited hours',
    description: 'Our support team is available around the clock via chat and email',
  },
  {
    feature: 'Refill Guarantee',
    icon: RefreshCcw,
    us: '30 days',
    others: 'None or limited',
    description: 'Free refills if you experience any drop within 30 days',
  },
  {
    feature: 'Account Safety',
    icon: Shield,
    us: '100% Safe',
    others: 'Risky methods',
    description: 'Our methods are designed to keep your account in good standing',
  },
  {
    feature: 'Password Required',
    icon: Lock,
    us: false,
    others: 'Sometimes yes',
    description: 'We never ask for your login credentials - just your video URL',
  },
  {
    feature: 'Gradual Delivery',
    icon: Clock,
    us: true,
    others: 'Instant (risky)',
    description: 'Natural-looking growth pattern that protects your channel',
  },
  {
    feature: 'Money-back Guarantee',
    icon: Award,
    us: true,
    others: 'Rarely offered',
    description: 'Full refund if you\'re not satisfied with our service',
  },
  {
    feature: 'Retention Rate',
    icon: Star,
    us: '95%+',
    others: '50-70%',
    description: 'Industry-leading retention rates that last',
  },
];

export function ServiceComparison({ serviceName, colors }: ServiceComparisonProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const renderValue = (value: string | boolean, isUs: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <motion.div
          className={`w-8 h-8 rounded-full ${isUs ? `bg-gradient-to-r ${colors.gradient}` : 'bg-red-100'} flex items-center justify-center`}
          whileHover={{ scale: 1.1 }}
        >
          {isUs ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <X className="w-4 h-4 text-red-500" />
          )}
        </motion.div>
      ) : (
        <motion.div
          className={`w-8 h-8 rounded-full ${isUs ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}
          whileHover={{ scale: 1.1 }}
        >
          {isUs ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </motion.div>
      );
    }

    return (
      <span className={`text-sm font-medium ${isUs ? 'text-green-600' : 'text-red-500'}`}>
        {value}
      </span>
    );
  };

  return (
    <section className="py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: colors.bg, opacity: 0.08 }}
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${colors.gradient} text-white mb-4 shadow-glow-sm`}
            >
              <Award className="w-4 h-4" />
              Why Choose Us
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AYN YouTube vs.{' '}
              <span className="text-gray-400">Other Providers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how we compare to other {serviceName.toLowerCase()} providers. We're confident 
              we offer the best quality, safety, and value in the industry.
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          {/* Table Header */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-4 px-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-sm text-gray-500">Feature</div>
            <div className="text-center">
              <motion.div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.gradient} shadow-glow-sm`}
              >
                <Star className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">AYN YouTube</span>
              </motion.div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Other Providers</span>
              </div>
            </div>
          </motion.div>

          {/* Table Rows */}
          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {comparisonData.map((row, index) => (
              <motion.div
                key={row.feature}
                variants={rowVariants}
                className="group"
              >
                <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-card transition-all duration-300">
                  {/* Feature */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-glow-sm`}>
                      <row.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{row.feature}</div>
                      {row.description && (
                        <div className="text-xs text-gray-500 hidden md:block">
                          {row.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Us */}
                  <div className="flex justify-center">
                    {renderValue(row.us, true)}
                  </div>

                  {/* Others */}
                  <div className="flex justify-center">
                    {renderValue(row.others, false)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Summary */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 max-w-3xl mx-auto">
            <motion.div
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-card"
              whileHover={{ borderColor: 'rgb(229, 231, 235)' }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-glow-md`}
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Why Risk Your Channel With Unproven Providers?
                  </h3>
                  <p className="text-gray-600">
                    With over <span className="text-gray-900 font-semibold">1 million satisfied customers</span> and 
                    a <span className="text-gray-900 font-semibold">5-year track record</span>, AYN YouTube is the trusted 
                    choice for YouTube growth. Our commitment to quality and safety sets us apart from the competition.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  Users,
  Star,
  Clock,
  CheckCircle,
  CreditCard,
  Headphones,
  RefreshCcw,
  Lock,
  Globe,
  Zap,
} from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

interface TrustBarProps {
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

const pressLogos = [
  { name: 'HubSpot', brightness: 0.6 },
  { name: 'Forbes', brightness: 0.6 },
  { name: 'Inc.', brightness: 0.6 },
  { name: 'TechCrunch', brightness: 0.6 },
  { name: 'Mashable', brightness: 0.6 },
  { name: 'Entrepreneur', brightness: 0.6 },
];

const stats = [
  { value: '1M+', label: 'Happy Customers', icon: Users },
  { value: '50M+', label: 'Orders Delivered', icon: CheckCircle },
  { value: '5+', label: 'Years in Business', icon: Clock },
  { value: '4.9/5', label: 'Customer Rating', icon: Star },
];

const trustBadges = [
  { icon: Shield, label: '100% Safe', color: 'text-green-600' },
  { icon: Lock, label: 'Secure Payments', color: 'text-blue-600' },
  { icon: RefreshCcw, label: '30-Day Refill', color: 'text-purple-600' },
  { icon: Headphones, label: '24/7 Support', color: 'text-cyan-600' },
  { icon: CreditCard, label: 'Money Back', color: 'text-yellow-600' },
  { icon: Zap, label: 'Instant Start', color: 'text-orange-600' },
];

export function TrustBar({ colors }: TrustBarProps) {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent" />

      <div className="relative z-10">
        {/* Press Mentions */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-6">
              As Featured In
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {pressLogos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold text-gray-300 hover:text-gray-500 transition-all cursor-default"
                >
                  {logo.name}
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Counter */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                className="text-center"
              >
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.gradient} mb-2 shadow-glow-sm`}
                >
                  <stat.icon className="w-4 h-4 text-white" />
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                </motion.div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Trust Badges */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:shadow-card transition-all"
              >
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-sm text-gray-700">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Compact inline trust bar for checkout area
interface InlineTrustBarProps {
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

export function InlineTrustBar({ colors }: InlineTrustBarProps) {
  const inlineBadges = [
    { icon: Shield, label: 'Safe & Secure' },
    { icon: RefreshCcw, label: '30-Day Guarantee' },
    { icon: Headphones, label: '24/7 Support' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {inlineBadges.map((badge, index) => (
        <motion.div
          key={badge.label}
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <badge.icon className="w-4 h-4 text-green-600" />
          <span className="text-xs text-gray-600">{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Full-width promotional banner
interface PromoBannerProps {
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

export function PromoBanner({ colors }: PromoBannerProps) {
  return (
    <motion.div
      className={`relative overflow-hidden py-3 bg-gradient-to-r ${colors.gradient}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent, white, transparent)',
          backgroundSize: '200% 100%',
        }}
      />

      <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap px-4">
        <motion.div
          className="flex items-center gap-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">
            Limited Time: Get 20% OFF with code <span className="font-bold">GROW20</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-4 text-white/90 text-xs">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Instant Delivery
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> 100% Safe
          </span>
          <span className="flex items-center gap-1">
            <RefreshCcw className="w-3 h-3" /> Money Back Guarantee
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Floating trust indicators
interface FloatingTrustIndicatorProps {
  position?: 'left' | 'right';
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

export function FloatingTrustIndicator({ position = 'right', colors }: FloatingTrustIndicatorProps) {
  return (
    <motion.div
      className={`fixed ${position === 'right' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 z-40 hidden xl:block`}
      initial={{ opacity: 0, x: position === 'right' ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex flex-col gap-3">
        {[
          { icon: Shield, label: 'Safe' },
          { icon: Zap, label: 'Fast' },
          { icon: Award, label: 'Quality' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur border border-gray-200 flex flex-col items-center justify-center gap-1 cursor-default shadow-card"
            whileHover={{
              scale: 1.1,
              borderColor: `${colors.glow}60`,
              boxShadow: `0 0 20px ${colors.glow}20`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
          >
            <item.icon className="w-5 h-5 text-gray-700" />
            <span className="text-[8px] text-gray-500 uppercase">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Customer count indicator
export function CustomerCount() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ borderColor: 'rgb(209, 213, 219)' }}
    >
      <div className="flex -space-x-2">
        {['JD', 'MK', 'AR', 'SL'].map((initials, index) => (
          <motion.div
            key={initials}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center text-[10px] font-medium text-white border-2 border-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {initials}
          </motion.div>
        ))}
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">2,847</span> orders this week
      </span>
    </motion.div>
  );
}

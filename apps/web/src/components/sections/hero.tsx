'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { FloatingElement } from '../animations/floating';
import { ScrollReveal, TextReveal } from '../animations/scroll-reveal';

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <FloatingElement
        className="absolute top-1/4 left-[10%] hidden lg:block"
        duration={8}
        distance={30}
      >
        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-white/5 shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center">
          <Play className="w-8 h-8 text-neon-pink fill-neon-pink/30" />
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute top-1/3 right-[15%] hidden lg:block"
        duration={10}
        distance={25}
        delay={2}
      >
        <div className="w-16 h-16 rounded-xl bg-white dark:bg-white/5 shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-neon-purple" />
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-1/4 left-[20%] hidden lg:block"
        duration={7}
        distance={20}
        delay={4}
      >
        <div className="w-14 h-14 rounded-lg bg-white dark:bg-white/5 shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-neon-cyan" />
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-1/3 right-[10%] hidden lg:block"
        duration={9}
        distance={35}
        delay={1}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 border border-neon-pink/20 dark:border-neon-pink/30" />
      </FloatingElement>

      {/* Main Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 shadow-md dark:shadow-none border border-gray-100 dark:border-white/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-pink" />
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Trusted by 50,000+ content creators
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gray-900 dark:text-white">Grow Your </span>
            <span className="text-gradient">YouTube</span>
            <br />
            <span className="text-gray-900 dark:text-white">Channel </span>
            <span className="relative inline-block">
              <span className="text-gradient">Faster</span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <motion.path
                  d="M2 8 Q 100 0, 198 8"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff0844" />
                    <stop offset="100%" stopColor="#ff6b8a" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Premium YouTube growth services with real engagement. Get more views,
            subscribers, watch time, and comments to accelerate your success.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/services">
              <motion.button
                className="neon-button text-lg px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-5 h-5" />
                Browse Services
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link href="#how-it-works">
              <motion.button
                className="px-8 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 flex items-center gap-2 bg-white dark:bg-white/5 shadow-sm dark:shadow-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                How It Works
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neon-pink" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-pink" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-pink" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 rounded-full bg-neon-pink"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

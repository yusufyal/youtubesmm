'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';
import { FloatingElement } from '../animations/floating';

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 8, 68, 0.08) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating elements */}
      <FloatingElement
        className="absolute top-1/4 left-[10%] hidden lg:block"
        duration={6}
        distance={20}
      >
        <div className="w-16 h-16 rounded-xl bg-white dark:bg-white/5 shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-neon-pink" />
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-1/4 right-[10%] hidden lg:block"
        duration={8}
        distance={25}
        delay={2}
      >
        <div className="w-14 h-14 rounded-lg bg-white dark:bg-white/5 shadow-lg dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center">
          <Zap className="w-6 h-6 text-neon-purple" />
        </div>
      </FloatingElement>

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/20 mb-8"
          >
            <Zap className="w-4 h-4 text-neon-pink" />
            <span className="text-sm text-neon-pink font-medium">
              Limited Time Offer
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to <span className="text-gradient">Supercharge</span>
            <br />
            Your YouTube Growth?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto"
          >
            Join thousands of successful creators. Get started today with our
            premium growth services and see results within hours.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/services">
              <motion.button
                className="group relative px-10 py-5 rounded-2xl font-semibold text-lg text-white overflow-hidden shadow-glow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-pink"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  }}
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-gray-500 dark:text-gray-500"
          >
            No credit card required • Cancel anytime • 24/7 Support
          </motion.p>
        </div>
      </div>
    </section>
  );
}

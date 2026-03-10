'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Target } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const benefits = [
  { icon: Award, text: 'Improve channel credibility' },
  { icon: TrendingUp, text: 'Strengthen brand image' },
  { icon: BarChart3, text: 'Boost engagement metrics' },
  { icon: Target, text: 'Accelerate monetization goals' },
];

export function BuildAuthoritySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Why It Works
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Build Authority. Increase Visibility.{' '}
              <span className="text-gradient">Grow Faster.</span>
            </h2>
          </ScrollReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed"
          >
            Buying followers and engagement strategically can help trigger organic growth.
            When viewers see an active, growing channel, they are more likely to subscribe,
            engage, and trust your content.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-500 dark:text-gray-400 mb-10"
          >
            That&apos;s why thousands of creators choose Grow Media Fans to:
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <motion.div
                  className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-card dark:shadow-none hover:shadow-card-hover dark:hover:shadow-neon transition-all duration-300 h-full flex flex-col items-center text-center"
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 flex items-center justify-center mb-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    <item.icon className="w-6 h-6 text-neon-pink" />
                  </motion.div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.text}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

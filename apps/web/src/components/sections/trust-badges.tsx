'use client';

import { motion } from 'framer-motion';
import { Shield, CreditCard, Clock, Headphones, RefreshCcw, Lock } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const badges = [
  {
    icon: Shield,
    title: 'Fast & Secure Delivery',
    description: 'When you buy followers YouTube from Grow Media Fans, delivery starts immediately with realistic growth patterns.',
  },
  {
    icon: CreditCard,
    title: 'Simple Ordering System',
    description: 'Safe and smooth checkout process with secure, SSL-encrypted payments.',
  },
  {
    icon: Clock,
    title: 'Realistic Growth Patterns',
    description: 'Natural-looking growth designed to enhance credibility and long-term channel performance.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Customer Support',
    description: 'Expert help available 24/7. We are committed to helping creators and businesses grow.',
  },
  {
    icon: RefreshCcw,
    title: '100% Confidential Process',
    description: 'We never ask for your password. Your login credentials are never needed.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is never shared with third parties. Complete account safety guaranteed.',
  },
];

export function TrustBadgesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />

      <div className="container relative z-10 px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-gradient">Grow Media Fans</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            When you choose to buy followers YouTube from Grow Media Fans, you get more than just numbers
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                className="relative p-6 rounded-2xl bg-white border border-gray-100 h-full shadow-card hover:shadow-card-hover transition-all duration-300"
                whileHover={{ y: -5, borderColor: 'rgba(255, 8, 68, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <badge.icon className="w-6 h-6 text-neon-pink" />
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {badge.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {badge.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

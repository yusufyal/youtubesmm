'use client';

import { motion } from 'framer-motion';
import { Shield, CreditCard, Clock, Headphones, RefreshCcw, Lock } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const badges = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your channel is safe. We never ask for passwords.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'SSL encrypted payments with multiple options.',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Orders start processing within minutes.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Expert help available around the clock.',
  },
  {
    icon: RefreshCcw,
    title: 'Refill Guarantee',
    description: 'Free refills if counts drop within warranty.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is never shared with third parties.',
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
            Why Choose <span className="text-gradient">Us</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best service for your YouTube growth
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

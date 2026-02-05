'use client';

import { motion } from 'framer-motion';
import { Users, Eye, Clock, Star } from 'lucide-react';
import { AnimatedCounter } from '../animations/counter';
import { ScrollReveal } from '../animations/scroll-reveal';

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: '+',
    label: 'Happy Customers',
    color: 'from-neon-pink to-rose-500',
    glow: 'rgba(255, 8, 68, 0.15)',
  },
  {
    icon: Eye,
    value: 500,
    suffix: 'M+',
    label: 'Views Delivered',
    color: 'from-neon-purple to-violet-500',
    glow: 'rgba(124, 58, 237, 0.15)',
  },
  {
    icon: Clock,
    value: 99.9,
    suffix: '%',
    label: 'Uptime',
    color: 'from-neon-cyan to-blue-500',
    glow: 'rgba(6, 182, 212, 0.15)',
    decimals: 1,
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    label: 'Customer Rating',
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.15)',
    decimals: 1,
  },
];

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent" />

      <div className="container relative z-10 px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join the community of successful content creators who trust us for their growth
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card */}
              <div className="relative p-6 md:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-card dark:shadow-none overflow-hidden hover:shadow-card-hover dark:hover:shadow-neon transition-shadow duration-300">
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.glow}, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 relative z-10 shadow-glow-sm`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Value */}
                <div className="relative z-10">
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                      delay={index * 0.2}
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
                </div>

                {/* Border gradient on hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

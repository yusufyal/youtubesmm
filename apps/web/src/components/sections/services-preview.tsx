'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Eye, Users, Clock, MessageCircle } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const services = [
  {
    icon: Eye,
    name: 'YouTube Views',
    description: 'Boost your video visibility with real, high-retention views that help your content rank higher.',
    color: 'from-red-500 to-pink-500',
    glow: 'rgba(239, 68, 68, 0.15)',
    href: '/services/youtube-views',
    price: 2.99,
  },
  {
    icon: Users,
    name: 'Subscribers',
    description: 'Grow your channel with real subscribers who are genuinely interested in your content.',
    color: 'from-purple-500 to-indigo-500',
    glow: 'rgba(139, 92, 246, 0.15)',
    href: '/services/youtube-subscribers',
    price: 4.99,
  },
  {
    icon: Clock,
    name: 'Watch Time',
    description: 'Increase your watch hours to meet monetization requirements and improve algorithm ranking.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6, 182, 212, 0.15)',
    href: '/services/youtube-watch-time',
    price: 9.99,
  },
  {
    icon: MessageCircle,
    name: 'Comments',
    description: 'Boost engagement with relevant, authentic comments that spark conversations.',
    color: 'from-green-500 to-emerald-500',
    glow: 'rgba(34, 197, 94, 0.15)',
    href: '/services/youtube-comments',
    price: 3.99,
  },
];

export function ServicesPreviewSection() {
  return (
    <section className="relative py-24 overflow-hidden" id="services">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to <span className="text-gradient">Grow</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Premium YouTube growth services designed to help your channel reach its full potential
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={service.href}>
                <motion.div
                  className="relative group h-full"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Card */}
                  <div className="relative h-full p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 overflow-hidden shadow-card dark:shadow-none hover:shadow-card-hover dark:hover:shadow-neon transition-shadow duration-300">
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                      style={{ background: `radial-gradient(circle, ${service.glow}, transparent 70%)` }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-glow-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <service.icon className="w-7 h-7 text-white" />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gradient transition-all duration-300">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-xs">From</span>
                          <span className={`ml-1 font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                            ${service.price}
                          </span>
                        </div>
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Border on hover */}
                    <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/services">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

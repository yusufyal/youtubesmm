'use client';

import { motion } from 'framer-motion';
import { Video, TrendingUp, Building2, Briefcase, Users2 } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const audiences = [
  {
    icon: Video,
    title: 'New YouTube Creators',
    description: 'Building early momentum and establishing credibility in crowded niches.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Influencers',
    description: 'Increasing social proof and growing your audience reach faster.',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Building2,
    title: 'Brands & Businesses',
    description: 'Improving visibility and growing digital authority on YouTube.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Briefcase,
    title: 'Digital Marketers',
    description: 'Boosting campaign performance with strategic YouTube growth.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users2,
    title: 'Agencies',
    description: 'Managing multiple channels with scalable growth solutions.',
    color: 'from-green-500 to-emerald-500',
  },
];

export function WhoIsThisForSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 px-4">
        <ScrollReveal className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Built For Growth
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Who Is <span className="text-gradient">This For</span>?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Grow Media Fans is ideal for anyone who wants to grow faster and stand out in a competitive space
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {audiences.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                className="relative p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 h-full text-center shadow-card dark:shadow-none hover:shadow-card-hover dark:hover:shadow-neon transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-glow-sm`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          If you want to grow faster and stand out in a competitive space,
          our services help give your channel the boost it needs.
        </motion.p>
      </div>
    </section>
  );
}

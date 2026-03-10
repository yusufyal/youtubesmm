'use client';

import { motion } from 'framer-motion';
import { Search, ShoppingCart, Rocket, CheckCircle } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const steps = [
  {
    icon: Search,
    title: 'Select Your Service',
    description: 'Choose to buy followers YouTube, views, subscribers, watch time, likes, or comments.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: ShoppingCart,
    title: 'Enter Your Link',
    description: 'Provide your channel or video link. No password required.',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Rocket,
    title: 'Complete Checkout',
    description: 'Safe and smooth transaction process with secure payment.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: CheckCircle,
    title: 'Watch Your Channel Grow',
    description: 'Fast delivery begins immediately. No complicated steps required.',
    color: 'from-green-500 to-emerald-500',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 overflow-hidden" id="how-it-works">
      <div className="container relative z-10 px-4">
        <ScrollReveal className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Simple Process
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Growing your YouTube channel with Grow Media Fans is easy
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-red-500 via-purple-500 via-cyan-500 to-green-500 opacity-20" />

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
                <motion.div
                  className={`w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 relative shadow-glow-sm`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <step.icon className="w-12 h-12 text-gray-700" />
                  </div>

                  {/* Step number badge */}
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                  >
                    {index + 1}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 text-gray-500 font-medium"
          >
            No complicated steps. No technical knowledge required.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

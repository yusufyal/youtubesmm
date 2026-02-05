'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Gaming Creator',
    avatar: 'A',
    rating: 5,
    content:
      "Incredible service! My channel grew from 1K to 10K subscribers in just 2 months. The views are real and the engagement is amazing.",
    color: 'from-red-500 to-pink-500',
  },
  {
    name: 'Sarah Miller',
    role: 'Lifestyle Vlogger',
    avatar: 'S',
    rating: 5,
    content:
      "Finally found a service that delivers what they promise. The watch time helped me reach monetization faster than expected!",
    color: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'Marcus Johnson',
    role: 'Music Producer',
    avatar: 'M',
    rating: 5,
    content:
      "Best investment for my YouTube career. Fast delivery, great support, and most importantly - real results that stick.",
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Emily Davis',
    role: 'Tech Reviewer',
    avatar: 'E',
    rating: 5,
    content:
      "The quality of views and engagement is top-notch. My videos now rank much higher in search. Highly recommended!",
    color: 'from-green-500 to-emerald-500',
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-pink/5 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 px-4">
        <ScrollReveal className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied creators who've accelerated their growth with us
          </p>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-card h-full group hover:shadow-card-hover transition-shadow duration-300"
                whileHover={{ y: -5, borderColor: 'rgba(255, 8, 68, 0.2)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100 group-hover:text-neon-pink/20 transition-colors duration-300" />

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-semibold shadow-glow-sm`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-pink/0 to-neon-purple/0 group-hover:from-neon-pink/5 group-hover:to-neon-purple/5 transition-all duration-500 pointer-events-none" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

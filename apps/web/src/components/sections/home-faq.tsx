'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '../animations/scroll-reveal';

const faqs = [
  {
    question: 'Is it safe to buy followers YouTube from Grow Media Fans?',
    answer:
      'Yes. We use secure delivery systems and realistic growth methods to ensure your channel remains protected. We never ask for your password, keeping your account completely safe.',
  },
  {
    question: 'How fast will I see results after purchasing?',
    answer:
      'Most orders begin processing shortly after checkout. Delivery speed depends on the package selected, but growth typically starts within hours.',
  },
  {
    question: 'Will buying followers help my channel grow organically?',
    answer:
      'When you buy followers YouTube, it improves your social proof and credibility. A stronger follower count can encourage more real viewers to subscribe and engage with your content.',
  },
  {
    question: 'Do I need to provide my YouTube login details?',
    answer:
      'No. We only require your channel or video link. Your login credentials are never needed.',
  },
  {
    question: 'Can I also buy YouTube views and watch time together?',
    answer:
      'Absolutely. Many creators combine services like buy YouTube views, buy YouTube watch time, and buy YouTube subscribers for stronger overall performance and faster monetization progress.',
  },
  {
    question: 'Is this suitable for new YouTube channels?',
    answer:
      'Yes. New creators often use our services to build early momentum, establish credibility, and compete in crowded niches.',
  },
];

export function HomeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 px-4">
        <ScrollReveal className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            FAQ
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about buying YouTube followers and growth services
          </p>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div
                className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-card dark:shadow-none overflow-hidden transition-all duration-300 hover:shadow-card-hover dark:hover:shadow-neon"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}

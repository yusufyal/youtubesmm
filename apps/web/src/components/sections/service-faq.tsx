'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  serviceName: string;
  serviceType: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

const getFAQsForService = (serviceType: string, serviceName: string): FAQ[] => {
  const baseFAQs: FAQ[] = [
    {
      question: `Is it safe to buy YouTube ${serviceName.toLowerCase()}?`,
      answer: `Yes, buying ${serviceName.toLowerCase()} from AYN YouTube is completely safe. We use organic delivery methods that comply with YouTube's terms of service. We never use bots or fake accounts that could harm your channel. Our gradual delivery system mimics natural growth patterns, ensuring your channel remains in good standing. We've served over 1 million customers without a single account suspension related to our services.`,
    },
    {
      question: `Will I get banned for buying ${serviceName.toLowerCase()}?`,
      answer: `No, you will not get banned for using our service. We prioritize your channel's safety above all else. Our delivery methods are designed to appear completely natural to YouTube's algorithm. We've been in business for over 5 years and have never had a customer banned due to our services. Your channel's security is guaranteed.`,
    },
    {
      question: 'Do you need my YouTube password?',
      answer: `Absolutely not! We will never ask for your password or any login credentials. All we need is the public URL of your YouTube video or channel. This keeps your account 100% secure. Any service that asks for your password should be avoided - legitimate providers never need access to your account.`,
    },
    {
      question: `How fast will I receive my ${serviceName.toLowerCase()}?`,
      answer: `Delivery typically begins within 5-30 minutes of your purchase. We use a gradual delivery system to ensure natural-looking growth. Smaller packages are usually completed within 24-48 hours, while larger packages may take several days to deliver fully. You can track your order progress in real-time through your dashboard.`,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various cryptocurrency options including Bitcoin and Ethereum. All payments are processed through secure, encrypted channels. We also offer local payment options in many countries for your convenience.',
    },
    {
      question: `What happens if my ${serviceName.toLowerCase()} drop?`,
      answer: `We offer a 30-day refill guarantee on all packages. If you experience any drop in your ${serviceName.toLowerCase()} count within 30 days of delivery completion, simply contact our support team and we'll refill them for free. Our retention rates are among the highest in the industry, but we stand behind our service.`,
    },
    {
      question: 'Are the views/subscribers from real accounts?',
      answer: 'Yes! We only deliver from real accounts with genuine activity history. These are not bot accounts or fake profiles. Our network consists of real users who engage with content naturally. This ensures your metrics look authentic and provide genuine value to your channel.',
    },
    {
      question: 'Will this help my video rank better on YouTube?',
      answer: `Yes, increasing your ${serviceName.toLowerCase()} can positively impact your video's ranking. YouTube's algorithm considers engagement metrics when deciding which videos to recommend. Higher numbers signal popularity and can lead to better placement in search results, suggested videos, and the YouTube homepage.`,
    },
    {
      question: 'Can I buy for multiple videos at once?',
      answer: 'Yes! You can place separate orders for different videos or use our bulk ordering feature for better pricing. Many customers split their orders across multiple videos to boost their entire channel. Contact our support for custom bulk packages if you have specific needs.',
    },
    {
      question: 'Is there a maximum amount I can buy?',
      answer: `While we offer packages up to certain limits for instant ordering, there's no true maximum. For very large orders, we recommend contacting our support team for custom packages. We can accommodate orders of any size while maintaining safe delivery speeds and quality.`,
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we provide 24/7 customer support via live chat, email, and ticket system. Our support team is knowledgeable and responsive, typically answering queries within minutes. Whether you have questions before purchasing or need help with an existing order, we\'re always here to assist.',
    },
    {
      question: 'Will my existing subscribers know I bought services?',
      answer: 'No, there is no way for anyone to know you used our service. The growth appears completely organic and natural. Your existing subscribers, viewers, and even YouTube itself cannot distinguish between organic growth and our delivered services.',
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a money-back guarantee. If you\'re not satisfied with our service for any reason, contact our support team within 30 days of purchase. We\'ll either resolve the issue or provide a full refund. Your satisfaction is our top priority.',
    },
    {
      question: 'Does this work for new YouTube channels?',
      answer: 'Absolutely! Our services are especially helpful for new channels trying to establish credibility. New channels often struggle with the "cold start" problem - viewers are hesitant to engage with content that has low numbers. Our services help you overcome this hurdle and kickstart your growth.',
    },
    {
      question: 'Will this help me get monetized faster?',
      answer: 'Yes, particularly if you\'re working toward YouTube\'s monetization requirements (1,000 subscribers and 4,000 watch hours). Our services can help you reach these thresholds faster, allowing you to start earning revenue from your content sooner. We also offer specific watch time packages designed for monetization.',
    },
    {
      question: 'How do I track my order?',
      answer: 'After placing your order, you\'ll receive a confirmation email with your order ID. You can log into your dashboard anytime to track delivery progress in real-time. You\'ll see exactly how many units have been delivered and the estimated completion time.',
    },
    {
      question: 'Do you offer any discounts?',
      answer: 'Yes! We regularly offer promotional discounts and coupon codes. First-time customers often receive welcome discounts, and we have special offers during holidays and events. Sign up for our newsletter to stay updated on the latest deals, or check our homepage for current promotions.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We take data privacy seriously. All personal and payment information is encrypted using industry-standard SSL technology. We never share your data with third parties and comply with all relevant data protection regulations. Your privacy is completely protected.',
    },
  ];

  // Add service-specific FAQs
  const specificFAQs: Record<string, FAQ[]> = {
    views: [
      {
        question: 'What is the retention rate of the views?',
        answer: 'Our views come with high retention rates, typically between 60-80% watch time. This means viewers watch a significant portion of your video, which sends positive signals to YouTube\'s algorithm. High retention views are much more valuable than quick, low-retention views.',
      },
      {
        question: 'Will the views help my video go viral?',
        answer: 'While we can\'t guarantee virality (no one can), boosting your view count significantly increases your chances. Higher view counts lead to better algorithm placement, which can trigger organic viral growth. Many of our customers have seen their videos take off after using our services.',
      },
    ],
    subscribers: [
      {
        question: 'Will the subscribers engage with my future content?',
        answer: 'While we focus on delivering real accounts, engagement on future content varies. The primary benefit is the social proof and credibility that a higher subscriber count provides, which encourages organic viewers to subscribe and engage. For guaranteed engagement, consider combining with our other services.',
      },
      {
        question: 'Can I target subscribers from specific countries?',
        answer: 'Yes, we offer geo-targeted subscriber packages for many countries. This is useful if you create content for specific regions or languages. Contact our support team to discuss targeted options and availability for your preferred locations.',
      },
    ],
    watch_time: [
      {
        question: 'Will the watch time count toward monetization?',
        answer: 'Yes, our watch time is designed to count toward YouTube\'s monetization requirements. We deliver high-retention views that accumulate genuine watch hours. Many customers have successfully reached the 4,000 watch hour threshold using our services.',
      },
      {
        question: 'How is watch time calculated?',
        answer: 'Watch time is measured in total hours watched across all your videos. YouTube requires 4,000 public watch hours in the past 12 months for monetization. Our service delivers views with extended watch duration to maximize your watch time accumulation.',
      },
    ],
    comments: [
      {
        question: 'Can I provide custom comments?',
        answer: 'Yes! We offer both random relevant comments and custom comment options. You can provide specific comments you want posted, or give us guidelines about the topics and tone you prefer. Custom comments help make the engagement look more authentic and relevant to your content.',
      },
      {
        question: 'Will the comments look natural?',
        answer: 'Absolutely. Our comments are written by real people and designed to appear natural and relevant to your content. We avoid generic or spammy comments that could look suspicious. Each comment is crafted to encourage genuine discussion and engagement.',
      },
    ],
  };

  return [...baseFAQs, ...(specificFAQs[serviceType] || [])];
};

// Generate FAQPage Schema
export function generateFAQSchema(faqs: FAQ[]): object {
  return {
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
  };
}

export function ServiceFAQ({ serviceName, serviceType, colors }: ServiceFAQProps) {
  const faqs = getFAQsForService(serviceType, serviceName);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: colors.bg, opacity: 0.1 }}
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${colors.gradient} text-white mb-4 shadow-glow-sm`}
            >
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions About{' '}
              <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {serviceName}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about buying {serviceName.toLowerCase()}. 
              Can't find what you're looking for? Our 24/7 support team is here to help.
            </p>
          </div>
        </ScrollReveal>

        {/* Search Bar */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-neon-pink/10 transition-all shadow-card"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <motion.div
                className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                initial={false}
                animate={{
                  borderColor: openIndex === index ? `${colors.glow}40` : 'rgb(243, 244, 246)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-8">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 ${openIndex === index ? 'text-neon-pink' : 'text-gray-400'}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No questions found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-neon-pink hover:underline mt-2"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* Still Have Questions */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center p-8 rounded-3xl bg-white border border-gray-100 shadow-card">
              <MessageCircle className="w-10 h-10 text-neon-pink mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Still Have Questions?</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                Our friendly support team is available 24/7 to answer any questions you might have.
              </p>
              <motion.button
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${colors.gradient} text-white font-medium shadow-glow-md`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import {
  Package,
  Link as LinkIcon,
  CreditCard,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
} from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

interface ServiceHowItWorksProps {
  serviceName: string;
  serviceType: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

const steps = [
  {
    number: '01',
    icon: Package,
    title: 'Select Your Package',
    description: 'Choose from our range of packages designed to fit any budget and goal. Whether you need a small boost or massive growth, we have the perfect option for you.',
    tip: 'Start small and scale up based on results',
  },
  {
    number: '02',
    icon: LinkIcon,
    title: 'Enter Your Video URL',
    description: 'Simply paste the link to your YouTube video. We never ask for your password or any sensitive account information. Your security is our priority.',
    tip: 'Make sure your video is set to public',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Complete Secure Payment',
    description: 'Choose from multiple secure payment options including credit cards, PayPal, and cryptocurrency. All transactions are encrypted and protected.',
    tip: 'We accept Visa, Mastercard, and PayPal',
  },
  {
    number: '04',
    icon: Shield,
    title: 'Order Processing',
    description: 'Our system automatically processes your order and prepares it for delivery. Most orders begin processing within minutes of payment confirmation.',
    tip: 'Average processing time: 5-30 minutes',
  },
  {
    number: '05',
    icon: Zap,
    title: 'Gradual Delivery Starts',
    description: 'We begin delivering your order gradually to ensure natural-looking growth. This protects your channel and maximizes the effectiveness of each unit delivered.',
    tip: 'Natural delivery pattern for safety',
  },
  {
    number: '06',
    icon: CheckCircle,
    title: 'Watch Your Growth',
    description: 'Monitor your progress in real-time as your numbers grow. Track delivery status in your dashboard and watch your channel reach new heights.',
    tip: 'Track progress in your dashboard',
  },
];

export function ServiceHowItWorks({ serviceName, serviceType, colors }: ServiceHowItWorksProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: colors.bg, opacity: 0.15 }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: colors.bg, opacity: 0.1 }}
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${colors.gradient} text-white mb-4 shadow-glow-sm`}
            >
              <Play className="w-4 h-4" />
              Simple Process
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Buy{' '}
              <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {serviceName}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy! Follow these simple steps to boost your YouTube presence 
              in just minutes. No technical knowledge required.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[39px] top-24 w-0.5 h-16 bg-gradient-to-b from-gray-200 to-transparent hidden md:block" />
              )}

              <div className="flex gap-6 mb-8 group">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {/* Icon container */}
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-glow-sm`}>
                      <step.icon className="w-8 h-8 text-white" />
                      
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-gray-700">{step.number}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-card shadow-card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      {step.title}
                      {index === steps.length - 1 && (
                        <motion.span
                          className="text-green-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${colors.gradient} bg-opacity-10 text-gray-700`}>
                        💡 {step.tip}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Message */}
        <ScrollReveal delay={0.5}>
          <div className="text-center mt-12">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-card"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255, 8, 68, 0.3)' }}
            >
              <motion.div
                className="w-3 h-3 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-gray-600">
                Average delivery starts within <span className="text-gray-900 font-semibold">5-30 minutes</span> of purchase
              </span>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

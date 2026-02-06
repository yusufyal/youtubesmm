'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Users, Clock, MessageCircle, ThumbsUp, Share2, Search, Filter, Sparkles, Shield, Zap } from 'lucide-react';
import { ServiceCard } from '@/components/cards/service-card';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { FloatingElement } from '@/components/animations/floating';

interface Service {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  short_description?: string;
  packages?: Array<{ id: number; price: number }>;
}

interface ServicesPageClientProps {
  services: Service[];
}

const serviceTypes = [
  { id: 'all', label: 'All Services', icon: Sparkles },
  { id: 'views', label: 'Views', icon: Eye },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
  { id: 'watch_time', label: 'Watch Time', icon: Clock },
  { id: 'comments', label: 'Comments', icon: MessageCircle },
  { id: 'likes', label: 'Likes', icon: ThumbsUp },
];

const features = [
  {
    icon: Shield,
    title: '100% Safe',
    description: 'Compliant with YouTube guidelines',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Orders start within minutes',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Sparkles,
    title: 'Refill Guarantee',
    description: 'Free refills if counts drop',
    color: 'from-purple-500 to-indigo-500',
  },
];

export function ServicesPageClient({ services }: ServicesPageClientProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((service) => {
    const matchesFilter = activeFilter === 'all' || service.type === activeFilter;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="relative min-h-screen pt-24">
      {/* Background Elements - Light mode */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[128px]" />
      </div>

      {/* Floating decorations - Light mode */}
      <FloatingElement
        className="absolute top-40 right-[10%] hidden xl:block z-0"
        duration={8}
        distance={25}
      >
        <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 shadow-card flex items-center justify-center">
          <Eye className="w-8 h-8 text-neon-pink/50" />
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute top-80 left-[5%] hidden xl:block z-0"
        duration={10}
        distance={30}
        delay={2}
      >
        <div className="w-14 h-14 rounded-lg bg-white border border-gray-100 shadow-card flex items-center justify-center">
          <Users className="w-6 h-6 text-neon-purple/50" />
        </div>
      </FloatingElement>

      <div className="container relative z-10 px-4 pb-24">
        {/* Hero Section - Light mode */}
        <ScrollReveal className="text-center mb-12">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Premium Services
          </motion.span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            YouTube <span className="text-gradient">Growth</span> Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our range of premium services to boost your channel.
            Fast delivery, real results, and 24/7 support.
          </p>
        </ScrollReveal>

        {/* Features Bar - Light mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: 'rgb(229, 231, 235)' }}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-glow-sm`}>
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter - Light mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-neon-pink/10 transition-all shadow-card"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {serviceTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === type.id
                    ? 'bg-neon-pink text-white shadow-glow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                slug={service.slug}
                description={service.short_description || service.description}
                type={service.type}
                minPrice={service.packages?.[0]?.price ? Number(service.packages[0].price) : undefined}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State - Light mode */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <motion.button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2 rounded-xl bg-neon-pink/10 border border-neon-pink/20 text-neon-pink font-medium hover:bg-neon-pink/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}

        {/* Results count */}
        {filteredServices.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8"
          >
            Showing {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
          </motion.p>
        )}
      </div>
    </main>
  );
}

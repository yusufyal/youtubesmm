'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Verified,
  ThumbsUp,
  Calendar,
  Package,
} from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

interface ServiceReviewsProps {
  serviceName: string;
  serviceType: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

interface Review {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  packagePurchased: string;
  title: string;
  review: string;
  verified: boolean;
  helpful: number;
}

const getReviewsForService = (serviceType: string): Review[] => {
  const baseReviews: Review[] = [
    {
      id: 1,
      name: 'Sarah M.',
      location: 'United States',
      avatar: 'SM',
      rating: 5,
      date: '2 days ago',
      packagePurchased: '10,000 Package',
      title: 'Exactly what I needed to kickstart my channel!',
      review: `I was skeptical at first, but AYN YouTube completely exceeded my expectations. My video went from struggling to get noticed to appearing in suggested videos within a week. The delivery was gradual and looked completely natural. My organic views have also increased significantly since using this service. Highly recommend!`,
      verified: true,
      helpful: 47,
    },
    {
      id: 2,
      name: 'Michael T.',
      location: 'United Kingdom',
      avatar: 'MT',
      rating: 5,
      date: '1 week ago',
      packagePurchased: '25,000 Package',
      title: 'Best investment for my YouTube growth',
      review: `As a new YouTuber, I was struggling to get any traction. After using AYN YouTube's services, my channel has grown from 200 to over 5,000 subscribers organically! The initial boost gave me the credibility I needed. Customer support was also incredibly helpful when I had questions.`,
      verified: true,
      helpful: 63,
    },
    {
      id: 3,
      name: 'Emily R.',
      location: 'Canada',
      avatar: 'ER',
      rating: 5,
      date: '3 days ago',
      packagePurchased: '5,000 Package',
      title: 'Fast delivery and great results',
      review: `Delivery started within 15 minutes of my purchase. Everything looked natural and my video is now performing much better in search results. I've ordered three times now and each experience has been perfect. The pricing is also very fair compared to other providers I've tried.`,
      verified: true,
      helpful: 38,
    },
    {
      id: 4,
      name: 'David K.',
      location: 'Australia',
      avatar: 'DK',
      rating: 4,
      date: '5 days ago',
      packagePurchased: '50,000 Package',
      title: 'Solid service, would recommend',
      review: `Great service overall. The delivery took a bit longer than expected for my large order, but support kept me updated throughout the process. The quality is excellent and I haven't experienced any drops. Will definitely order again for my future videos.`,
      verified: true,
      helpful: 29,
    },
    {
      id: 5,
      name: 'Jessica L.',
      location: 'Germany',
      avatar: 'JL',
      rating: 5,
      date: '1 week ago',
      packagePurchased: '15,000 Package',
      title: 'Finally hit monetization requirements!',
      review: `I've been trying to reach YouTube's monetization threshold for months. AYN YouTube helped me get there in just a few weeks. The watch time counted toward my total and I'm now a YouTube Partner! The process was smooth and my channel is thriving. Thank you!`,
      verified: true,
      helpful: 82,
    },
    {
      id: 6,
      name: 'Robert H.',
      location: 'France',
      avatar: 'RH',
      rating: 5,
      date: '4 days ago',
      packagePurchased: '20,000 Package',
      title: 'Professional service with real results',
      review: `I run a business channel and needed to establish credibility quickly. AYN YouTube delivered exactly what they promised. My videos now look established and professional, which has helped me close more deals. The ROI on this investment has been incredible.`,
      verified: true,
      helpful: 45,
    },
  ];

  return baseReviews;
};

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
  const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export function ServiceReviews({ serviceName, serviceType, colors }: ServiceReviewsProps) {
  const reviews = getReviewsForService(serviceType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const visibleReviews = 3;
  const maxIndex = reviews.length - visibleReviews;

  const nextReview = () => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevReview = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Calculate average rating
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = 2847; // Simulated total reviews

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
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
              <Star className="w-4 h-4" />
              Customer Reviews
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say About{' '}
              <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {serviceName}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. See what thousands of satisfied customers 
              have to say about their experience with our {serviceName.toLowerCase()} service.
            </p>
          </div>
        </ScrollReveal>

        {/* Rating Summary */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-card">
              <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
              <div>
                <StarRating rating={Math.round(parseFloat(averageRating))} size="lg" />
                <p className="text-sm text-gray-500 mt-1">
                  Based on {totalReviews.toLocaleString()} reviews
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <p className="text-sm text-gray-500">Satisfied</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1M+</div>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-20 px-4">
            <motion.button
              onClick={prevReview}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full bg-white border border-gray-200 shadow-card flex items-center justify-center pointer-events-auto ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 hover:shadow-card-hover'
              }`}
              whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.9 } : {}}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <motion.button
              onClick={nextReview}
              disabled={currentIndex >= maxIndex}
              className={`w-12 h-12 rounded-full bg-white border border-gray-200 shadow-card flex items-center justify-center pointer-events-auto ${
                currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 hover:shadow-card-hover'
              }`}
              whileHover={currentIndex < maxIndex ? { scale: 1.1 } : {}}
              whileTap={currentIndex < maxIndex ? { scale: 0.9 } : {}}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>

          {/* Reviews Grid */}
          <div className="overflow-hidden px-16">
            <motion.div
              className="flex gap-6"
              animate={{ x: -currentIndex * (100 / visibleReviews + 2) + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-card-hover transition-all duration-300 group shadow-card">
                    {/* Quote Icon */}
                    <Quote className={`w-8 h-8 mb-4 text-gray-100 group-hover:text-neon-pink/20 transition-colors`} />

                    {/* Rating & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {review.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

                    {/* Review Text */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                      {review.review}
                    </p>

                    {/* Package */}
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Purchased: {review.packagePurchased}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-4">
                      {/* Reviewer Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-sm font-medium text-white shadow-glow-sm`}>
                            {review.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{review.name}</span>
                              {review.verified && (
                                <Verified className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{review.location}</span>
                          </div>
                        </div>
                        
                        {/* Helpful */}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{review.helpful}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? `w-8 bg-gradient-to-r ${colors.gradient}`
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Write Review CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Already a customer? Share your experience and help others make the right choice.
            </p>
            <motion.button
              className={`px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-card`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Write a Review
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

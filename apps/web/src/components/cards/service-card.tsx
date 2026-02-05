'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { MouseEvent, useRef } from 'react';
import { Eye, Users, Clock, MessageCircle, Play, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  minPrice?: number;
  icon?: string;
  index?: number;
}

const serviceIcons: Record<string, React.ElementType> = {
  views: Eye,
  subscribers: Users,
  watch_time: Clock,
  comments: MessageCircle,
  likes: TrendingUp,
  default: Play,
};

const serviceColors: Record<string, { gradient: string; glow: string }> = {
  views: {
    gradient: 'from-red-500 to-pink-500',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  subscribers: {
    gradient: 'from-purple-500 to-indigo-500',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  watch_time: {
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  comments: {
    gradient: 'from-green-500 to-emerald-500',
    glow: 'rgba(34, 197, 94, 0.4)',
  },
  likes: {
    gradient: 'from-orange-500 to-amber-500',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  default: {
    gradient: 'from-neon-pink to-neon-purple',
    glow: 'rgba(255, 8, 68, 0.4)',
  },
};

export function ServiceCard({
  name,
  slug,
  description,
  type,
  minPrice,
  index = 0,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = serviceIcons[type] || serviceIcons.default;
  const colors = serviceColors[type] || serviceColors.default;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="perspective-1000"
    >
      <Link href={`/services/${slug}`}>
        <div className="relative group h-full">
          {/* Card background - Light mode */}
          <div className="absolute inset-0 rounded-2xl bg-white transition-all duration-500" />

          {/* Glow effect on hover - subtle for light mode */}
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{
              background: `radial-gradient(circle at center, ${colors.glow.replace('0.4', '0.2')}, transparent 70%)`,
            }}
          />

          {/* Border - Light mode */}
          <div className="absolute inset-0 rounded-2xl border border-gray-100 group-hover:border-gray-200 transition-colors duration-500 shadow-card group-hover:shadow-card-hover" />

          {/* Content */}
          <div className="relative p-6 h-full flex flex-col">
            {/* Icon */}
            <motion.div
              className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center mb-5',
                'bg-gradient-to-br',
                colors.gradient,
                'shadow-glow-sm'
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>

            {/* Title */}
            <h3
              className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
            >
              {name}
            </h3>

            {/* Description */}
            <p
              className="text-gray-600 text-sm mb-5 flex-grow line-clamp-2"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(15px)' }}
            >
              {description}
            </p>

            {/* Footer */}
            <div
              className="flex items-center justify-between"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(25px)' }}
            >
              {minPrice !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">From</span>
                  <span className={cn('font-bold bg-gradient-to-r bg-clip-text text-transparent', colors.gradient)}>
                    ${minPrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Arrow */}
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'bg-gray-100 group-hover:bg-gradient-to-br',
                  colors.gradient,
                  'transition-all duration-300'
                )}
                whileHover={{ scale: 1.1 }}
              >
                <Zap className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </motion.div>
            </div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Featured service card (larger, more prominent) - Light mode
export function FeaturedServiceCard({
  name,
  slug,
  description,
  type,
  minPrice,
}: ServiceCardProps) {
  const Icon = serviceIcons[type] || serviceIcons.default;
  const colors = serviceColors[type] || serviceColors.default;

  return (
    <Link href={`/services/${slug}`}>
      <motion.div
        className="relative group overflow-hidden rounded-3xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background - Light mode */}
        <div className="absolute inset-0 bg-white" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${colors.glow.replace('0.4', '0.2')}, transparent 50%)`,
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative p-8 md:p-10">
          <div className="flex items-start gap-6">
            <motion.div
              className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0',
                'bg-gradient-to-br',
                colors.gradient,
                'shadow-glow-md'
              )}
              whileHover={{ rotate: 10 }}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            <div className="flex-grow">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-gradient transition-all duration-300">
                {name}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md">
                {description}
              </p>

              <div className="flex items-center gap-4">
                {minPrice !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Starting at</span>
                    <span className={cn('text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent', colors.gradient)}>
                      ${minPrice.toFixed(2)}
                    </span>
                  </div>
                )}

                <motion.button
                  className={cn(
                    'px-6 py-2 rounded-full font-semibold text-white',
                    'bg-gradient-to-r',
                    colors.gradient,
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-sm'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Border - Light mode */}
        <div className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-gray-200 transition-colors pointer-events-none shadow-card group-hover:shadow-card-hover" />
      </motion.div>
    </Link>
  );
}

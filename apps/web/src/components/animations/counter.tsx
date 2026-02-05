'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  formatNumber?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
  formatNumber = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const displayValue = useTransform(springValue, (latest) => {
    const formatted = decimals > 0 ? latest.toFixed(decimals) : Math.floor(latest);
    if (formatNumber && decimals === 0) {
      return Number(formatted).toLocaleString();
    }
    return formatted;
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        springValue.set(value);
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, value, springValue, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

// Counting with glow effect
interface GlowingCounterProps extends AnimatedCounterProps {
  glowColor?: string;
}

export function GlowingCounter({
  glowColor = 'rgba(255, 8, 68, 0.5)',
  className,
  ...props
}: GlowingCounterProps) {
  return (
    <motion.span
      className={className}
      animate={{
        textShadow: [
          `0 0 10px ${glowColor}`,
          `0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
          `0 0 10px ${glowColor}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <AnimatedCounter {...props} className="" />
    </motion.span>
  );
}

// Stats card with animated counter
interface StatCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function StatCard({
  value,
  label,
  prefix,
  suffix,
  icon,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="glass-card p-8 text-center">
        {icon && (
          <motion.div
            className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {icon}
          </motion.div>
        )}
        <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            delay={delay + 0.3}
          />
        </div>
        <p className="text-muted-foreground text-sm uppercase tracking-wider">
          {label}
        </p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-pink/0 to-neon-purple/0 group-hover:from-neon-pink/10 group-hover:to-neon-purple/10 transition-all duration-500 -z-10 blur-xl" />
    </motion.div>
  );
}

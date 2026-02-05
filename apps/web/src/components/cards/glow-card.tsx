'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
  glowIntensity?: number;
  onClick?: () => void;
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(255, 8, 68, 0.3)',
  tiltIntensity = 10,
  glowIntensity = 0.4,
  onClick,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), {
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

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-pointer',
        'transform-gpu perspective-1000',
        className
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background - Light mode */}
      <div className="absolute inset-0 bg-white rounded-2xl" />

      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent, ${glowColor.replace('0.3', '0.15')})`,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Glow effect - Subtle for light mode */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: glowIntensity }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Border - Light mode */}
      <div className="absolute inset-0 rounded-2xl border border-gray-100 pointer-events-none" />
    </motion.div>
  );
}

// Simpler glass card with hover glow - Light mode
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-white shadow-card',
        'border border-gray-100',
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/0 to-neon-purple/0 group-hover:from-neon-pink/5 group-hover:to-neon-purple/5 transition-all duration-500" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Card with animated border - Light mode
interface BorderAnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export function BorderAnimatedCard({ children, className }: BorderAnimatedCardProps) {
  return (
    <div className={cn('relative p-[1px] rounded-2xl overflow-hidden group', className)}>
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, #ff0844, #7c3aed, #ff0844)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '200% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Inner card - Light mode */}
      <div className="relative bg-white rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

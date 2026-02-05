'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
  rotate?: boolean;
  rotateAmount?: number;
}

export function FloatingElement({
  children,
  className,
  duration = 6,
  distance = 20,
  delay = 0,
  rotate = false,
  rotateAmount = 5,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
        ...(rotate && { rotate: [-rotateAmount, rotateAmount, -rotateAmount] }),
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating with mouse parallax effect
interface ParallaxFloatProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function ParallaxFloat({
  children,
  className,
  intensity = 20,
}: ParallaxFloatProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

// Pulsing glow animation
interface PulseGlowProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

export function PulseGlow({
  children,
  className,
  color = 'rgba(255, 8, 68, 0.5)',
  duration = 2,
  minOpacity = 0.4,
  maxOpacity = 0.8,
}: PulseGlowProps) {
  return (
    <motion.div
      className={`relative ${className || ''}`}
      animate={{
        boxShadow: [
          `0 0 20px ${color.replace('0.5', String(minOpacity))}`,
          `0 0 40px ${color.replace('0.5', String(maxOpacity))}, 0 0 60px ${color.replace('0.5', String(maxOpacity * 0.5))}`,
          `0 0 20px ${color.replace('0.5', String(minOpacity))}`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Orbiting element
interface OrbitingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  radius?: number;
  reverse?: boolean;
}

export function OrbitingElement({
  children,
  className,
  duration = 20,
  radius = 100,
  reverse = false,
}: OrbitingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        rotate: reverse ? -360 : 360,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        transformOrigin: `center ${radius}px`,
      }}
    >
      <motion.div
        animate={{
          rotate: reverse ? 360 : -360,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Bouncing element
interface BouncingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  height?: number;
}

export function BouncingElement({
  children,
  className,
  duration = 0.6,
  height = 10,
}: BouncingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -height, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

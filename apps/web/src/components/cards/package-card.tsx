'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackageCardProps {
  id: number;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  isSelected?: boolean;
  isPopular?: boolean;
  onSelect: () => void;
  index?: number;
}

export function PackageCard({
  name,
  quantity,
  price,
  description,
  isSelected = false,
  isPopular = false,
  onSelect,
  index = 0,
}: PackageCardProps) {
  const pricePerUnit = price / quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
      className="relative cursor-pointer group"
    >
      {/* Popular badge */}
      {isPopular && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple text-white text-xs font-semibold shadow-glow-sm">
            <Crown className="w-3 h-3" />
            Most Popular
          </div>
        </motion.div>
      )}

      {/* Card - Light mode */}
      <motion.div
        className={cn(
          'relative p-5 rounded-2xl transition-all duration-300',
          'border-2',
          isSelected
            ? 'border-neon-pink bg-neon-pink/5 shadow-glow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-card'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Selection indicator */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">{name}</h4>
            <p className="text-gray-500 text-sm">
              {quantity.toLocaleString()} units
            </p>
          </div>

          {/* Checkbox */}
          <motion.div
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              isSelected
                ? 'border-neon-pink bg-neon-pink'
                : 'border-gray-300 bg-transparent'
            )}
            animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </motion.div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gradient">
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            ${pricePerUnit.toFixed(4)} per unit
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}

        {/* Features for popular */}
        {isPopular && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
              <Zap className="w-3 h-3 text-neon-pink" />
              Fast Delivery
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
              <Sparkles className="w-3 h-3 text-neon-purple" />
              Best Value
            </span>
          </div>
        )}

        {/* Gradient border on selected */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 8, 68, 0.05), rgba(124, 58, 237, 0.05))',
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Compact package selector for inline use - Light mode
interface CompactPackageSelectorProps {
  packages: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CompactPackageSelector({
  packages,
  selectedId,
  onSelect,
}: CompactPackageSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {packages.map((pkg, index) => (
        <motion.button
          key={pkg.id}
          onClick={() => onSelect(pkg.id)}
          className={cn(
            'relative p-3 rounded-xl text-center transition-all duration-300',
            'border',
            selectedId === pkg.id
              ? 'border-neon-pink bg-neon-pink/5 shadow-glow-sm'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="text-sm text-gray-500 mb-1">
            {pkg.quantity.toLocaleString()}
          </div>
          <div
            className={cn(
              'text-lg font-bold',
              selectedId === pkg.id ? 'text-gradient' : 'text-gray-900'
            )}
          >
            ${pkg.price.toFixed(2)}
          </div>

          {/* Selection dot */}
          {selectedId === pkg.id && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-pink shadow-glow-sm"
              layoutId="packageDot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

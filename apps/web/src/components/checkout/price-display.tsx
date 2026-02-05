'use client';

import { Clock, Zap, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  deliveryTime?: string;
  discount?: number;
}

export function PriceDisplay({ price, originalPrice, deliveryTime, discount = 0 }: PriceDisplayProps) {
  const finalPrice = Math.max(0, price - discount);
  const savings = (originalPrice && originalPrice > price ? originalPrice - price : 0) + discount;
  const hasDiscount = savings > 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-6 space-y-4">
      {/* Price Display */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-4xl font-bold text-slate-900">
            {formatCurrency(finalPrice)}
          </span>
          {originalPrice && originalPrice > finalPrice && (
            <span className="text-xl text-slate-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {/* Savings Badge */}
        {hasDiscount && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              <Zap className="h-3 w-3" />
              You Save {formatCurrency(savings)}
            </span>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-slate-900">Fast Delivery</div>
            <div className="text-xs text-slate-500">{deliveryTime || '24-48 hours'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium text-slate-900">Safe & Secure</div>
            <div className="text-xs text-slate-500">100% guaranteed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

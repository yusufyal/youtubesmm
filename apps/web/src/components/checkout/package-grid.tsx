'use client';

import { cn } from '@/lib/utils';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface Package {
  id: number;
  name: string;
  quantity: number;
  price: number;
  original_price?: number;
  min_quantity: number;
  max_quantity: number;
  featured?: boolean;
  estimated_time?: string;
  description?: string;
}

interface PackageGridProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelect: (pkg: Package) => void;
  serviceType?: string;
}

// Get the discount amount
const getDiscount = (pkg: Package): number => {
  if (pkg.original_price && pkg.original_price > pkg.price) {
    return pkg.original_price - pkg.price;
  }
  return 0;
};

// Get badge type based on package properties
const getBadge = (pkg: Package, index: number, total: number): { text: string; color: string } | null => {
  if (pkg.featured) {
    return { text: 'BEST SELLING', color: 'bg-gradient-to-r from-orange-500 to-amber-500' };
  }
  if (index === total - 1 && total > 3) {
    return { text: 'BEST DEAL', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' };
  }
  if (pkg.quantity >= 50000) {
    return { text: 'BULK PRICE', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' };
  }
  return null;
};

// Format quantity for display (1000 -> 1K, 50000 -> 50K)
const formatQty = (qty: number): string => {
  if (qty >= 1000000) {
    return `${(qty / 1000000).toFixed(qty % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (qty >= 1000) {
    return `${(qty / 1000).toFixed(qty % 1000 === 0 ? 0 : 1)}K`;
  }
  return qty.toString();
};

// Get unit label based on service type
const getUnitLabel = (serviceType?: string): string => {
  switch (serviceType) {
    case 'views':
      return 'Views';
    case 'subscribers':
      return 'Subs';
    case 'likes':
      return 'Likes';
    case 'comments':
      return 'Comments';
    case 'watch_time':
      return 'Hours';
    default:
      return '';
  }
};

export function PackageGrid({ packages, selectedPackage, onSelect, serviceType }: PackageGridProps) {
  const unitLabel = getUnitLabel(serviceType);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {packages.map((pkg, index) => {
        const isSelected = selectedPackage?.id === pkg.id;
        const discount = getDiscount(pkg);
        const badge = getBadge(pkg, index, packages.length);

        return (
          <button
            key={pkg.id}
            onClick={() => onSelect(pkg)}
            className={cn(
              'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200',
              'hover:shadow-lg hover:-translate-y-0.5',
              isSelected
                ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-500/20'
                : 'border-slate-200 bg-white hover:border-rose-300'
            )}
          >
            {/* Badge */}
            {badge && (
              <div
                className={cn(
                  'absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap',
                  badge.color
                )}
              >
                {badge.text}
              </div>
            )}

            {/* Quantity */}
            <div className={cn(
              'text-xl font-bold',
              isSelected ? 'text-rose-600' : 'text-slate-900'
            )}>
              {formatQty(pkg.quantity)}
            </div>

            {/* Unit label (only for first package or if no discount) */}
            {index === 0 && unitLabel && (
              <div className="text-xs text-slate-500 mt-0.5">{unitLabel}</div>
            )}

            {/* Discount */}
            {discount > 0 ? (
              <div className={cn(
                'text-xs font-semibold mt-1',
                isSelected ? 'text-emerald-600' : 'text-emerald-500'
              )}>
                ${Math.round(discount)} OFF
              </div>
            ) : (
              <div className="text-xs text-slate-400 mt-1">
                {formatCurrency(pkg.price)}
              </div>
            )}

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

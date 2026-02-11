'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Loader2,
  Tag,
  Mail,
  ArrowRight,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import api from '@/lib/api';
import { PackageGrid } from './package-grid';
import { MultiLinkInput } from './multi-link-input';
import { PriceDisplay } from './price-display';

interface Package {
  id: number;
  name: string;
  quantity: number;
  price: number;
  original_price?: number;
  min_quantity: number;
  max_quantity: number;
  description?: string;
  featured?: boolean;
  estimated_time?: string;
}

interface Service {
  id: number;
  name: string;
  slug: string;
  type: string;
  packages?: Package[];
}

interface LinkItem {
  id: string;
  url: string;
  quantity: number;
  error?: string;
}

interface NewExpressCheckoutProps {
  service: Service;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

export function NewExpressCheckout({ service, colors }: NewExpressCheckoutProps) {
  const packages = service.packages || [];

  // Selected package state
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(packages[0] || null);

  // Links state (for multi-link splitting)
  const [links, setLinks] = useState<LinkItem[]>([
    { id: 'initial', url: '', quantity: selectedPackage?.quantity || 0 },
  ]);

  // Form state
  const [guestEmail, setGuestEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update links when package changes
  useEffect(() => {
    if (selectedPackage) {
      setLinks((prev) =>
        prev.map((link) => ({
          ...link,
          quantity: Math.floor(selectedPackage.quantity / prev.length),
        }))
      );
    }
  }, [selectedPackage]);

  // Calculate pricing
  const subtotal = selectedPackage?.price || 0;
  const discount = couponApplied?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  // Handle package selection
  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setCouponApplied(null);
    setError(null);
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsCouponLoading(true);
    try {
      const result = await api.validateCoupon(couponCode, subtotal);
      if (result.valid) {
        setCouponApplied({
          code: result.code,
          discount: result.discount,
        });
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid coupon code');
      setCouponApplied(null);
    } finally {
      setIsCouponLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!selectedPackage) {
      setError('Please select a package');
      return false;
    }

    // Check if all links have URLs
    const emptyLinks = links.filter((link) => !link.url.trim());
    if (emptyLinks.length > 0) {
      setError('Please enter a URL for all links');
      return false;
    }

    // Check for URL errors
    const linkErrors = links.filter((link) => link.error);
    if (linkErrors.length > 0) {
      setError('Please fix the URL errors');
      return false;
    }

    if (!guestEmail.trim()) {
      setError('Please enter your email address');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Prepare order data with multiple links
      const orderData = {
        package_id: selectedPackage!.id,
        quantity: selectedPackage!.quantity,
        links: links.map((link) => ({
          url: link.url,
          quantity: link.quantity,
        })),
        coupon_code: couponApplied?.code,
        guest_email: guestEmail,
      };

      // Create order in our backend
      const response = await api.createOrder(orderData);

      const gatewayUrl =
        process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL ||
        'https://viralreach-production.up.railway.app';
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      // Redirect to external payment gateway (Stripe Checkout via ViralReach)
      const paymentRes = await fetch(`${gatewayUrl}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          successUrl: `${siteUrl}/checkout/complete?order_id=${response.order_id}`,
          cancelUrl: window.location.href,
        }),
      });

      const paymentData = await paymentRes.json();

      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        setError('Payment initialization failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <p className="text-slate-500">No packages available for this service.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Express Checkout</h3>
              <p className="text-sm text-white/80">Complete your order in seconds</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Select Package */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold">
                1
              </div>
              <h4 className="font-semibold text-slate-900">Select Package</h4>
            </div>
            
            <PackageGrid
              packages={packages}
              selectedPackage={selectedPackage}
              onSelect={handlePackageSelect}
              serviceType={service.type}
            />
          </div>

          {/* Price Display */}
          <AnimatePresence mode="wait">
            {selectedPackage && (
              <motion.div
                key={selectedPackage.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PriceDisplay
                  price={selectedPackage.price}
                  originalPrice={selectedPackage.original_price}
                  deliveryTime={selectedPackage.estimated_time}
                  discount={discount}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Enter Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold">
                2
              </div>
              <h4 className="font-semibold text-slate-900">Enter Your Link(s)</h4>
            </div>
            
            <MultiLinkInput
              totalQuantity={selectedPackage?.quantity || 0}
              serviceType={service.type}
              links={links}
              onLinksChange={setLinks}
            />
          </div>

          {/* Step 3: Email & Coupon */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold">
                3
              </div>
              <h4 className="font-semibold text-slate-900">Your Details</h4>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4 text-rose-500" />
                Email Address
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-rose-500 focus:outline-none transition-all"
              />
              <p className="text-xs text-slate-500">
                We'll send your order confirmation here
              </p>
            </div>

            {/* Coupon Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Tag className="h-4 w-4 text-rose-500" />
                Coupon Code
                <span className="text-xs text-slate-400">(Optional)</span>
              </label>
              
              {couponApplied ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-700">
                      {couponApplied.code}
                    </span>
                    <span className="text-sm text-emerald-600">
                      (-{formatCurrency(couponApplied.discount)})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-rose-500 focus:outline-none transition-all uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isCouponLoading || !couponCode.trim()}
                    className="px-6 py-3 rounded-xl border-2 border-slate-200 font-medium text-slate-700 hover:border-rose-500 hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isCouponLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isLoading || !selectedPackage}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Buy Now - {formatCurrency(total)}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Password Required
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              24/7 Support
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

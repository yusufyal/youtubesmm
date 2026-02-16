'use client';

import { useState, useEffect } from 'react';
import type { Service, Package } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, isValidYouTubeVideoUrl, isValidYouTubeChannelUrl } from '@/lib/utils';
import api from '@/lib/api';

interface ExpressCheckoutProps {
  service: Service;
}

export function ExpressCheckout({ service }: ExpressCheckoutProps) {
  const packages = service.packages || [];
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(
    packages[0] || null
  );
  const [quantity, setQuantity] = useState<number>(selectedPackage?.quantity || 0);
  const [targetLink, setTargetLink] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  

  // Calculate price
  const calculatePrice = () => {
    if (!selectedPackage) return 0;
    
    if (quantity === selectedPackage.quantity) {
      return selectedPackage.price;
    }
    
    const pricePerUnit = selectedPackage.price / selectedPackage.quantity;
    return pricePerUnit * quantity;
  };

  const subtotal = calculatePrice();
  const discount = couponApplied?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  // Handle package change
  const handlePackageChange = (packageId: string) => {
    const pkg = packages.find((p) => p.id.toString() === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setQuantity(pkg.quantity);
      setCouponApplied(null);
    }
  };

  // Validate YouTube link
  const validateLink = (link: string) => {
    if (!link) {
      setLinkError(null);
      return true;
    }

    const isVideoService = ['views', 'watch_time', 'comments', 'likes', 'shares'].includes(
      service.type
    );
    const isChannelService = service.type === 'subscribers';

    if (isVideoService && !isValidYouTubeVideoUrl(link)) {
      setLinkError('Please enter a valid YouTube video URL');
      return false;
    }

    if (isChannelService && !isValidYouTubeChannelUrl(link)) {
      setLinkError('Please enter a valid YouTube channel URL');
      return false;
    }

    setLinkError(null);
    return true;
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
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
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }

    if (!targetLink) {
      setError('Please enter your YouTube URL');
      return;
    }

    if (!validateLink(targetLink)) {
      return;
    }

    if (!guestEmail) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.createOrder({
        package_id: selectedPackage.id,
        quantity,
        target_link: targetLink,
        coupon_code: couponApplied?.code,
        guest_email: guestEmail,
      });

      const gatewayUrl =
        process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL ||
        'https://hnh-media.com';
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

  const getTargetPlaceholder = () => {
    const isChannelService = service.type === 'subscribers';
    return isChannelService
      ? 'https://youtube.com/@yourchannel'
      : 'https://youtube.com/watch?v=...';
  };

  const getTargetLabel = () => {
    const isChannelService = service.type === 'subscribers';
    return isChannelService ? 'YouTube Channel URL' : 'YouTube Video URL';
  };

  return (
    <>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Order {service.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Package Selection */}
          <div className="space-y-2">
            <Label>Select Package</Label>
            <Select
              value={selectedPackage?.id.toString()}
              onValueChange={handlePackageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    <div className="flex items-center justify-between gap-4">
                      <span>
                        {pkg.name} - {formatNumber(pkg.quantity)}{' '}
                        {service.type === 'watch_time' ? 'hours' : service.type}
                      </span>
                      <span className="font-semibold">{formatCurrency(pkg.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          {selectedPackage && (
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || selectedPackage.quantity)}
                min={selectedPackage.min_quantity}
                max={selectedPackage.max_quantity}
              />
              <p className="text-xs text-muted-foreground">
                Min: {formatNumber(selectedPackage.min_quantity)} - Max:{' '}
                {formatNumber(selectedPackage.max_quantity)}
              </p>
            </div>
          )}

          {/* Target Link */}
          <div className="space-y-2">
            <Label>{getTargetLabel()}</Label>
            <Input
              placeholder={getTargetPlaceholder()}
              value={targetLink}
              onChange={(e) => {
                setTargetLink(e.target.value);
                validateLink(e.target.value);
              }}
            />
            {linkError && <p className="text-xs text-red-500">{linkError}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We'll send your order confirmation here
            </p>
          </div>

          {/* Coupon */}
          <div className="space-y-2">
            <Label>Coupon Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!couponApplied}
              />
              <Button
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={!!couponApplied || !couponCode}
              >
                Apply
              </Button>
            </div>
            {couponApplied && (
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  {couponApplied.code} - {formatCurrency(couponApplied.discount)} off
                </Badge>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setCouponApplied(null);
                    setCouponCode('');
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={isLoading || !selectedPackage}
          >
            {isLoading ? 'Processing...' : `Buy Now - ${formatCurrency(total)}`}
          </Button>
        </CardFooter>
      </Card>

    </>
  );
}

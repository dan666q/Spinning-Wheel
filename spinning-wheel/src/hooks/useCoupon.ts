import { useState, useCallback } from 'react';
import type { Coupon, Prize } from '../types';

export function useCoupon() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const generateCouponCode = useCallback((percent: number): string => {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SPIN-${percent}-${randomChars}`;
  }, []);

  const createCouponFromPrize = useCallback((prize: Prize): Coupon | null => {
    if (prize.discountPercent <= 0) return null;

    const newCoupon: Coupon = {
      code: generateCouponCode(prize.discountPercent),
      percent: prize.discountPercent,
      applied: false,
      wonAt: Date.now(),
    };

    setCoupon(newCoupon);
    return newCoupon;
  }, [generateCouponCode]);

  const applyCoupon = useCallback(() => {
    setCoupon(prev => prev ? { ...prev, applied: true } : null);
  }, []);

  const ignoreCoupon = useCallback(() => {
    setCoupon(prev => prev ? { ...prev, applied: false } : null);
  }, []);

  const clearCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  const hasSpun = coupon !== null;

  const hasUnappliedCoupon = coupon !== null && !coupon.applied && coupon.percent > 0;

  return {
    coupon,
    hasSpun,
    hasUnappliedCoupon,
    createCouponFromPrize,
    applyCoupon,
    ignoreCoupon,
    clearCoupon,
  };
}
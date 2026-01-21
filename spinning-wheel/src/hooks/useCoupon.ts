import { useState, useCallback } from 'react';
import type { Coupon, Prize } from '../types';

/**
 * Custom hook for managing coupon state (in-memory only)
 * 
 * Features:
 * - Generates unique coupon codes from spin wins
 * - Tracks whether user applied or ignored the coupon
 * - Allows re-application of ignored coupons
 * 
 * Note: Coupon data will be lost on page refresh
 */
export function useCoupon() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  /**
   * Generate a unique coupon code based on the prize
   * Format: SPIN-{percent}-{random4chars}
   */
  const generateCouponCode = useCallback((percent: number): string => {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SPIN-${percent}-${randomChars}`;
  }, []);

  /**
   * Create a new coupon from a spin prize
   * Only creates if discount is > 0%
   */
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

  /**
   * Mark the coupon as applied
   * Called when user clicks "Apply Discount"
   */
  const applyCoupon = useCallback(() => {
    setCoupon(prev => prev ? { ...prev, applied: true } : null);
  }, []);

  /**
   * Mark the coupon as ignored (not applied)
   * User can re-apply later via banner
   */
  const ignoreCoupon = useCallback(() => {
    setCoupon(prev => prev ? { ...prev, applied: false } : null);
  }, []);

  /**
   * Clear the coupon entirely
   */
  const clearCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  /**
   * Check if user has already spun (has any coupon)
   */
  const hasSpun = coupon !== null;

  /**
   * Check if there's an unapplied coupon available
   */
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
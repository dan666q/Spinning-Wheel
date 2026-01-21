import { useState, useCallback, useMemo } from 'react';
import type { Cart, CartItem } from '../types';

/**
 * Mock luxury furniture items for the cart
 * Prices in USD with realistic luxury furniture pricing
 */
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'sofa-001',
    name: 'Italian Leather Sofa',
    description: 'Hand-crafted full-grain leather, solid walnut frame',
    price: 2499.00,
    quantity: 1,
  },
  {
    id: 'table-001',
    name: 'Marble Coffee Table',
    description: 'Carrara marble top, brushed brass legs',
    price: 1299.00,
    quantity: 1,
  },
];

/**
 * Custom hook for managing cart state and calculations
 * 
 * Features:
 * - Manages cart items with quantity updates
 * - Calculates subtotal, discount amount, and final total
 * - Supports applying/removing percentage discounts
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [discountPercent, setDiscountPercent] = useState<number | undefined>();
  const [discountLabel, setDiscountLabel] = useState<string | undefined>();

  /**
   * Calculate the cart subtotal from all items
   * Subtotal = sum of (price × quantity) for each item
   */
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  /**
   * Calculate discount amount based on percentage
   * Discount = subtotal × (percent / 100)
   */
  const discount = useMemo(() => {
    if (!discountPercent) return 0;
    return subtotal * (discountPercent / 100);
  }, [subtotal, discountPercent]);

  /**
   * Calculate final total after discount
   * Final = subtotal - discount
   */
  const finalTotal = useMemo(() => {
    return subtotal - discount;
  }, [subtotal, discount]);

  /**
   * Complete cart object with all calculations
   */
  const cart: Cart = useMemo(() => ({
    items,
    subtotal,
    discount,
    discountPercent,
    discountLabel,
    finalTotal,
  }), [items, subtotal, discount, discountPercent, discountLabel, finalTotal]);

  /**
   * Apply a discount to the cart
   * @param percent - Discount percentage (e.g., 25 for 25%)
   * @param label - Display label (e.g., "25% Off")
   */
  const applyDiscount = useCallback((percent: number, label: string) => {
    setDiscountPercent(percent);
    setDiscountLabel(label);
  }, []);

  /**
   * Remove any applied discount
   */
  const removeDiscount = useCallback(() => {
    setDiscountPercent(undefined);
    setDiscountLabel(undefined);
  }, []);

  /**
   * Update quantity for a specific item
   */
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  /**
   * Remove an item from the cart
   */
  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  return {
    cart,
    applyDiscount,
    removeDiscount,
    updateQuantity,
    removeItem,
  };
}

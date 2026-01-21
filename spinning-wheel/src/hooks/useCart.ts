import { useState, useCallback, useMemo } from 'react';
import type { Cart, CartItem } from '../types';

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'sofa-001',
    name: 'Italian Leather Sofa',
    description: 'Hand-crafted full-grain leather, solid walnut frame',
    price: 2500.00,
    quantity: 1,
  },
  {
    id: 'table-001',
    name: 'Marble Coffee Table',
    description: 'Carrara marble top, brushed brass legs',
    price: 500.00,
    quantity: 1,
  },
];

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [discountPercent, setDiscountPercent] = useState<number | undefined>();
  const [discountLabel, setDiscountLabel] = useState<string | undefined>();

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!discountPercent) return 0;
    return subtotal * (discountPercent / 100);
  }, [subtotal, discountPercent]);

  const finalTotal = useMemo(() => {
    return subtotal - discount;
  }, [subtotal, discount]);

  const cart: Cart = useMemo(() => ({
    items,
    subtotal,
    discount,
    discountPercent,
    discountLabel,
    finalTotal,
  }), [items, subtotal, discount, discountPercent, discountLabel, finalTotal]);

  const applyDiscount = useCallback((percent: number, label: string) => {
    setDiscountPercent(percent);
    setDiscountLabel(label);
  }, []);



  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  return {
    cart,
    applyDiscount,
    updateQuantity,
    removeItem,
  };
}
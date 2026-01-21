/**
 * Shared TypeScript interfaces for the Spin-to-Win Cart feature
 */

/** Prize segment on the spin wheel */
export interface Prize {
    id: string;
    label: string;           // Display text: "30% Off", "Better Luck Next Time"
    color: string;           // Hex color for wheel segment
    discountPercent: number; // Discount value: 30, 20, 10, 0
    probability: number;     // Selection probability (sum should ≈ 1)
  }
  
  /** Individual cart item */
  export interface CartItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image?: string;
  }
  
  /** Complete cart state with calculations */
  export interface Cart {
    items: CartItem[];
    subtotal: number;
    discount: number;
    discountPercent?: number;
    discountLabel?: string;
    finalTotal: number;
  }
  
  /** Coupon state for persistence */
  export interface Coupon {
    code: string;      // Auto-generated: "SPIN-25"
    percent: number;   // Discount percentage
    applied: boolean;  // Whether user chose to apply
    wonAt: number;     // Timestamp when won
  }
  
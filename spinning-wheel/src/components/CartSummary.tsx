import { Minus, Plus, Trash2, Sparkles } from "lucide-react";
import type { Cart } from "../types";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  cart: Cart;
  onSpinClick: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  hasSpun: boolean;
  hasUnappliedCoupon: boolean;
  unappliedPercent?: number;
  onApplyUnapplied: () => void;
}

/**
 * Format price in USD with 2 decimals
 * Example: 2499.00 → "$2,499.00"
 */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * CartSummary Component
 *
 * Displays:
 * - List of cart items with quantity controls
 * - Subtotal (with strikethrough if discount applied)
 * - Discount amount and percentage
 * - Final total (highlighted in green when discounted)
 * - Spin-to-win banner/button
 */
export function CartSummary({
  cart,
  onSpinClick,
  onUpdateQuantity,
  onRemoveItem,
  hasSpun,
  hasUnappliedCoupon,
  unappliedPercent,
  onApplyUnapplied,
}: CartSummaryProps) {
  const hasDiscount = cart.discount > 0;

  return (
    <div className="space-y-6">
      {/* Spin to Win Banner - Only show if user hasn't spun yet */}
      {!hasSpun && (
        <button
          onClick={onSpinClick}
          className="w-full banner-gradient rounded-2xl p-6 text-primary-foreground 
                     shadow-gold hover:shadow-elevated transition-all duration-300
                     hover:-translate-y-1 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm font-medium opacity-90">
                Limited Time Offer
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold mt-1">
                Spin to Win Up to 30% Off!
              </h3>
              <p className="text-sm mt-2 opacity-80">
                Try your luck and save on your order
              </p>
            </div>
            <div
              className="flex items-center gap-2 bg-background/20 rounded-full px-4 py-2
                          group-hover:bg-background/30 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Spin Now</span>
            </div>
          </div>
        </button>
      )}

      {/* Unapplied Coupon Banner - Show if user has a coupon but hasn't applied it */}
      {hasUnappliedCoupon && unappliedPercent && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-success font-medium">
              You have an unused discount!
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unappliedPercent}% off waiting to be applied
            </p>
          </div>
          <Button
            onClick={onApplyUnapplied}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            Apply Now
          </Button>
        </div>
      )}

      {/* Cart Items */}
      <div className="card-luxury p-6">
        <h2 className="font-display text-xl font-semibold mb-6">Your Cart</h2>

        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0"
            >
              {/* Item placeholder image */}
              <div
                className="w-20 h-20 md:w-24 md:h-24 bg-secondary rounded-lg flex-shrink-0 
                            flex items-center justify-center overflow-hidden"
              >
                <img
                  src={
                    item.id === "sofa-001"
                      ? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"
                      : "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=200&h=200&fit=crop"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-medium text-lg">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                )}
                <p className="font-semibold mt-2">{formatPrice(item.price)}</p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-secondary transition-colors disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-2 hover:bg-secondary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item total */}
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card-luxury p-6">
        <h2 className="font-display text-xl font-semibold mb-6">
          Order Summary
        </h2>

        <div className="space-y-4">
          {/* Subtotal row */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal</span>
            <span className={hasDiscount ? "price-original" : "font-medium"}>
              {formatPrice(cart.subtotal)}
            </span>
          </div>

          {/* Discount row - Only show if discount applied */}
          {hasDiscount && cart.discountLabel && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="discount-badge">
                  <Sparkles className="w-3.5 h-3.5" />
                  {cart.discountLabel}
                </span>
              </span>
              <span className="text-success font-medium">
                -{formatPrice(cart.discount)}
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-success font-medium">Free</span>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-4 mt-4">
            {/* Final Total */}
            <div className="flex justify-between items-center">
              <span className="font-display text-lg font-semibold">Total</span>
              <span
                className={`text-2xl font-display font-bold ${
                  hasDiscount ? "text-success" : ""
                }`}
              >
                {formatPrice(cart.finalTotal)}
              </span>
            </div>

            {/* Savings message */}
            {hasDiscount && (
              <p className="text-success text-sm mt-2 text-right">
                You're saving {formatPrice(cart.discount)}!
              </p>
            )}
          </div>
        </div>

        {/* Checkout button */}
        <Button className="w-full mt-6 btn-luxury text-primary-foreground py-6 text-lg font-semibold rounded-xl">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

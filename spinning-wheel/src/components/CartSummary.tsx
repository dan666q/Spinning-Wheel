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

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

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
    <div className="space-y-4 sm:space-y-6">
      {!hasSpun && (
        <button
          onClick={onSpinClick}
          className="w-full banner-gradient rounded-xl sm:rounded-2xl p-4 sm:p-6 text-primary-foreground shadow-gold hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm font-medium opacity-90">
                Limited Time Offer
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold mt-1">
                Spin to Win Up to 30% Off!
              </h3>
              <p className="text-xs sm:text-sm mt-2 opacity-80">
                Try your luck and save on your order
              </p>
            </div>
            <div className="flex items-center gap-2 bg-background/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 group-hover:bg-background/30 transition-colors">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">
                Spin Now
              </span>
            </div>
          </div>
        </button>
      )}

      {hasUnappliedCoupon && unappliedPercent && (
        <div className="bg-success/10 border border-success/20 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div>
            <p className="text-success font-medium text-sm sm:text-base">
              You have an unused discount!
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {unappliedPercent}% off waiting to be applied
            </p>
          </div>
          <Button
            onClick={onApplyUnapplied}
            className="bg-success hover:bg-success/90 text-success-foreground text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6"
          >
            Apply Now
          </Button>
        </div>
      )}

      <div className="card-luxury p-4 sm:p-6">
        <h2 className="font-display text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Your Cart
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border/50 last:border-0 last:pb-0"
            >
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-secondary rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
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

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="font-display font-medium text-base sm:text-lg">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <p className="font-semibold mt-1 sm:mt-2 text-sm sm:text-base">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 sm:mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-2 xs:p-3 hover:bg-secondary transition-colors disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 xs:w-4 xs:h-4" />
                    </button>
                    <span className="px-3 xs:px-4 py-1.5 xs:py-2 min-w-[2.5rem] xs:min-w-[3rem] text-center font-medium text-sm xs:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-2 xs:p-3 hover:bg-secondary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 xs:w-4 xs:h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 xs:p-3 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3 h-3 xs:w-4 xs:h-4" />
                  </button>
                </div>
              </div>

              <div className="text-center sm:text-right mt-2 sm:mt-0">
                <p className="font-semibold text-sm sm:text-base">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-luxury p-4 sm:p-6">
        <h2 className="font-display text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Order Summary
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span className={hasDiscount ? "price-original" : "font-medium"}>
              {formatPrice(cart.subtotal)}
            </span>
          </div>

          {hasDiscount && cart.discountLabel && (
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="discount-badge text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {cart.discountLabel}
                </span>
              </span>
              <span className="text-success font-medium">
                -{formatPrice(cart.discount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-success font-medium">Free</span>
          </div>

          <div className="border-t border-border pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div className="flex justify-between items-center">
              <span className="font-display text-base sm:text-lg font-semibold">
                Total
              </span>
              <span
                className={`text-xl sm:text-2xl font-display font-bold ${
                  hasDiscount ? "text-success" : ""
                }`}
              >
                {formatPrice(cart.finalTotal)}
              </span>
            </div>

            {hasDiscount && (
              <p className="text-success text-xs sm:text-sm mt-1 sm:mt-2 text-right">
                You're saving {formatPrice(cart.discount)}!
              </p>
            )}
          </div>
        </div>

        <Button className="w-full mt-4 sm:mt-6 btn-luxury text-primary-foreground py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

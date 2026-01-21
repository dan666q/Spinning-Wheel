import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import type { Prize } from "../types";
import { useCart } from "../hooks/useCart";
import { useCoupon } from "../hooks/useCoupon";
import { CartSummary } from "../components/CartSummary";
import { SpinWheel } from "../components/SpinWheel";
import { WinModal } from "../components/WinModal";

const PRIZES: Prize[] = [
  {
    id: "prize-30",
    label: "30% Off",
    color: "#C5A572",
    discountPercent: 30,
    probability: 0.02,
  },
  {
    id: "prize-5a",
    label: "5% Off",
    color: "#E8DED1",
    discountPercent: 5,
    probability: 0.18,
  },
  {
    id: "prize-25",
    label: "25% Off",
    color: "#8B7355",
    discountPercent: 25,
    probability: 0.05,
  },
  {
    id: "prize-10a",
    label: "10% Off",
    color: "#D4C4B0",
    discountPercent: 10,
    probability: 0.15,
  },
  {
    id: "prize-0",
    label: "Try Again!",
    color: "#A69080",
    discountPercent: 0,
    probability: 0.2,
  },
  {
    id: "prize-15",
    label: "15% Off",
    color: "#BFA98F",
    discountPercent: 15,
    probability: 0.1,
  },
  {
    id: "prize-5b",
    label: "5% Off",
    color: "#E8DED1",
    discountPercent: 5,
    probability: 0.18,
  },
  {
    id: "prize-20",
    label: "20% Off",
    color: "#9C8B7A",
    discountPercent: 20,
    probability: 0.12,
  },
];

export default function CartPage() {
  const { cart, applyDiscount, updateQuantity, removeItem } = useCart();

  const {
    coupon,
    hasSpun,
    hasUnappliedCoupon,
    createCouponFromPrize,
    applyCoupon,
    ignoreCoupon,
  } = useCoupon();

  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  useEffect(() => {
    if (coupon && coupon.applied && coupon.percent > 0) {
      applyDiscount(coupon.percent, `${coupon.percent}% Off`);
    }
  }, [coupon, applyDiscount]);

  const handleOpenWheel = useCallback(() => {
    setIsWheelModalOpen(true);
  }, []);

  const handleWin = useCallback(
    (prize: Prize) => {
      setWonPrize(prize);
      createCouponFromPrize(prize);

      setIsWheelModalOpen(false);
      setTimeout(() => {
        setIsWinModalOpen(true);
      }, 300);
    },
    [createCouponFromPrize]
  );

  const handleApplyDiscount = useCallback(() => {
    if (wonPrize && wonPrize.discountPercent > 0) {
      applyDiscount(wonPrize.discountPercent, wonPrize.label);
      applyCoupon();
    }
    setIsWinModalOpen(false);
    setWonPrize(null);
  }, [wonPrize, applyDiscount, applyCoupon]);

  const handleIgnoreDiscount = useCallback(() => {
    ignoreCoupon();
    setIsWinModalOpen(false);
    setWonPrize(null);
  }, [ignoreCoupon]);

  const handleApplyUnapplied = useCallback(() => {
    if (coupon && coupon.percent > 0) {
      applyDiscount(coupon.percent, `${coupon.percent}% Off`);
      applyCoupon();
    }
  }, [coupon, applyDiscount, applyCoupon]);

  const handleCloseWinModal = useCallback(() => {
    setIsWinModalOpen(false);
    setWonPrize(null);
    if (wonPrize && wonPrize.discountPercent > 0) {
      ignoreCoupon();
    }
  }, [wonPrize, ignoreCoupon]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm sm:text-base">
                Continue Shopping
              </span>
            </button>
            <h1 className="font-display text-lg sm:text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Shopping Cart</span>
            </h1>
            <div className="w-20 sm:w-24" />
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {cart.items.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl sm:text-2xl font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Add some beautiful pieces to get started.
            </p>
          </div>
        ) : (
          <CartSummary
            cart={cart}
            onSpinClick={handleOpenWheel}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            hasSpun={hasSpun}
            hasUnappliedCoupon={hasUnappliedCoupon}
            unappliedPercent={coupon?.percent}
            onApplyUnapplied={handleApplyUnapplied}
          />
        )}
      </main>

      {isWheelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
            onClick={() => !isSpinning && setIsWheelModalOpen(false)}
          />

          <div className="relative bg-card rounded-2xl sm:rounded-3xl shadow-elevated max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full p-4 sm:p-6 md:p-8 animate-scale-in">
            {!isSpinning && (
              <button
                onClick={() => setIsWheelModalOpen(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 sm:p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Close modal"
              >
                <span className="text-muted-foreground text-lg sm:text-xl">
                  ×
                </span>
              </button>
            )}

            <div className="text-center mb-4 sm:mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                Spin to Win!
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Try your luck for up to 30% off your order
              </p>
            </div>

            <SpinWheel
              prizes={PRIZES}
              onWin={handleWin}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
          </div>
        </div>
      )}

      <WinModal
        isOpen={isWinModalOpen}
        onClose={handleCloseWinModal}
        prize={wonPrize}
        onApply={handleApplyDiscount}
        onIgnore={handleIgnoreDiscount}
      />
    </div>
  );
}

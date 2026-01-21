import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import type { Prize } from "../types";
import { useCart } from "../hooks/useCart";
import { useCoupon } from "../hooks/useCoupon";
import { CartSummary } from "../components/CartSummary";
import { SpinWheel } from "../components/SpinWheel";
import { WinModal } from "../components/WinModal";

/**
 * Prize configuration for the spin wheel
 *
 * 8 segments with weighted probabilities:
 * - High discounts (25-30%) are rare
 * - Low discounts (5-10%) are common
 * - "Better Luck" segment provides gamification tension
 *
 * Probabilities sum to 1.0
 */
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

/**
 * CartPage Component
 *
 * Main page integrating:
 * - Cart summary with items and totals
 * - Spin-to-win modal with wheel
 * - Win result modal with confetti
 * - Coupon state management (in-memory only)
 *
 * Workflow:
 * 1. User sees cart with spin banner (if hasn't spun)
 * 2. Click banner → opens wheel modal
 * 3. Spin → lands on prize → shows win modal
 * 4. Apply → discount added to cart
 * 5. Ignore → coupon saved but not applied (can apply later)
 *
 * Note: Coupon state is lost on page refresh
 */
export default function CartPage() {
  // Cart state management
  const { cart, applyDiscount, removeDiscount, updateQuantity, removeItem } =
    useCart();

  // Coupon state management (in-memory only, no persistence)
  const {
    coupon,
    hasSpun,
    hasUnappliedCoupon,
    createCouponFromPrize,
    applyCoupon,
    ignoreCoupon,
  } = useCoupon();

  // Modal states
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  /**
   * On mount: If there's an applied coupon in state, apply it to cart
   */
  useEffect(() => {
    if (coupon && coupon.applied && coupon.percent > 0) {
      applyDiscount(coupon.percent, `${coupon.percent}% Off`);
    }
  }, [coupon, applyDiscount]);

  /**
   * Handle spin wheel click from banner
   */
  const handleOpenWheel = useCallback(() => {
    setIsWheelModalOpen(true);
  }, []);

  /**
   * Handle wheel spin result
   * Creates coupon from prize and shows win modal
   */
  const handleWin = useCallback(
    (prize: Prize) => {
      setWonPrize(prize);
      createCouponFromPrize(prize);

      // Close wheel modal, open win modal
      setIsWheelModalOpen(false);
      setTimeout(() => {
        setIsWinModalOpen(true);
      }, 300);
    },
    [createCouponFromPrize]
  );

  /**
   * Handle "Apply Discount" click in win modal
   */
  const handleApplyDiscount = useCallback(() => {
    if (wonPrize && wonPrize.discountPercent > 0) {
      applyDiscount(wonPrize.discountPercent, wonPrize.label);
      applyCoupon();
    }
    setIsWinModalOpen(false);
    setWonPrize(null);
  }, [wonPrize, applyDiscount, applyCoupon]);

  /**
   * Handle "Maybe Later" click in win modal
   */
  const handleIgnoreDiscount = useCallback(() => {
    ignoreCoupon();
    setIsWinModalOpen(false);
    setWonPrize(null);
  }, [ignoreCoupon]);

  /**
   * Handle applying unapplied coupon from banner
   */
  const handleApplyUnapplied = useCallback(() => {
    if (coupon && coupon.percent > 0) {
      applyDiscount(coupon.percent, `${coupon.percent}% Off`);
      applyCoupon();
    }
  }, [coupon, applyDiscount, applyCoupon]);

  /**
   * Close win modal
   */
  const handleCloseWinModal = useCallback(() => {
    setIsWinModalOpen(false);
    setWonPrize(null);
    // If user closes without choosing, treat as ignore
    if (wonPrize && wonPrize.discountPercent > 0) {
      ignoreCoupon();
    }
  }, [wonPrize, ignoreCoupon]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Continue Shopping</span>
            </button>
            <h1 className="font-display text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Shopping Cart</span>
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {cart.items.length === 0 ? (
          // Empty cart state
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-2xl font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground">
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

      {/* Spin Wheel Modal */}
      {isWheelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
            onClick={() => !isSpinning && setIsWheelModalOpen(false)}
          />

          {/* Modal Content */}
          <div
            className="relative bg-card rounded-3xl shadow-elevated max-w-lg w-full 
                          p-8 animate-scale-in"
          >
            {/* Close button - hide while spinning */}
            {!isSpinning && (
              <button
                onClick={() => setIsWheelModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary 
                         transition-colors"
                aria-label="Close modal"
              >
                <span className="text-muted-foreground text-xl">×</span>
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Spin to Win!
              </h2>
              <p className="text-muted-foreground">
                Try your luck for up to 30% off your order
              </p>
            </div>

            {/* Spin Wheel */}
            <SpinWheel
              prizes={PRIZES}
              onWin={handleWin}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
          </div>
        </div>
      )}

      {/* Win Modal */}
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

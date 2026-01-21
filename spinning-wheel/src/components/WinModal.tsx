import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { X, PartyPopper, Gift } from "lucide-react";
import type { Prize } from "../types";
import { Button } from "@/components/ui/button";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: Prize | null;
  onApply: () => void;
  onIgnore: () => void;
}

/**
 * WinModal Component
 *
 * Displays the spin result with celebration effects.
 *
 * Features:
 * - Confetti animation on winning (discount > 0%)
 * - Apply Discount / Maybe Later actions
 * - Graceful handling of no-win scenario
 */
export function WinModal({
  isOpen,
  onClose,
  prize,
  onApply,
  onIgnore,
}: WinModalProps) {
  const isWinner = prize && prize.discountPercent > 0;

  /**
   * Fire confetti celebration
   * Multiple bursts from different angles for dramatic effect
   */
  const fireConfetti = useCallback(() => {
    // Helper to fire confetti from a given origin
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    // Initial burst
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#C5A572", "#8B7355", "#D4AF37", "#FFD700"],
    });

    fire(0.2, {
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#C5A572", "#8B7355", "#D4AF37", "#FFD700"],
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#C5A572", "#8B7355", "#D4AF37", "#FFD700"],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#C5A572", "#8B7355", "#D4AF37", "#FFD700"],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#C5A572", "#8B7355", "#D4AF37", "#FFD700"],
    });

    // Side bursts after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#C5A572", "#D4AF37", "#FFD700"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#C5A572", "#D4AF37", "#FFD700"],
      });
    }, 250);

    // Second wave
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#C5A572", "#8B7355", "#D4AF37", "#FFD700", "#B8860B"],
      });
    }, 500);
  }, []);

  /**
   * Trigger confetti when modal opens with a winning prize
   */
  useEffect(() => {
    if (isOpen && isWinner) {
      // Small delay for modal animation
      const timer = setTimeout(fireConfetti, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isWinner, fireConfetti]);

  if (!isOpen || !prize) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-card rounded-3xl shadow-elevated max-w-md w-full 
                      overflow-hidden animate-scale-in"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary 
                     transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content based on win/lose */}
        {isWinner ? (
          <div className="p-8 text-center">
            {/* Celebration icon */}
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 
                          flex items-center justify-center animate-float"
            >
              <PartyPopper className="w-10 h-10 text-primary" />
            </div>

            {/* Congratulations heading */}
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Congratulations!
            </h2>
            <p className="text-muted-foreground mb-6">
              You've won an exclusive discount!
            </p>

            {/* Prize display */}
            <div
              className="bg-gradient-to-br from-primary/10 to-accent/10 
                          rounded-2xl p-6 mb-8 border border-primary/20"
            >
              <p className="text-5xl font-display font-bold text-primary mb-2">
                {prize.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Applied to your entire order
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={onApply}
                className="w-full bg-success hover:bg-success/90 text-success-foreground 
                         py-6 text-lg font-semibold rounded-xl"
              >
                Apply Discount
              </Button>
              <Button
                onClick={onIgnore}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground py-4"
              >
                Maybe Later
              </Button>
            </div>

            {/* Coupon code preview */}
            <p className="text-xs text-muted-foreground mt-4">
              Your coupon will be saved for later use
            </p>
          </div>
        ) : (
          // No-win result
          <div className="p-8 text-center">
            {/* Icon */}
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary 
                          flex items-center justify-center"
            >
              <Gift className="w-10 h-10 text-muted-foreground" />
            </div>

            {/* Message */}
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Better Luck Next Time!
            </h2>
            <p className="text-muted-foreground mb-8">
              Don't worry, you can still enjoy our premium collection at great
              value.
            </p>

            {/* Close button */}
            <Button onClick={onClose} variant="outline" className="px-8 py-4">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

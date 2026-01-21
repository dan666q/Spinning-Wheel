import { useState, useRef, useCallback, useEffect } from "react";
import type { Prize } from "../types";

interface SpinWheelProps {
  prizes: Prize[];
  onWin: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

/**
 * SpinWheel Component
 *
 * A CSS-based spinning wheel using conic-gradient.
 *
 * Features:
 * - Weighted random selection based on prize probabilities
 * - Smooth 6+ rotation animation with cubic-bezier easing
 * - Fixed pointer at top indicating winning segment
 * - Responsive sizing
 *
 * Animation calculation:
 * - Each segment spans (360 / numPrizes) degrees
 * - Winning angle = segment center - (90° to align with top pointer)
 * - Total rotation = (6-10 full rotations × 360°) + winning angle
 */
export function SpinWheel({
  prizes,
  onWin,
  isSpinning,
  setIsSpinning,
}: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const selectedPrizeRef = useRef<Prize | null>(null);

  /**
   * Select a prize based on weighted probabilities
   * Uses cumulative probability distribution
   */
  const selectPrize = useCallback((): Prize => {
    const random = Math.random();
    let cumulative = 0;

    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }

    // Fallback to last prize if rounding errors
    return prizes[prizes.length - 1];
  }, [prizes]);

  /**
   * Calculate the angle for the wheel to land on the selected prize
   *
   * Math breakdown:
   * - Segment angle = 360° / number of prizes
   * - Prize index determines its position on the wheel
   * - We need to rotate so the segment center aligns with the top (pointer)
   * - Add multiple full rotations for visual effect
   */
  const calculateWinningAngle = useCallback(
    (prizeIndex: number): number => {
      const segmentAngle = 360 / prizes.length;

      // Center of the winning segment
      // Segments are drawn starting from the right (3 o'clock), going clockwise
      // Prize at index 0 is at the top-right, so we offset by half a segment
      const segmentCenter = segmentAngle * prizeIndex + segmentAngle / 2;

      // The pointer is at the top (12 o'clock = 0°/360°)
      // We need to rotate the wheel so the segment center reaches the top
      // Since we rotate clockwise, we need: 360 - segmentCenter + 90 (to offset from 3 o'clock to 12 o'clock)
      const baseAngle = 360 - segmentCenter + 90;

      // Add 6-10 full rotations for dramatic effect
      const fullRotations = (6 + Math.floor(Math.random() * 5)) * 360;

      return fullRotations + baseAngle;
    },
    [prizes.length]
  );

  /**
   * Handle spin button click
   */
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    // Select the winning prize
    const selectedPrize = selectPrize();
    selectedPrizeRef.current = selectedPrize;

    // Find prize index
    const prizeIndex = prizes.findIndex((p) => p.id === selectedPrize.id);

    // Calculate final rotation angle
    const winningAngle = calculateWinningAngle(prizeIndex);

    // Start spinning
    setIsSpinning(true);
    setRotation((prev) => prev + winningAngle);
  }, [isSpinning, selectPrize, prizes, calculateWinningAngle, setIsSpinning]);

  /**
   * Handle transition end - trigger win callback
   */
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const handleTransitionEnd = () => {
      if (selectedPrizeRef.current) {
        setIsSpinning(false);
        onWin(selectedPrizeRef.current);
        selectedPrizeRef.current = null;
      }
    };

    wheel.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      wheel.removeEventListener("transitionend", handleTransitionEnd);
  }, [onWin, setIsSpinning]);

  /**
   * Generate conic-gradient for wheel segments
   * Each prize gets an equal-sized segment with its color
   */
  const wheelGradient = (): string => {
    const segmentAngle = 360 / prizes.length;
    const segments = prizes.map((prize, index) => {
      const startAngle = segmentAngle * index;
      const endAngle = segmentAngle * (index + 1);
      return `${prize.color} ${startAngle}deg ${endAngle}deg`;
    });
    return `conic-gradient(from -90deg, ${segments.join(", ")})`;
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer - Fixed at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-pulse">
        <div
          className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] 
                     border-l-transparent border-r-transparent border-t-primary
                     drop-shadow-lg"
        />
      </div>

      {/* Wheel Container */}
      <div className="relative mt-6">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full wheel-glow scale-105 opacity-50" />

        {/* Main Wheel */}
        <div
          ref={wheelRef}
          className="relative w-72 h-72 md:w-80 md:h-80 rounded-full wheel-glow 
                     border-4 border-primary/30 spin-wheel overflow-hidden"
          style={{
            background: wheelGradient(),
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Prize labels */}
          {prizes.map((prize, index) => {
            const segmentAngle = 360 / prizes.length;
            const labelAngle = segmentAngle * index + segmentAngle / 2 - 90;

            return (
              <div
                key={prize.id}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  transform: `rotate(${labelAngle}deg) translateX(20%)`,
                  width: "50%",
                }}
              >
                <span
                  className="text-xs md:text-sm font-bold drop-shadow-md px-1
                           whitespace-nowrap"
                  style={{
                    color: getContrastColor(prize.color),
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {prize.label}
                </span>
              </div>
            );
          })}

          {/* Center button/cap */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br 
                       from-primary to-accent border-4 border-primary-foreground/20
                       shadow-elevated flex items-center justify-center"
          >
            <span className="font-display font-bold text-primary-foreground text-sm">
              SPIN
            </span>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="mt-8 btn-luxury px-10 py-4 rounded-full text-primary-foreground 
                   font-display text-lg font-semibold tracking-wide
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                   relative overflow-hidden"
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">✨</span>
            Spinning...
          </span>
        ) : (
          "Spin Now"
        )}

        {/* Shimmer effect */}
        {!isSpinning && <div className="absolute inset-0 shimmer" />}
      </button>
    </div>
  );
}

/**
 * Get contrasting text color (black or white) based on background
 * Uses luminance formula for accessibility
 */
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, dark for light backgrounds
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

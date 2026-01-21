import { useState, useRef, useCallback, useEffect } from "react";
import type { Prize } from "../types";

interface SpinWheelProps {
  prizes: Prize[];
  onWin: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

export function SpinWheel({
  prizes,
  onWin,
  isSpinning,
  setIsSpinning,
}: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const selectedPrizeRef = useRef<Prize | null>(null);

  const selectPrize = useCallback((): Prize => {
    const random = Math.random();
    let cumulative = 0;

    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }

    return prizes[prizes.length - 1];
  }, [prizes]);

  const calculateWinningAngle = useCallback(
    (prizeIndex: number): number => {
      const segmentAngle = 360 / prizes.length;
      const segmentCenterAngle =
        -90 + segmentAngle * prizeIndex + segmentAngle / 2;
      let targetAngle = (360 - ((segmentCenterAngle + 90) % 360)) % 360;

      const spins = 6 + Math.floor(Math.random() * 5);
      return spins * 360 + targetAngle;
    },
    [prizes.length]
  );

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    const selectedPrize = selectPrize();
    selectedPrizeRef.current = selectedPrize;

    const prizeIndex = prizes.findIndex((p) => p.id === selectedPrize.id);
    const winningAngle = calculateWinningAngle(prizeIndex);

    setIsSpinning(true);
    setRotation((prev) => prev + winningAngle);
  }, [isSpinning, selectPrize, prizes, calculateWinningAngle, setIsSpinning]);

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-pulse">
        <div className="w-0 h-0 border-l-[12px] xs:border-l-[16px] border-r-[12px] xs:border-r-[16px] border-t-[20px] xs:border-t-[28px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>

      <div className="relative mt-4 xs:mt-6">
        <div className="absolute inset-0 rounded-full wheel-glow scale-105 opacity-50" />

        <div
          ref={wheelRef}
          className="relative w-64 h-64 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full wheel-glow border-4 border-primary/30 spin-wheel overflow-hidden"
          style={{
            background: wheelGradient(),
            transform: `rotate(${rotation}deg)`,
          }}
        >
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
                  className="text-[10px] xs:text-xs sm:text-sm md:text-base font-bold drop-shadow-md px-1 whitespace-nowrap"
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

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-accent border-4 border-primary-foreground/20 shadow-elevated flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-xs xs:text-sm">
              SPIN
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="mt-6 xs:mt-8 btn-luxury px-8 xs:px-10 py-3 xs:py-4 rounded-full text-primary-foreground font-display text-base xs:text-lg font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">✨</span>
            Spinning...
          </span>
        ) : (
          "Spin Now"
        )}

        {!isSpinning && <div className="absolute inset-0 shimmer" />}
      </button>
    </div>
  );
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

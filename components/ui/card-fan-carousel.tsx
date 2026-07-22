"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
  onSelect?: (index: number) => void;
}

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getVisibleCount(width: number) {
  if (width < 640) return 3;
  if (width < 1200) return 5;
  return 7;
}

function getSlotConfig(visibleCount: number, slot: number) {
  if (visibleCount === 7) return FAN_POSITIONS[slot];
  if (visibleCount === 5) return FAN_POSITIONS[slot + 1];
  if (visibleCount === 3) return FAN_POSITIONS[slot + 2];

  const center = visibleCount >> 1;
  const distance = visibleCount > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

function getResponsiveMultiplier(width: number, visibleCount: number) {
  if (visibleCount === 3) {
    const cardWidthPx = (width < 480 ? 7.25 : 7.75) * 16;
    const edgeHalfWidth = (cardWidthPx * 0.9346) / 2;
    const targetCenter = width / 2 + 18 - edgeHalfWidth;
    return clamp(targetCenter / (11 * 16), 0.68, 1.55);
  }

  if (visibleCount === 5) {
    const cardWidthPx = 10.5 * 16;
    const edgeHalfWidth = (cardWidthPx * 0.8498) / 2;
    const targetCenter = width / 2 + 20 - edgeHalfWidth;
    return clamp(targetCenter / (22 * 16), 0.72, 1.55);
  }

  const containerWidth = Math.min(1180, width - 48);
  const cardWidthPx = 12.5 * 16;
  const edgeHalfWidth = (cardWidthPx * 0.7756) / 2;
  const targetCenter = containerWidth / 2 - 16 - edgeHalfWidth;
  return clamp(targetCenter / (30 * 16), 0.82, 1);
}

function getHeightMultiplier(width: number) {
  const idealPx = width < 640 ? 20 * 16 : width < 1200 ? 27 * 16 : 32 * 16;
  const available = window.innerHeight * 0.72;
  return available >= idealPx ? 1 : available / idealPx;
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-[16px] text-black/40 dark:text-white/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-black/25 dark:hover:border-white/25 hover:text-black/70 dark:hover:text-white/80 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-black/[0.04] dark:before:border-white/[0.04] before:pointer-events-none";

export default function SocialCards({ cards, onSelect }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1440 : window.innerWidth,
  );
  const visibleCount = Math.min(getVisibleCount(viewportWidth), Math.max(totalCards, 1));
  const halfVisible = visibleCount >> 1;
  const needsPagination = totalCards > visibleCount;
  const [centerIndex, setCenterIndex] = useState(() => (totalCards ? Math.min(3, totalCards - 1) : 0));

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        cards.forEach((_, index) => map.set(index, index));
        return map;
      }

      for (let slot = 0; slot < visibleCount; slot++) {
        const cardIndex = ((center + slot - halfVisible) % totalCards + totalCards) % totalCards;
        map.set(cardIndex, slot);
      }
      return map;
    },
    [cards, halfVisible, needsPagination, totalCards, visibleCount],
  );

  const selectCard = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalCards) return;
      onSelect?.(index);
      if (index === centerIndex || isAnimating.current) return;

      const clockwise = (index - centerIndex + totalCards) % totalCards;
      const counterClockwise = (centerIndex - index + totalCards) % totalCards;
      directionRef.current = clockwise <= counterClockwise ? "right" : "left";
      isAnimating.current = true;
      setCenterIndex(index);
    },
    [centerIndex, onSelect, totalCards],
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || totalCards < 2) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((previous) =>
        direction === "right" ? (previous + 1) % totalCards : (previous - 1 + totalCards) % totalCards,
      );
    },
    [totalCards],
  );

  useEffect(() => {
    onSelect?.(centerIndex);
  }, [centerIndex, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(viewportWidth, visibleCount);
    const heightMultiplier = getHeightMultiplier(viewportWidth);
    const config = (slot: number) => getSlotConfig(visibleCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const onCardDone = () => {
      completedCount += 1;
      if (completedCount >= visibleMap.size) {
        isAnimating.current = false;
        hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * heightMultiplier}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, {
            x: 0,
            y: `${10 * heightMultiplier}rem`,
            rotation: 0,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, {
            ...target,
            duration: 1.05,
            ease: "elastic.out(1.05,.78)",
            delay: 0.16 + slot * 0.06,
            onComplete: onCardDone,
          });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 36 : -36;
          gsap.set(card, {
            x: `${enterX}rem`,
            y: `${y * heightMultiplier}rem`,
            rotation: direction === "right" ? 30 : -30,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, { ...target, duration: 0.55, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.48, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -36 : 36;
        gsap.to(card, {
          x: `${exitX}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === "right" ? -30 : 30,
          duration: 0.38,
          ease: "power2.in",
          zIndex: 0,
        });
      } else {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    const visibleEntries: { element: HTMLElement; slot: number }[] = [];
    cardElements.forEach((element, index) => {
      const slot = visibleMap.get(index);
      if (slot !== undefined) visibleEntries.push({ element, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const currentMultiplier = getResponsiveMultiplier(window.innerWidth, visibleEntries.length);
      const currentHeightMultiplier = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ element, slot }) => {
        const base = config(slot);
        let targetX = base.x * currentMultiplier;
        let targetY = base.y * currentHeightMultiplier;
        let targetRotation = base.rot;
        let targetScale = base.scale;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          if (slot === hoveredSlot) {
            targetY -= 1.5 * currentHeightMultiplier;
            targetScale *= 1.045;
          } else {
            const pushStrength = visibleEntries.length === 7 ? 4.2 : visibleEntries.length === 5 ? 2.8 : 1.4;
            if (slot < hoveredSlot) targetX -= pushStrength * currentMultiplier;
            if (slot > hoveredSlot) targetX += pushStrength * currentMultiplier;
            targetRotation += slot < centerSlot ? -1 / (distance + 1) : 1 / (distance + 1);
          }
        }

        gsap.to(element, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRotation,
          scale: targetScale,
          duration: 0.42,
          ease: "elastic.out(1,.78)",
          overwrite: "auto",
        });
        gsap.set(element, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ element, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) clearTimeout(leaveTimer);
        activeSlot = slot;
        updateHoverLayout(slot);
      };
      element.addEventListener("mouseenter", handler);
      return { element, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      enterHandlers.forEach(({ element, handler }) => element.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, getVisibleMap, totalCards, viewportWidth, visibleCount]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg
      className="relative z-[2] w-4 h-4 md:w-5 md:h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="flex flex-col items-center w-full py-4 lg:py-8 px-0 relative z-20 overflow-visible">
      <div className="flex items-center justify-center w-full max-w-[90rem] overflow-visible">
        <div ref={containerRef} className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] overflow-visible">
          {cards.map((card, index) => {
            const image = (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || `Card ${index}`}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              </div>
            );

            if (card.linkUrl) {
              return (
                <a
                  key={index}
                  href={card.linkUrl}
                  target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="fan-card block cursor-pointer"
                  data-card-index={index}
                  onClick={() => onSelect?.(index)}
                >
                  {image}
                </a>
              );
            }

            return (
              <button
                key={index}
                type="button"
                className="fan-card block p-0 border-0 text-left"
                data-card-index={index}
                aria-label={card.alt || `Card ${index + 1}`}
                aria-pressed={index === centerIndex}
                onClick={() => selectCard(index)}
              >
                {image}
              </button>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="fan-controls flex items-center justify-center gap-4 mt-4 md:mt-6 z-30">
          <button
            type="button"
            className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`}
            onClick={() => cycle("left")}
            aria-label="Previous"
          >
            {chevron("left")}
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, index) => (
              <button
                type="button"
                key={index}
                aria-label={`Select card ${index + 1}`}
                aria-current={index === centerIndex ? "true" : undefined}
                onClick={() => selectCard(index)}
                className={`block w-2 h-2 p-0 border-0 rounded-full transition-all duration-300 ${
                  index === centerIndex
                    ? "bg-black/70 dark:bg-white/80 scale-[1.3]"
                    : "bg-black/15 dark:bg-white/15"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`}
            onClick={() => cycle("right")}
            aria-label="Next"
          >
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}

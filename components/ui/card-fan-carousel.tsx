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
  onActiveChange?: (index: number) => void;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -18, scale: 0.82, x: -30, y: 5.4, zIndex: 1 },
  { rot: -12, scale: 0.88, x: -21, y: 3.1, zIndex: 2 },
  { rot: -6, scale: 0.95, x: -11, y: 1.2, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 6, scale: 0.95, x: 11, y: 1.2, zIndex: 3 },
  { rot: 12, scale: 0.88, x: 21, y: 3.1, zIndex: 2 },
  { rot: 18, scale: 0.82, x: 30, y: 5.4, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.2;
  if (width < 640) return 0.28;
  if (width < 768) return 0.36;
  if (width < 1024) return 0.48;
  if (width < 1280) return 0.62;
  return 0.72;
}

function getHeightMultiplier(width: number) {
  if (width < 480) return 0.48;
  if (width < 640) return 0.58;
  if (width < 768) return 0.68;
  if (width < 1024) return 0.82;
  return 1;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 18,
    scale: 1 - 0.18 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 5.4,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "fan-arrow-control relative flex items-center justify-center rounded-full border-[1.5px] border-black/10 bg-white/75 backdrop-blur-[16px] text-black/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:border-black/25 hover:text-black/80 active:opacity-70 transition-colors duration-300";

export default function SocialCards({ cards, onActiveChange }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  useEffect(() => {
    if (totalCards) onActiveChange?.(centerIndex);
  }, [centerIndex, onActiveChange, totalCards]);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const heightMultiplier = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
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
          gsap.set(card, { x: 0, y: `${8 * heightMultiplier}rem`, rotation: 0, scale: 0.58, opacity: 0 });
          gsap.to(card, { ...target, duration: 1, ease: "elastic.out(1.05,.78)", delay: 0.12 + slot * 0.05, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 28 : -28;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * heightMultiplier}rem`, rotation: direction === "right" ? 24 : -24, scale: 0.58, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.55, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.45, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -28 : 28;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.58, rotation: direction === "right" ? -24 : 24, duration: 0.35, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((element, index) => {
      const slot = visibleMap.get(index);
      if (slot !== undefined) visibleEntries.push({ el: element, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: NodeJS.Timeout | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const responsiveMultiplier = getResponsiveMultiplier(window.innerWidth);
      const responsiveHeight = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * responsiveMultiplier;
        let targetY = base.y * responsiveHeight;
        let targetRotation = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.015;

          if (slot === hoveredSlot) {
            targetY -= 1.6 * responsiveHeight;
            targetScale *= 1.055;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 4.5 * (1 - Math.abs(normalized)) * (1 + 0.15 * Math.max(0, 3 - distance));
            if (slot < hoveredSlot) {
              targetX -= pushStrength * responsiveMultiplier;
              targetRotation -= 2 / (distance + 1);
            } else {
              targetX += pushStrength * responsiveMultiplier;
              targetRotation += 2 / (distance + 1);
            }
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.015;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRotation,
          scale: targetScale,
          duration: 0.42,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
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

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="case-carousel-component flex flex-col items-center w-full relative z-20">
      <div className="flex items-center justify-center w-full">
        <div ref={containerRef} className="fan-layout relative w-full">
          {cards.map((card, index) => {
            const image = (
              <div className="relative w-full h-full overflow-hidden">
                <img src={card.imgUrl} loading="lazy" alt={card.alt || `Кейс ${index + 1}`} className="absolute inset-0 w-full h-full object-cover z-10" />
              </div>
            );
            return card.linkUrl ? (
              <a key={index} href={card.linkUrl} target={card.linkUrl.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" className="fan-card block cursor-pointer">{image}</a>
            ) : (
              <div key={index} className="fan-card">{image}</div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="fan-pagination flex items-center justify-center gap-4 z-30">
          <button className={`${ARROW_CLASSES} w-10 h-10 md:w-11 md:h-11`} onClick={() => cycle("left")} aria-label="Предыдущий кейс">
            {chevron("left")}
          </button>
          <div className="fan-dots flex items-center gap-2" aria-hidden="true">
            {cards.map((_, index) => (
              <span key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === centerIndex ? "bg-black/70 scale-[1.3]" : "bg-black/15"}`} />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} w-10 h-10 md:w-11 md:h-11`} onClick={() => cycle("right")} aria-label="Следующий кейс">
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}

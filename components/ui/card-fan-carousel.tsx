"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
  title?: string;
  subtitle?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
  onActiveChange?: (index: number) => void;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -14, scale: 0.86, x: -22, y: 2.6, zIndex: 1 },
  { rot: -9, scale: 0.91, x: -15, y: 1.5, zIndex: 2 },
  { rot: -4.5, scale: 0.96, x: -8, y: 0.6, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 4.5, scale: 0.96, x: 8, y: 0.6, zIndex: 3 },
  { rot: 9, scale: 0.91, x: 15, y: 1.5, zIndex: 2 },
  { rot: 14, scale: 0.86, x: 22, y: 2.6, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.72;
  return 1;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 14,
    scale: 1 - 0.14 * absDistance * absDistance,
    x: distance * 22,
    y: absDistance * absDistance * 2.6,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "fan-arrow-control relative flex items-center justify-center rounded-full border border-black/10 bg-white/95 text-black/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_6px_18px_rgba(0,0,0,0.10)] hover:border-black/25 hover:text-black/85 active:scale-95 transition-all duration-200";

export default function SocialCards({ cards, onActiveChange }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const previousVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  useEffect(() => {
    if (totalCards) onActiveChange?.(centerIndex);
  }, [centerIndex, onActiveChange, totalCards]);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, index) => map.set(index, index));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot += 1) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [cards, needsPagination, totalCards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(previous =>
      direction === "right"
        ? (previous + 1) % totalCards
        : (previous - 1 + totalCards) % totalCards,
    );
  }, [needsPagination, totalCards]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const wasVisible = previousVisible.current;
    const direction = directionRef.current;
    const firstMount = !hasEntered.current;
    const responsiveMultiplier = getResponsiveMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (firstMount) isAnimating.current = true;

    let completed = 0;
    const complete = () => {
      completed += 1;
      if (completed >= visibleMap.size) {
        isAnimating.current = false;
        hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const previouslyVisible = wasVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          xPercent: -50,
          x: `${x * responsiveMultiplier}rem`,
          y: `${y}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (firstMount) {
          gsap.set(card, { xPercent: -50, x: 0, y: "5rem", rotation: 0, scale: 0.72, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.85, ease: "power3.out", delay: 0.08 + slot * 0.045, onComplete: complete });
        } else if (!previouslyVisible) {
          const enterX = direction === "right" ? 18 : -18;
          gsap.set(card, { xPercent: -50, x: `${enterX}rem`, y: `${y}rem`, rotation: direction === "right" ? 18 : -18, scale: 0.72, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.45, ease: "power2.out", onComplete: complete });
        } else {
          gsap.to(card, { ...target, duration: 0.4, ease: "power2.out", onComplete: complete });
        }
      } else if (previouslyVisible) {
        const exitX = direction === "right" ? -18 : 18;
        gsap.to(card, { xPercent: -50, x: `${exitX}rem`, opacity: 0, scale: 0.72, duration: 0.3, ease: "power2.in", zIndex: 0 });
      } else if (firstMount) {
        gsap.set(card, { xPercent: -50, opacity: 0, scale: 0.3, zIndex: 0 });
      }
    });

    previousVisible.current = new Set(visibleMap.keys());

    const visibleEntries: { element: HTMLElement; slot: number }[] = [];
    cardElements.forEach((element, index) => {
      const slot = visibleMap.get(index);
      if (slot !== undefined) visibleEntries.push({ element, slot });
    });

    const enterHandlers = visibleEntries.map(({ element, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        const base = config(slot);
        gsap.to(element, {
          xPercent: -50,
          x: `${base.x * getResponsiveMultiplier(window.innerWidth)}rem`,
          y: `${base.y - 0.55}rem`,
          rotation: base.rot,
          scale: base.scale * 1.035,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const leave = () => {
        const base = config(slot);
        gsap.to(element, {
          xPercent: -50,
          x: `${base.x * getResponsiveMultiplier(window.innerWidth)}rem`,
          y: `${base.y}rem`,
          rotation: base.rot,
          scale: base.scale,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      element.addEventListener("mouseenter", handler);
      element.addEventListener("mouseleave", leave);
      return { element, handler, leave };
    });

    const onResize = () => {
      if (isAnimating.current) return;
      cardElements.forEach((card, cardIndex) => {
        const slot = visibleMap.get(cardIndex);
        if (slot === undefined) return;
        const base = config(slot);
        gsap.set(card, {
          xPercent: -50,
          x: `${base.x * getResponsiveMultiplier(window.innerWidth)}rem`,
          y: `${base.y}rem`,
          rotation: base.rot,
          scale: base.scale,
        });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ element, handler, leave }) => {
        element.removeEventListener("mouseenter", handler);
        element.removeEventListener("mouseleave", leave);
      });
      window.removeEventListener("resize", onResize);
    };
  }, [centerIndex, getVisibleMap, needsPagination, totalCards]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="case-carousel-component flex w-full flex-col items-center">
      <div className="w-full">
        <div ref={containerRef} className="fan-layout relative mx-auto w-full">
          {cards.map((card, index) => {
            const content = (
              <div className="fan-card-media relative h-full w-full overflow-hidden">
                <img src={card.imgUrl} loading="lazy" alt={card.alt || `Кейс ${index + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                <div className="fan-card-shade absolute inset-0" />
                <div className="fan-card-copy absolute inset-x-0 bottom-0 z-20">
                  {card.title && <strong>{card.title}</strong>}
                  {card.subtitle && <span>{card.subtitle}</span>}
                </div>
              </div>
            );

            return card.linkUrl ? (
              <a key={index} href={card.linkUrl} target={card.linkUrl.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" className="fan-card block cursor-pointer">{content}</a>
            ) : (
              <div key={index} className="fan-card">{content}</div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="fan-pagination flex items-center justify-center gap-3">
          <button className={`${ARROW_CLASSES} h-10 w-10`} onClick={() => cycle("left")} aria-label="Предыдущий кейс">
            {chevron("left")}
          </button>
          <div className="fan-dots flex items-center justify-center gap-1.5" aria-hidden="true">
            {cards.map((_, index) => (
              <span key={index} className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${index === centerIndex ? "scale-125 bg-black/70" : "bg-black/15"}`} />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} h-10 w-10`} onClick={() => cycle("right")} aria-label="Следующий кейс">
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}

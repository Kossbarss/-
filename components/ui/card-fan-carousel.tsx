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
  previousLabel: string;
  nextLabel: string;
  cardLabel: string;
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

export default function SocialCards({ cards, onActiveChange, previousLabel, nextLabel, cardLabel }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusedSlot = useRef<number | null>(null);
  const prevCenterIndex = useRef<number | null>(null);

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const visibleCount = needsPagination ? MAX_VISIBLE : totalCards;
  const half = Math.floor(visibleCount / 2);

  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  useEffect(() => {
    if (totalCards) onActiveChange?.(centerIndex);
  }, [centerIndex, onActiveChange, totalCards]);

  // Each fan position is a fixed slot (0..visibleCount-1) that never moves;
  // only the data item shown inside it changes. This mirrors the reference
  // carousel exactly: repositioning is an instant content swap, never a
  // slide, so there is nothing for cards to visibly cross paths over.
  const slotToDataIndex = useCallback(
    (slot: number) => (((centerIndex + slot - half) % totalCards) + totalCards) % totalCards,
    [centerIndex, half, totalCards],
  );

  const cycle = useCallback((direction: "left" | "right") => {
    if (!needsPagination) return;
    setCenterIndex(previous =>
      direction === "right" ? (previous + 1) % totalCards : (previous - 1 + totalCards) % totalCards,
    );
  }, [needsPagination, totalCards]);

  const selectSlot = useCallback((slot: number, dataIndex: number) => {
    if (slot === half) return;
    setCenterIndex(dataIndex);
  }, [half]);

  // The only positional animation left: hovering a card lifts it and gently
  // pushes its neighbors aside, using one uniform duration/ease for every
  // card at once -- same as the reference's single `transition: transform
  // 0.5s cubic-bezier(0.22, 1, 0.36, 1)` rule (power4.out == easeOutQuint).
  const applyLayout = useCallback((animate: boolean) => {
    const container = containerRef.current;
    if (!container) return;
    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    const responsiveMultiplier = getResponsiveMultiplier(window.innerWidth);
    const centerSlot = (visibleCount - 1) / 2;
    const focus = focusedSlot.current;

    cardElements.forEach((card, slot) => {
      const base = getSlotConfig(visibleCount, slot);
      let x = base.x * responsiveMultiplier;
      let y = base.y;
      let rot = base.rot;
      let scale = base.scale;
      let zIndex = base.zIndex;

      if (focus !== null) {
        const distance = Math.abs(slot - focus);
        if (slot === focus) {
          y -= 0.9;
          scale *= 1.1;
          zIndex = 20;
        } else {
          const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
          const push = 2.6 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance)) * responsiveMultiplier;
          if (slot < focus) {
            x -= push;
            rot -= 3 / (distance + 1);
          } else {
            x += push;
            rot += 3 / (distance + 1);
          }
        }
      }

      const target = { xPercent: -50, x: `${x}rem`, y: `${y}rem`, rotation: rot, scale, zIndex };
      if (animate) {
        gsap.to(card, { ...target, duration: 0.5, ease: "power4.out" });
      } else {
        gsap.set(card, target);
      }
    });
  }, [visibleCount]);

  useEffect(() => {
    applyLayout(false);
    const onResize = () => applyLayout(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyLayout]);

  // Positions never move (see applyLayout above), but swapping a slot's
  // photo/name instantly still reads as a hard jump-cut. Cross-fade just the
  // content of whichever slots actually changed data, in place.
  useEffect(() => {
    const container = containerRef.current;
    const previous = prevCenterIndex.current;
    prevCenterIndex.current = centerIndex;
    if (previous === null || previous === centerIndex || !container) return;

    for (let slot = 0; slot < visibleCount; slot += 1) {
      const oldDataIndex = (((previous + slot - half) % totalCards) + totalCards) % totalCards;
      const newDataIndex = (((centerIndex + slot - half) % totalCards) + totalCards) % totalCards;
      if (oldDataIndex === newDataIndex) continue;
      const media = container.querySelector<HTMLElement>(`.fan-card[data-slot="${slot}"] .fan-card-media`);
      if (media) gsap.fromTo(media, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power1.out" });
    }
  }, [centerIndex, half, totalCards, visibleCount]);

  const handleEnter = useCallback((slot: number) => {
    focusedSlot.current = slot;
    applyLayout(true);
  }, [applyLayout]);

  const handleLeave = useCallback(() => {
    focusedSlot.current = null;
    applyLayout(true);
  }, [applyLayout]);

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
          {Array.from({ length: visibleCount }, (_, slot) => {
            const dataIndex = slotToDataIndex(slot);
            const card = cards[dataIndex];
            const isCentered = slot === half;

            const content = (
              <div className="fan-card-media relative h-full w-full overflow-hidden">
                <img src={card.imgUrl} loading="lazy" alt={card.alt || `${cardLabel} ${dataIndex + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                <div className="fan-card-shade absolute inset-0" />
                <div className="fan-card-copy absolute inset-x-0 bottom-0 z-20">
                  {card.title && <strong>{card.title}</strong>}
                  {card.subtitle && <span>{card.subtitle}</span>}
                </div>
              </div>
            );

            if (card.linkUrl) {
              return (
                <a
                  key={slot}
                  data-slot={slot}
                  href={card.linkUrl}
                  target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="fan-card block cursor-pointer"
                  onMouseEnter={() => handleEnter(slot)}
                  onMouseLeave={handleLeave}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={slot}
                data-slot={slot}
                type="button"
                className="fan-card"
                onClick={() => selectSlot(slot, dataIndex)}
                onMouseEnter={() => handleEnter(slot)}
                onMouseLeave={handleLeave}
                aria-pressed={isCentered}
                aria-label={card.title ? `${cardLabel}: ${card.title}` : `${cardLabel} ${dataIndex + 1}`}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="fan-pagination flex items-center justify-center gap-3">
          <button className={`${ARROW_CLASSES} h-10 w-10`} onClick={() => cycle("left")} aria-label={previousLabel}>
            {chevron("left")}
          </button>
          <div className="fan-dots flex items-center justify-center gap-1.5" aria-hidden="true">
            {cards.map((_, index) => (
              <span key={index} className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${index === centerIndex ? "scale-125 bg-black/70" : "bg-black/15"}`} />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} h-10 w-10`} onClick={() => cycle("right")} aria-label={nextLabel}>
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}

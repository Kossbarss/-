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

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const visibleCount = needsPagination ? MAX_VISIBLE : totalCards;
  const half = Math.floor(visibleCount / 2);

  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  useEffect(() => {
    if (totalCards) onActiveChange?.(centerIndex);
  }, [centerIndex, onActiveChange, totalCards]);

  // Each fan position is a fixed slot (0..visibleCount-1) that never moves;
  // only the data item shown inside it changes, instantly, with no
  // transition of any kind -- this matches the reference carousel exactly
  // (verified frame-by-frame against a screen recording of it: the featured
  // card's photo/name swap in a single frame, and hovering never moves any
  // card at all).
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    const responsiveMultiplier = getResponsiveMultiplier(window.innerWidth);

    const apply = () => {
      cardElements.forEach((card, slot) => {
        const base = getSlotConfig(visibleCount, slot);
        gsap.set(card, {
          xPercent: -50,
          x: `${base.x * getResponsiveMultiplier(window.innerWidth)}rem`,
          y: `${base.y}rem`,
          rotation: base.rot,
          scale: base.scale,
          zIndex: base.zIndex,
        });
      });
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [visibleCount]);

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

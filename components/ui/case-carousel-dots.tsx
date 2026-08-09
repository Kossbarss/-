"use client";

import { AnimatePresence, motion } from "motion/react";

interface CaseCarouselDotsAriaLabels {
  prev?: string;
  next?: string;
  track?: string;
  case?: (index: number) => string;
}

interface CaseCarouselDotsProps {
  total: number;
  activeIndex: number;
  onChange: (index: number) => void;
  ariaLabels?: CaseCarouselDotsAriaLabels;
}

export function CaseCarouselDots({ total, activeIndex, onChange, ariaLabels = {} }: CaseCarouselDotsProps) {
  if (total <= 1) return null;

  const ariaLabelPrev = ariaLabels.prev ?? "Попередній кейс";
  const ariaLabelNext = ariaLabels.next ?? "Наступний кейс";
  const ariaLabelTrack = ariaLabels.track ?? "Кейси учнів";
  const ariaLabelCase = ariaLabels.case ?? ((i: number) => `Кейс ${i + 1}`);

  const goPrev = () => onChange(activeIndex > 0 ? activeIndex - 1 : total - 1);
  const goNext = () => onChange(activeIndex < total - 1 ? activeIndex + 1 : 0);

  return (
    <div className="case-carousel-dots">
      <button
        type="button"
        className="case-carousel-dots-arrow"
        onClick={goPrev}
        aria-label={ariaLabelPrev}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="case-carousel-dots-track" role="tablist" aria-label={ariaLabelTrack}>
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={ariaLabelCase(i)}
              className={`case-carousel-dot${isActive ? " is-active" : ""}`}
              onClick={() => onChange(i)}
              animate={{ width: isActive ? 22 : 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              {isActive && (
                <AnimatePresence>
                  <motion.span
                    key="ripple"
                    className="case-carousel-dot-ripple"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </AnimatePresence>
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        type="button"
        className="case-carousel-dots-arrow"
        onClick={goNext}
        aria-label={ariaLabelNext}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default CaseCarouselDots;

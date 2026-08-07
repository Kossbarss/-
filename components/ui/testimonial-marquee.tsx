import React, { useEffect, useRef } from 'react';

// --- Component Interfaces ---
export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  avatarGradient: string;
  /** 0-5, fractional values (e.g. 4.5) partially fill the 5th star */
  rating: number;
}

export interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
  /** Seconds for one full loop of the track */
  speed?: number;
  /** Locale text for the verified-review badge, e.g. "Верифицировано" */
  verifiedLabel?: string;
  /** Locale text shown next to the star rating, e.g. "Оценка отзывов обучения" */
  ratingCaption?: string;
}

function Star({ keyIndex }: { keyIndex: number }) {
  return (
    <svg key={keyIndex} viewBox="0 0 24 24" width="16" height="16">
      <path
        d="M12 2.5l2.95 6.62 7.2.63-5.45 4.77 1.65 7.08L12 17.77l-6.35 3.83 1.65-7.08L1.85 9.75l7.2-.63z"
        fill="currentColor"
      />
    </svg>
  );
}

// Fills a fractional amount of the 5-star row (e.g. 4.5, 3.8) by layering
// an exact-width clipped copy of filled stars on top of a muted row,
// rather than only ever rounding to a whole star.
function StarRow({ rating, caption }: { rating: number; caption?: string }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="cases-marquee-rating-row">
      <div className="cases-marquee-stars" aria-label={`Оценка ${rating} из 5`}>
        <div className="cases-marquee-stars-track" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} keyIndex={i} />
          ))}
        </div>
        <div className="cases-marquee-stars-fill" style={{ width: `${percent}%` }} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} keyIndex={i} />
          ))}
        </div>
      </div>
      {caption && <span className="cases-marquee-stars-caption">{caption}</span>}
    </div>
  );
}

// Official Google "G" logomark (four brand colors), used only as a small
// verification icon next to real, Google-reviewed graduates.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="12" height="12" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.9 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5C39.9 36.9 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function VerifiedBadge({ label }: { label: string }) {
  return (
    <div className="cases-marquee-verified" title={label}>
      <span className="cases-marquee-verified-dot" aria-hidden="true" />
      <span className="cases-marquee-verified-label">{label}</span>
      <GoogleIcon />
    </div>
  );
}

function TestimonialCard({ testimonial, hidden, verifiedLabel, ratingCaption }: { testimonial: Testimonial; hidden: boolean; verifiedLabel: string; ratingCaption?: string }) {
  return (
    <div className="cases-marquee-card" aria-hidden={hidden || undefined}>
      <div className="cases-marquee-badge-row">
        <VerifiedBadge label={verifiedLabel} />
      </div>
      <div className="cases-marquee-header">
        <div className="cases-marquee-avatar" style={{ background: testimonial.avatarGradient }}>
          {testimonial.initials}
        </div>
        <div className="cases-marquee-who">
          <div className="cases-marquee-name">{testimonial.name}</div>
          <div className="cases-marquee-role">{testimonial.role}</div>
        </div>
      </div>
      <blockquote>{testimonial.quote}</blockquote>
      <StarRow rating={testimonial.rating} caption={ratingCaption} />
    </div>
  );
}

// Continuous horizontal auto-scroll ("marquee") of liquid-glass cards,
// draggable/swipeable by hand on any device. The list is duplicated once
// so the loop is seamless: position is tracked as a single pixel offset
// that wraps by exactly one copy's width whenever it runs past either
// end, so dragging and idle auto-scroll are the same motion -- no
// separate "paused" state to fall out of sync with. Hovering never
// pauses it; only an active drag does, and only for its duration.
export const TestimonialMarquee = ({ testimonials, speed = 42, verifiedLabel = 'Верифицировано', ratingCaption }: TestimonialMarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPositionRef = useRef(0);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl || !testimonials.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      halfWidthRef.current = trackEl.scrollWidth / 2;
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(trackEl);

    const wrap = () => {
      const half = halfWidthRef.current;
      if (!half) return;
      while (positionRef.current <= -half) positionRef.current += half;
      while (positionRef.current > 0) positionRef.current -= half;
    };

    let lastTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (!draggingRef.current && !reducedMotion && halfWidthRef.current) {
        positionRef.current -= (halfWidthRef.current / speed) * dt;
        wrap();
      }
      trackEl.style.transform = `translateX(${positionRef.current}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartPositionRef.current = positionRef.current;
      // Keeps receiving pointermove even if the drag leaves the track's own
      // bounds; a handful of pointer types/environments reject capture
      // outright, so a throw here shouldn't stop the drag from starting.
      try { trackEl.setPointerCapture(e.pointerId); } catch { /* capture not available for this pointer */ }
      trackEl.classList.add('is-dragging');
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      positionRef.current = dragStartPositionRef.current + (e.clientX - dragStartXRef.current);
      wrap();
    };
    const endDrag = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      trackEl.classList.remove('is-dragging');
      try { trackEl.releasePointerCapture(e.pointerId); } catch { /* pointer already released */ }
    };

    trackEl.addEventListener('pointerdown', onPointerDown);
    trackEl.addEventListener('pointermove', onPointerMove);
    trackEl.addEventListener('pointerup', endDrag);
    trackEl.addEventListener('pointercancel', endDrag);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      trackEl.removeEventListener('pointerdown', onPointerDown);
      trackEl.removeEventListener('pointermove', onPointerMove);
      trackEl.removeEventListener('pointerup', endDrag);
      trackEl.removeEventListener('pointercancel', endDrag);
    };
  }, [testimonials, speed]);

  if (!testimonials?.length) return null;
  const track = [...testimonials, ...testimonials];

  return (
    <div className="cases-marquee">
      <div className="cases-marquee-track" ref={trackRef}>
        {track.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
            hidden={index >= testimonials.length}
            verifiedLabel={verifiedLabel}
            ratingCaption={ratingCaption}
          />
        ))}
      </div>
    </div>
  );
};

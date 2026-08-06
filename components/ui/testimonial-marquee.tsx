import React from 'react';

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
function StarRow({ rating }: { rating: number }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
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
  );
}

function TestimonialCard({ testimonial, hidden }: { testimonial: Testimonial; hidden: boolean }) {
  return (
    <div className="cases-marquee-card" aria-hidden={hidden || undefined}>
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
      <StarRow rating={testimonial.rating} />
    </div>
  );
}

// Continuous horizontal auto-scroll ("marquee") of liquid-glass cards.
// The track is duplicated once so the loop is seamless (translateX(-50%)
// lands exactly back on the first copy); the animation itself is a plain
// CSS keyframe (see cases-marquee.css) so it keeps running smoothly
// without any per-frame JS. Hover pauses it; prefers-reduced-motion
// disables it entirely via the same CSS file.
export const TestimonialMarquee = ({ testimonials, speed = 42 }: TestimonialMarqueeProps) => {
  if (!testimonials?.length) return null;
  const track = [...testimonials, ...testimonials];

  return (
    <div className="cases-marquee" style={{ ['--marquee-duration' as string]: `${speed}s` }}>
      <div className="cases-marquee-track">
        {track.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
            hidden={index >= testimonials.length}
          />
        ))}
      </div>
    </div>
  );
};

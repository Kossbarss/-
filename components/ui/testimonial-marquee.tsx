import React from 'react';

// --- Component Interfaces ---
export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  avatarGradient: string;
  /** 1-5 filled stars */
  rating: number;
}

export interface TestimonialMarqueeProps {
  testimonials: Testimonial[];
  /** Seconds for one full loop of the track */
  speed?: number;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="testimonial-marquee-stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="16" height="16" className={i < rating ? 'is-filled' : ''}>
          <path
            d="M12 2.5l2.95 6.62 7.2.63-5.45 4.77 1.65 7.08L12 17.77l-6.35 3.83 1.65-7.08L1.85 9.75l7.2-.63z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, hidden }: { testimonial: Testimonial; hidden: boolean }) {
  return (
    <div className="testimonial-marquee-card" aria-hidden={hidden || undefined}>
      <StarRow rating={testimonial.rating} />
      <blockquote>&laquo;{testimonial.quote}&raquo;</blockquote>
      <div className="testimonial-marquee-footer">
        <div className="testimonial-marquee-avatar" style={{ background: testimonial.avatarGradient }}>
          {testimonial.initials}
        </div>
        <div className="testimonial-marquee-who">
          <div className="testimonial-marquee-name">{testimonial.name}</div>
          <div className="testimonial-marquee-role">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

// Continuous horizontal auto-scroll ("marquee") of liquid-glass cards.
// The track is duplicated once so the loop is seamless (translateX(-50%)
// lands exactly back on the first copy); the animation itself is a plain
// CSS keyframe (see testimonial-stack.css) so it keeps running smoothly
// without any per-frame JS. Hover pauses it; prefers-reduced-motion
// disables it entirely via the same CSS file.
export const TestimonialMarquee = ({ testimonials, speed = 42 }: TestimonialMarqueeProps) => {
  if (!testimonials?.length) return null;
  const track = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-marquee" style={{ ['--marquee-duration' as string]: `${speed}s` }}>
      <div className="testimonial-marquee-track">
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

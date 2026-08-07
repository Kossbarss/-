import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';

// --- Component Interfaces ---
export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  tags: { text: string; type: 'featured' | 'default' }[];
  stats: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string; }[];
  avatarGradient: string;
  /** 0-5, fractional values (e.g. 4.5) partially fill the 5th star */
  rating: number;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  /** How many cards to show behind the main card */
  visibleBehind?: number;
  /** Locale text shown next to the star rating, e.g. "Оценка отзывов обучения" */
  ratingCaption?: string;
}

function TestimonialStar({ keyIndex }: { keyIndex: number }) {
  return (
    <svg key={keyIndex} viewBox="0 0 24 24" width="14" height="14">
      <path
        d="M12 2.5l2.95 6.62 7.2.63-5.45 4.77 1.65 7.08L12 17.77l-6.35 3.83 1.65-7.08L1.85 9.75l7.2-.63z"
        fill="currentColor"
      />
    </svg>
  );
}

// Same fractional-fill technique as the cases-marquee stars: a transparent
// 5-star row sets the width, a gold copy on top is clipped to the exact
// rating percentage (flex-shrink: 0 on both keeps the browser from just
// squeezing all 5 stars smaller instead of clipping the trailing one).
function TestimonialStarRow({ rating, caption }: { rating: number; caption?: string }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="testimonial-rating-row">
      <div className="testimonial-stars" aria-label={`${rating} из 5`}>
        <div className="testimonial-stars-track" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <TestimonialStar key={i} keyIndex={i} />
          ))}
        </div>
        <div className="testimonial-stars-fill" style={{ width: `${percent}%` }} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <TestimonialStar key={i} keyIndex={i} />
          ))}
        </div>
      </div>
      {caption && <span className="testimonial-stars-caption">{caption}</span>}
    </div>
  );
}

// --- The Component ---
export const TestimonialStack = ({ testimonials, visibleBehind = 2, ratingCaption }: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = testimonials.length;

  const navigate = useCallback((newIndex: number) => {
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add('is-dragging');
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStartRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    cardRefs.current[activeIndex]?.classList.remove('is-dragging');
    if (Math.abs(dragOffset) > 50) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!testimonials?.length) return null;

  return (
    <section className="testimonials-stack relative pb-10">
      {testimonials.map((testimonial, index) => {
        const isActive = index === activeIndex;
        // Calculate the card's position in the display order
        const displayOrder = (index - activeIndex + totalCards) % totalCards;

        // --- DYNAMIC STYLE CALCULATION ---
        const style: CSSProperties = {};
        if (displayOrder === 0) { // The active card
          style.transform = `translateX(${dragOffset}px)`;
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) { // Cards stacked behind
          const scale = 1 - 0.05 * displayOrder;
          const translateY = -2 * displayOrder; // in rem
          style.transform = `scale(${scale}) translateY(${translateY}rem)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else { // Cards that are out of view
          style.transform = 'scale(0)';
          style.opacity = 0;
          style.zIndex = 0;
        }

        const tagClasses = (type: 'featured' | 'default') => type === 'featured'
          ? 'bg-primary/20 text-primary border border-primary/30'
          : 'bg-secondary text-secondary-foreground';

        return (
          <div
            ref={el => { cardRefs.current[index] = el; }}
            key={testimonial.id}
            className="testimonial-card glass-effect backdrop-blur-xl"
            style={style} // Apply dynamic styles here
            onMouseDown={(e) => handleDragStart(e, index)}
            onTouchStart={(e) => handleDragStart(e, index)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-white font-semibold text-base" style={{ background: testimonial.avatarGradient }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="text-card-foreground font-medium text-base">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              <blockquote className="text-card-foreground/90 leading-snug text-base mb-3">"{testimonial.quote}"</blockquote>

              <TestimonialStarRow rating={testimonial.rating} caption={ratingCaption} />

              <div className="flex flex-row items-center justify-between border-t border-border pt-3 gap-2">
                <div className="flex flex-wrap gap-2">
                  {testimonial.tags.map((tag, i) => (
                    <span key={i} className={['text-sm', 'px-2.5', 'py-1.5', 'rounded-md', tagClasses(tag.type)].join(' ')}>
                      {tag.text}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {testimonial.stats.map((stat, i) => {
                    const IconComponent = stat.icon;
                    return (
                      <span key={i} className="flex items-center">
                        <IconComponent className="mr-1 h-3.5 w-3.5" />
                        {stat.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pagination flex gap-2 justify-center absolute bottom-0 left-0 right-0">
        {testimonials.map((_, index) => (
          <button key={index} aria-label={`Go to testimonial ${index + 1}`} onClick={() => navigate(index)} className={`pagination-dot ${activeIndex === index ? 'active' : ''}`} />
        ))}
      </div>
    </section>
  );
};

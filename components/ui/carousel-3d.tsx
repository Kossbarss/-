"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";

type AnimationControls = ReturnType<typeof useAnimation>;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = () => setMatches(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export interface Carousel3DItem {
  src: string;
  alt: string;
  name: string;
  subtitle: string;
}

interface Carousel3DProps {
  items: Carousel3DItem[];
  onActiveChange?: (index: number) => void;
}

const faceTransition = { duration: 0.15, ease: [0.32, 0.72, 0, 1] as const };

// Face width is derived from the viewport's actual height (via ResizeObserver)
// rather than hard-coded per breakpoint, so it always matches whatever
// .carousel3d-viewport resolves to in CSS instead of two numbers drifting
// out of sync with each other over time.
const Drum = memo(function Drum({
  items,
  rotation,
  controls,
  onActiveChange,
}: {
  items: Carousel3DItem[];
  rotation: MotionValue<number>;
  controls: AnimationControls;
  onActiveChange?: (index: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const isCompact = useMediaQuery("(max-width: 640px)");
  // Desktop/tablet-and-up gets a wider, flatter, edge-cropped band (bigger
  // radius -> gentler curve per face at the same 360/faceCount angle,
  // matching the client's reference screenshot) instead of the narrower,
  // more tightly-curved mobile layout.
  const isWideDesktop = useMediaQuery("(min-width: 1024px)");
  const lastReported = useRef(-1);
  const rafId = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportHeight(el.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rather than deriving the "front" face from the rotation value via trig
  // (fragile: has to mirror the exact rotateY sign/handedness the browser
  // actually renders with), ask the browser directly which face is under
  // the viewport's center point -- the same point a real click there would
  // resolve to, so the detail panel below can never disagree with what's
  // actually centered.
  const reportFrontFace = useCallback(() => {
    const el = viewportRef.current;
    if (!el || !onActiveChange) return;
    const rect = el.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const face = hit?.closest<HTMLElement>("[data-carousel3d-index]");
    if (!face) return;
    const index = Number(face.dataset.carousel3dIndex);
    if (Number.isNaN(index) || index === lastReported.current) return;
    lastReported.current = index;
    onActiveChange(index);
  }, [onActiveChange]);

  useEffect(() => {
    // Faces only exist in the DOM once viewportHeight has been measured
    // (see the viewportHeight > 0 guard below), so the very first call here
    // can land before there's anything to hit-test; re-running whenever
    // viewportHeight changes covers that first real paint too.
    reportFrontFace();
    const unsubscribe = rotation.on("change", () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        reportFrontFace();
      });
    });
    return () => {
      unsubscribe();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [reportFrontFace, rotation, viewportHeight]);

  const faceCount = items.length;
  const widthRatio = isWideDesktop ? 0.8 : isCompact ? 0.62 : 0.67;
  const faceWidth = viewportHeight ? viewportHeight * widthRatio : 0;
  const cylinderWidth = faceWidth * faceCount;
  const radius = cylinderWidth / (2 * Math.PI);
  // Scaled to viewportHeight rather than a fixed px value -- a constant
  // perspective distance only looks right at the one container size it was
  // tuned for; at any other, the foreshortening ratio is off and the front
  // (translateZ'd closest) face renders visibly larger than its own layout
  // box, spilling into whatever sits above/below the carousel. Desktop's
  // wider drum (bigger radius) also needs a proportionally larger
  // perspective/radius ratio -- otherwise the close-to-camera front face
  // gets foreshortened into dominating the whole band instead of the flat,
  // evenly-sized row of photos in the reference screenshot.
  const perspective = viewportHeight * (isWideDesktop ? 14 : 5);
  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`);

  return (
    <div ref={viewportRef} className="carousel3d-viewport">
      {viewportHeight > 0 && (
        <div className="carousel3d-stage" style={{ perspective: `${perspective}px` }}>
          <motion.div
            drag="x"
            dragElastic={0.08}
            className="carousel3d-drum"
            style={{
              transform,
              rotateY: rotation,
              width: cylinderWidth,
              transformStyle: "preserve-3d",
            }}
            onDrag={(_, info) =>
              // onDrag fires on every pointer-move during the gesture; info.offset
              // is cumulative since drag start, so adding it on each event would
              // compound. info.delta is the per-event increment -- what should
              // actually be added to the running rotation each time.
              rotation.set(rotation.get() + info.delta.x * 0.05)
            }
            onDragEnd={(_, info) =>
              controls.start({
                rotateY: rotation.get() + info.velocity.x * 0.05,
                transition: { type: "spring", stiffness: 100, damping: 30, mass: 0.1 },
              })
            }
            animate={controls}
          >
            {items.map((item, i) => (
              <div
                key={`${item.src}-${i}`}
                data-carousel3d-index={i}
                className="carousel3d-face"
                style={{
                  width: `${faceWidth}px`,
                  // .carousel3d-face is positioned with CSS left:50%, which
                  // places its *left edge* at the drum's midline; translateX(-50%)
                  // shifts it back by half its own width so the rotation pivot
                  // (and translateZ) is centered instead, otherwise every face
                  // sits half a face-width off from where it should be.
                  transform: `translateX(-50%) rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                }}
              >
                <motion.img
                  src={item.src}
                  alt={item.alt}
                  className="carousel3d-face-img"
                  initial={{ filter: "blur(4px)" }}
                  animate={{ filter: "blur(0px)" }}
                  transition={faceTransition}
                />
                <div className="carousel3d-face-shade" aria-hidden="true" />
                <div className="carousel3d-face-copy">
                  <strong>{item.name}</strong>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
});

export function Carousel3D({ items, onActiveChange }: Carousel3DProps) {
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  if (!items.length) return null;

  return (
    <div className="carousel3d-root">
      <Drum items={items} rotation={rotation} controls={controls} onActiveChange={onActiveChange} />
    </div>
  );
}

export default Carousel3D;

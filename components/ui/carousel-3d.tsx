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

    // document.elementFromPoint forces a layout/hit-test pass -- cheap once,
    // but rotation.on("change") can fire dozens of times per frame while
    // actively dragging, and running a layout-forcing call that often
    // competes with the drum's own 3D transform rendering for main-thread
    // time, which is very plausibly the "laggy drag" the client reported
    // (especially on touch devices with less headroom than desktop). A
    // ~80ms time-based throttle (leading call immediately, trailing call
    // once things settle) keeps the detail panel close enough in sync --
    // text catching up 80ms late is imperceptible -- without competing with
    // every single drag frame.
    const THROTTLE_MS = 80;
    let lastRun = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runThrottled = () => {
      timeoutId = null;
      lastRun = performance.now();
      reportFrontFace();
    };

    const unsubscribe = rotation.on("change", () => {
      const now = performance.now();
      const elapsed = now - lastRun;
      if (elapsed >= THROTTLE_MS) {
        lastRun = now;
        reportFrontFace();
      } else if (timeoutId === null) {
        timeoutId = setTimeout(runThrottled, THROTTLE_MS - elapsed);
      }
    });

    return () => {
      unsubscribe();
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [reportFrontFace, rotation, viewportHeight]);

  const faceCount = items.length;

  // Desktop/tablet-and-up: square (aspect-square) photos, sized up from the
  // reference component's own ~128.57px (1800/14 -- read as too small next
  // to this section) to 220px per client feedback. Perspective is scaled
  // to radius (not the reference's fixed 1000px) for two reasons: (1) radius
  // grows with faceWidth, so a fixed perspective made the enlarged cards
  // foreshorten far more aggressively than the original 128.57px version;
  // (2) our 10 real cases sit 36deg apart (360/10) versus the reference's
  // 25.7deg (360/14), a wider gap per card that itself needs *more*
  // flattening to read as "3 near-flat cards + 2 angled ones", the pattern
  // in the client's reference screenshot, rather than only 2.
  const REFERENCE_FACE_WIDTH = 220;
  const PERSPECTIVE_TO_RADIUS_RATIO = 5.4;

  let faceWidth: number;
  let cylinderWidth: number;
  let radius: number;
  let perspective: number;

  if (isWideDesktop) {
    faceWidth = REFERENCE_FACE_WIDTH;
    cylinderWidth = faceWidth * faceCount;
    radius = cylinderWidth / (2 * Math.PI);
    perspective = radius * PERSPECTIVE_TO_RADIUS_RATIO;
  } else {
    const widthRatio = isCompact ? 0.62 : 0.67;
    faceWidth = viewportHeight ? viewportHeight * widthRatio : 0;
    cylinderWidth = faceWidth * faceCount;
    radius = cylinderWidth / (2 * Math.PI);
    perspective = viewportHeight * 5;
  }

  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`);

  return (
    <div ref={viewportRef} className="carousel3d-viewport">
      {viewportHeight > 0 && (
        <div className="carousel3d-stage" style={{ perspective: `${perspective}px` }}>
          <motion.div
            drag="x"
            dragElastic={0.08}
            // Framer's own drag inertia would animate its internal x/y after
            // release *in addition to* the onDragEnd spring below (which
            // drives our custom rotateY, not x/y) -- two animations racing
            // for the same gesture on every release, wasted work at best and
            // a plausible source of the reported "delayed" release feel at
            // worst. We roll our own release physics via onDragEnd, so
            // Framer's built-in momentum should stay off entirely.
            dragMomentum={false}
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
                className={isWideDesktop ? "carousel3d-face carousel3d-face--square" : "carousel3d-face"}
                style={{
                  width: `${faceWidth}px`,
                  // .carousel3d-face is positioned with CSS left:50%, which
                  // places its *left edge* at the drum's midline; translateX(-50%)
                  // shifts it back by half its own width so the rotation pivot
                  // (and translateZ) is centered instead, otherwise every face
                  // sits half a face-width off from where it should be. The
                  // square desktop variant is also top:50% (auto height, see
                  // the --square CSS), so it additionally needs translateY(-50%)
                  // to center vertically the same way.
                  transform: isWideDesktop
                    ? `translate(-50%, -50%) rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`
                    : `translateX(-50%) rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                }}
              >
                {isWideDesktop ? (
                  <motion.img
                    src={item.src}
                    alt={item.alt}
                    className="carousel3d-face-img-square"
                    initial={{ filter: "blur(4px)" }}
                    animate={{ filter: "blur(0px)" }}
                    transition={faceTransition}
                  />
                ) : (
                  <>
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
                  </>
                )}
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

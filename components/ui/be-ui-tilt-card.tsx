"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useHoverCapable() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);

    update();
    mq.addEventListener?.("change", update);

    return () => mq.removeEventListener?.("change", update);
  }, []);

  return canHover;
}

export interface TiltCardProps {
  children: ReactNode;
  max?: number;
  glare?: boolean;
  className?: string;
  /** Bump this (e.g. a counter) to play a brief automatic tilt sweep --
   * used on touch devices where there's no hover to discover the effect
   * with, so a "press" affordance can demo it on demand instead. */
  demoTrigger?: number;
}

export function TiltCard({
  children,
  max = 12,
  glare = true,
  className,
  demoTrigger,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const enabled = !reduce && canHover;
  const touchEnabled = !reduce;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const srx = useSpring(rx, SPRING_MOUSE);
  const sry = useSpring(ry, SPRING_MOUSE);

  const setFromPoint = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    ry.set((px - 0.5) * max);
    rx.set((0.5 - py) * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    setFromPoint(e.clientX, e.clientY);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchEnabled) return;
    const touch = e.touches[0];
    if (!touch) return;
    setFromPoint(touch.clientX, touch.clientY);
  };

  // Without this, a plain tap (touchstart immediately followed by
  // touchend, no touchmove in between) never moved the tilt at all --
  // only an actual drag did, since setFromPoint only ran from
  // onTouchMove. Every touch should react right away, drag or not.
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchEnabled) return;
    const touch = e.touches[0];
    if (!touch) return;
    setFromPoint(touch.clientX, touch.clientY);
  };

  // Touch devices have no hover to discover the tilt with, so a "press"
  // affordance elsewhere can bump demoTrigger to play a short automatic
  // sweep -- same rx/ry motion values, so it blends into a real drag if
  // the visitor keeps their finger on the card afterwards.
  useEffect(() => {
    if (demoTrigger === undefined || demoTrigger === 0 || reduce) return;
    const steps = [
      [max * 0.7, -max * 0.7],
      [-max * 0.7, max * 0.7],
      [max * 0.5, max * 0.5],
      [0, 0],
    ];
    const timers = steps.map(([stepRx, stepRy], i) =>
      setTimeout(() => {
        rx.set(stepRx);
        ry.set(stepRy);
      }, 220 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoTrigger]);

  const transform = useMotionTemplate`perspective(1000px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, var(--foreground), transparent 50%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={cn(
        "relative overflow-hidden rounded-2xl will-change-transform",
        className,
      )}
    >
      {children}

      {glare && (enabled || touchEnabled) ? (
        <motion.div
          aria-hidden
          style={{ background: glareBg }}
          className="pointer-events-none absolute inset-0 opacity-15"
        />
      ) : null}
    </motion.div>
  );
}

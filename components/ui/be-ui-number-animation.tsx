"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NumberTickerProps {
  value: number;
  /** Starting number the digits roll up from, instead of the default 0. */
  from?: number;
  /**
   * Milliseconds to hold on the "from" value, fully visible, before the
   * roll to "value" begins. 0 by default (rolls immediately once in
   * view) -- bump this when the starting number itself needs to be
   * legible, not just a blur the eye catches mid-motion.
   */
  startDelay?: number;
  pad?: number;
  duration?: number;
  stagger?: number;
  startOnView?: boolean;
  prefix?: string;
  suffix?: string;
  blur?: boolean;
  className?: string;
  digitClassName?: string;
  locale?: boolean;
  format?: (value: number) => string;
  /**
   * Height of each digit's box, in em (relative to that digit's own
   * font-size). 1.1 by default -- enough breathing room for a
   * standalone display number, but taller than a real line of text.
   * When the ticker sits inline inside a normal sentence (rather than
   * as its own block), the box's extra height above the digit glyphs
   * makes it visually stick up above the surrounding text's line,
   * reading as misaligned/"jumping" even though its bottom edge lines
   * up fine. Pass something closer to 1 (e.g. 0.95) in that case.
   */
  digitHeightEm?: number;
}

const DEFAULT_DIGIT_HEIGHT_EM = 1.1;
const DIGITS = Array.from({ length: 10 }, (_, n) => n);

function formatValue(
  raw: number,
  pad: number | undefined,
  locale: boolean | undefined,
  format: ((value: number) => string) | undefined,
) {
  const rounded = Math.round(raw);
  const formatted = format
    ? format(rounded)
    : locale
      ? rounded.toLocaleString()
      : rounded.toString();
  return pad ? formatted.padStart(pad, "0") : formatted;
}

export function NumberTicker({
  value,
  from,
  startDelay = 0,
  pad,
  duration = 0.9,
  stagger = 0.04,
  startOnView = true,
  prefix,
  suffix,
  blur = false,
  className,
  digitClassName,
  locale,
  format,
  digitHeightEm = DEFAULT_DIGIT_HEIGHT_EM,
}: NumberTickerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.6 });
  const shouldWatch = startOnView ? inView : true;
  const [armed, setArmed] = useState(!startOnView && startDelay === 0);

  useEffect(() => {
    if (!shouldWatch) return;
    if (startDelay <= 0) {
      setArmed(true);
      return;
    }
    const timer = window.setTimeout(() => setArmed(true), startDelay);
    return () => window.clearTimeout(timer);
  }, [shouldWatch, startDelay]);

  const text = useMemo(
    () => formatValue(value, pad, locale, format),
    [value, pad, format, locale],
  );

  // Same formatting as the target, so the "from" digits line up
  // position-for-position with the target digits (e.g. "125" -> "300",
  // both 3 characters). If the caller passes a "from" with a different
  // digit count than "value", positions beyond the shorter string just
  // fall back to 0 rather than misaligning.
  const fromText = useMemo(
    () => (from === undefined ? null : formatValue(from, pad, locale, format)),
    [from, pad, format, locale],
  );

  const glyphs = useMemo(() => {
    const chars = text.split("");
    const fromChars = fromText ? fromText.split("") : null;

    return chars.map((char, i) => {
      const fromIndex = fromChars ? fromChars.length - (chars.length - i) : -1;
      return {
        char,
        fromChar: fromChars && fromIndex >= 0 ? fromChars[fromIndex] : "0",
        id: `g-${chars.length - 1 - i}`,
      };
    });
  }, [text, fromText]);

  const readableText = `${prefix ?? ""}${text}${suffix ?? ""}`;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!armed || entered) return;

    const total = (duration + glyphs.length * stagger) * 1000;
    const timer = window.setTimeout(() => setEntered(true), total);

    return () => window.clearTimeout(timer);
  }, [armed, entered, duration, stagger, glyphs.length]);

  return (
    <span
      ref={containerRef}
      className={cn("inline-flex items-center tabular-nums", className)}
    >
      <span className="sr-only">{readableText}</span>

      <span aria-hidden="true" className="inline-flex items-center">
        {prefix ? <span>{prefix}</span> : null}

        {glyphs.map(({ char, fromChar, id }, i) => {
          const isDigit = /\d/.test(char);

          if (!isDigit) {
            return (
              <span key={id} className="inline-block">
                {char}
              </span>
            );
          }

          const digit = Number(char);
          const startDigit = Number(fromChar);

          return (
            <Digit
              key={id}
              digit={armed ? digit : startDigit}
              startDigit={startDigit}
              delay={entered ? 0 : i * stagger}
              duration={duration}
              blur={blur}
              className={digitClassName}
              heightEm={digitHeightEm}
            />
          );
        })}

        {suffix ? <span>{suffix}</span> : null}
      </span>
    </span>
  );
}

function Digit({
  digit,
  startDigit,
  delay,
  duration,
  blur,
  className,
  heightEm,
}: {
  digit: number;
  startDigit: number;
  delay: number;
  duration: number;
  blur: boolean;
  className?: string;
  heightEm: number;
}) {
  const reduce = useReducedMotion();
  const columnRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce || !blur || !columnRef.current || !Number.isFinite(digit)) {
      return;
    }

    const node = columnRef.current;
    const controls = animate(
      node,
      { filter: ["blur(10px)", "blur(0px)"] },
      {
        duration: Math.min(duration * 0.75, 0.32),
        delay,
        ease: EASE_OUT,
      },
    );

    return () => {
      controls.stop();
      node.style.filter = "blur(0px)";
    };
  }, [blur, delay, digit, duration, reduce]);

  return (
    <span
      className={cn("relative inline-block overflow-hidden", className)}
      style={{ height: `${heightEm}em`, width: "1ch" }}
    >
      <motion.span
        ref={columnRef}
        initial={{ y: `-${startDigit * heightEm}em` }}
        animate={{ y: `-${digit * heightEm}em` }}
        transition={
          reduce ? { duration: 0 } : { duration, delay, ease: EASE_OUT }
        }
        className="absolute inset-x-0 top-0 flex flex-col items-center will-change-[transform,filter]"
      >
        {DIGITS.map((n) => (
          <span
            key={n}
            className="flex items-center justify-center leading-none"
            style={{ height: `${heightEm}em` }}
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

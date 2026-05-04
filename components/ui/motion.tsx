"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "none";

const hiddenTransforms: Record<RevealDirection, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
  scale: "translate-y-5 scale-[0.96]",
  none: "",
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.18 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.2,0.85,0.25,1)] will-change-transform",
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0" : cn("opacity-0 blur-[2px]", hiddenTransforms[direction]),
        className
      )}
    >
      {children}
    </div>
  );
}

export function CountUp({
  end,
  start = 0,
  duration = 1300,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  formatLocale = "en-US",
}: {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  formatLocale?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(start);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      setValue(end);
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!active) return;

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    const run = () => {
      const startedAt = performance.now();
      const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 3);

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        setValue(start + (end - start) * easeOut(progress));

        if (progress < 1) {
          frameRef.current = window.requestAnimationFrame(tick);
        }
      };

      frameRef.current = window.requestAnimationFrame(tick);
    };

    timeoutRef.current = window.setTimeout(run, delay);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [active, delay, duration, end, start]);

  const formatted = new Intl.NumberFormat(formatLocale, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    useGrouping: false,
  }).format(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

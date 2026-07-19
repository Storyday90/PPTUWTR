"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to hold back after the trigger fires. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** When set, direct children are animated one after another at this interval. */
  stagger?: number;
}

/**
 * Scroll-triggered entrance. With `stagger`, each direct child rises in
 * sequence; otherwise the wrapper animates as one block. Visitors who prefer
 * reduced motion see content immediately with no animation.
 */
export function Reveal({ children, className, delay = 0, y = 36, stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger != null ? Array.from(el.children) : el;
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

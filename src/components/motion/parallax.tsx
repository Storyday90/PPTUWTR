"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** 0.1 = subtle drift, 0.3 = pronounced. Content is pre-scaled to hide edges. */
  speed?: number;
}

/**
 * Scrubbed vertical drift for full-bleed imagery. The inner layer is scaled
 * up slightly so the drift never exposes container edges.
 */
export function Parallax({ children, className, speed = 0.15 }: ParallaxProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!outerRef.current || !innerRef.current) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: outerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: outerRef },
  );

  return (
    <div ref={outerRef} className={className}>
      <div ref={innerRef} className="absolute -inset-0 h-full w-full" style={{ scale: 1 + speed * 1.4 }}>
        {children}
      </div>
    </div>
  );
}

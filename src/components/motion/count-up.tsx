"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scoreboard-style tally: counts from 0 when it scrolls into view. */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(value);
      return;
    }

    const counter = { n: 0 };
    gsap.to(counter, {
      n: value,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(counter.n));
      },
    });
  }, [value]);

  return <span ref={ref}>0</span>;
}

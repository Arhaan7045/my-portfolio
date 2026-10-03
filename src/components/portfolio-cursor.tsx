"use client";

import { useEffect, useRef } from "react";

export function PortfolioCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const selector = "a, button, [role='button'], input[type='button'], input[type='submit'], select, summary";
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      const target = event.target;
      const element = target instanceof Element ? target.closest(selector) : null;
      cursor.classList.toggle("is-link", !!element && element.matches("a"));
      cursor.classList.toggle("is-button", !!element && !element.matches("a"));
      cursor.classList.add("is-visible");
    };
    const leave = () => cursor.classList.remove("is-visible");

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span ref={cursorRef} id="portfolio-custom-cursor" className="portfolio-custom-cursor" aria-hidden="true">
      <span className="cursor-halo" />
      <span className="cursor-dot" />
    </span>
  );
}

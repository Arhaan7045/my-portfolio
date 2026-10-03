"use client";

import { useEffect, useRef } from "react";

export function PortfolioCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!cursor || !finePointer.matches) return;

    let frame = 0;
    let x = -100, y = -100, targetX = -100, targetY = -100;
    let velocityX = 0, velocityY = 0, lastTime = 0;

    const interactiveSelector = "a, button, [role='button'], input[type='button'], input[type='submit'], select, summary, label[for]";
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target;
      const element = target instanceof Element ? target.closest(interactiveSelector) : null;
      cursor.classList.toggle("is-link", !!element && element.matches("a"));
      cursor.classList.toggle("is-button", !!element && !element.matches("a"));
      cursor.classList.add("is-visible");

      if (reducedMotion.matches) {
        x = targetX; y = targetY;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
      } else if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const leave = () => cursor.classList.remove("is-visible");

    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 16.667, 1.5);
      lastTime = now;
      const spring = 0.24 * dt;
      const damping = Math.pow(0.68, dt);
      velocityX = (velocityX + (targetX - x) * spring) * damping;
      velocityY = (velocityY + (targetY - y) * spring) * damping;
      x += velocityX * dt;
      y += velocityY * dt;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      const remaining = Math.hypot(targetX - x, targetY - y);
      if (remaining > 0.25 || Math.hypot(velocityX, velocityY) > 0.12) {
        frame = requestAnimationFrame(animate);
      } else {
        x = targetX; y = targetY; velocityX = 0; velocityY = 0;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        frame = 0;
      }
    }

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={cursorRef} id="portfolio-custom-cursor" className="portfolio-custom-cursor" aria-hidden="true">
      <span className="cursor-halo" />
      <span className="cursor-dot" />
    </span>
  );
}

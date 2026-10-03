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
    let x = -100;
    let y = -100;
    let targetX = -100;
    let targetY = -100;
    let velocityX = 0;
    let velocityY = 0;
    let angle = 0;
    let lastTime = 0;

    const interactiveSelector = "a, button, [role='button'], input[type='button'], input[type='submit'], select, summary, label[for]";

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target;
      const interactive = target instanceof Element && !!target.closest(interactiveSelector);
      cursor.classList.toggle("is-interactive", interactive);
      cursor.classList.add("is-visible");

      if (reducedMotion.matches) {
        x = targetX;
        y = targetY;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.setProperty("--cursor-angle", "0deg");
        cursor.style.setProperty("--cursor-stretch-x", "1");
        cursor.style.setProperty("--cursor-stretch-y", "1");
      } else if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const leave = () => cursor.classList.remove("is-visible");

    function animate(now: number) {
      // Time-normalized spring keeps the feel consistent across refresh rates.
      const dt = Math.min((now - lastTime) / 16.667, 2);
      lastTime = now;
      const spring = 0.16 * dt;
      const damping = Math.pow(0.76, dt);
      velocityX = (velocityX + (targetX - x) * spring) * damping;
      velocityY = (velocityY + (targetY - y) * spring) * damping;
      x += velocityX * dt;
      y += velocityY * dt;

      const speed = Math.min(1, Math.hypot(velocityX, velocityY) / 15);
      if (Math.hypot(velocityX, velocityY) > 0.35) {
        angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
      }

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.setProperty("--cursor-angle", `${angle}deg`);
      cursor.style.setProperty("--cursor-stretch-x", String(1 + speed * 0.52));
      cursor.style.setProperty("--cursor-stretch-y", String(1 - speed * 0.28));

      const remaining = Math.hypot(targetX - x, targetY - y);
      const velocity = Math.hypot(velocityX, velocityY);
      if (remaining > 0.18 || velocity > 0.1) {
        frame = requestAnimationFrame(animate);
      } else {
        x = targetX;
        y = targetY;
        velocityX = 0;
        velocityY = 0;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.setProperty("--cursor-stretch-x", "1");
        cursor.style.setProperty("--cursor-stretch-y", "1");
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

  return <span ref={cursorRef} id="portfolio-custom-cursor" className="portfolio-custom-cursor" aria-hidden="true" />;
}

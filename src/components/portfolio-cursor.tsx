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
    let previousX = -100;
    let previousY = -100;
    let angle = 0;
    let targetAngle = 0;
    let scaleX = 1;
    let scaleY = 1;
    let overInteractive = false;

    const interactiveSelector = "a, button, [role='button'], input[type='button'], input[type='submit'], select, summary, label[for]";
    const updateInteractive = (event: PointerEvent) => {
      const target = event.target;
      overInteractive = target instanceof Element && !!target.closest(interactiveSelector);
      cursor.classList.toggle("is-interactive", overInteractive);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;

      const dx = targetX - previousX;
      const dy = targetY - previousY;
      if (Math.hypot(dx, dy) > 0.5) targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      previousX = targetX;
      previousY = targetY;

      cursor.classList.add("is-visible");
      updateInteractive(event);

      if (reducedMotion.matches) {
        x = targetX;
        y = targetY;
        angle = targetAngle;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.setProperty("--cursor-angle", `${angle}deg`);
      } else if (!frame) frame = requestAnimationFrame(animate);
    };

    const leave = () => cursor.classList.remove("is-visible");
    function animate() {
      x += (targetX - x) * 0.42;
      y += (targetY - y) * 0.42;

      let angleDelta = ((targetAngle - angle + 540) % 360) - 180;
      angle += angleDelta * 0.28;

      const velocity = Math.min(1, Math.hypot(targetX - x, targetY - y) / 24);
      scaleX = 1 + velocity * 0.32;
      scaleY = 1 - velocity * 0.16;

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.setProperty("--cursor-angle", `${angle}deg`);
      cursor.style.setProperty("--cursor-stretch-x", String(scaleX));
      cursor.style.setProperty("--cursor-stretch-y", String(scaleY));

      if (Math.hypot(targetX - x, targetY - y) > 0.35) {
        frame = requestAnimationFrame(animate);
      } else {
        x = targetX;
        y = targetY;
        scaleX = 1;
        scaleY = 1;
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

  return (
    <span ref={cursorRef} id="portfolio-custom-cursor" className="portfolio-custom-cursor" aria-hidden="true">
      <span className="portfolio-cursor-ring" />
      <span className="portfolio-cursor-dot" />
    </span>
  );
}

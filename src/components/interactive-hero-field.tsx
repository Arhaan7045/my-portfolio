"use client";

import { useEffect, useRef } from "react";

/** Static, low-contrast hero grid. No pointer response or animation. */
export function InteractiveHeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    const hero = canvas?.parentElement?.parentElement;
    if (!canvas || !context || !hero) return;

    let observer: ResizeObserver | undefined;
    const draw = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const spacing = 42;
      context.beginPath();
      for (let x = 0; x <= width; x += spacing) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += spacing) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.strokeStyle = "rgba(190, 158, 255, 0.075)";
      context.lineWidth = 0.7;
      context.stroke();
    };

    draw();
    observer = new ResizeObserver(draw);
    observer.observe(hero);
    return () => observer?.disconnect();
  }, []);

  return (
    <div className="interactive-hero-field" aria-hidden="true">
      <canvas className="interactive-hero-grid" ref={canvasRef} />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

export function InteractiveHeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<Point>({ x: -1000, y: -1000 });
  const target = useRef<Point>({ x: -1000, y: -1000 });
  const active = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const hero = root?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !root || !hero || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom;
      active.current = inside;
      if (inside) {
        target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        root.style.setProperty("--cursor-x", `${target.current.x}px`);
        root.style.setProperty("--cursor-y", `${target.current.y}px`);
        root.dataset.active = "true";
      } else {
        root.dataset.active = "false";
        target.current = { x: -1000, y: -1000 };
      }
      if (!reducedMotion.matches) start();
      else draw();
    };

    const onLeave = () => {
      active.current = false;
      target.current = { x: -1000, y: -1000 };
      root.dataset.active = "false";
      if (!reducedMotion.matches) start();
      else draw();
    };

    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      const spacing = 42;
      const px = pointer.current.x;
      const py = pointer.current.y;
      const influence = active.current ? 150 : 0;
      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      const warped = (x: number, y: number): Point => {
        const dx = x - px;
        const dy = y - py;
        const distance = Math.hypot(dx, dy);
        if (!influence || distance > influence) return { x, y };
        const falloff = Math.pow(1 - distance / influence, 2);
        const safeDistance = Math.max(distance, 0.001);
        const pull = -22 * falloff;
        const ripple = Math.sin(distance / 17) * 4 * falloff;
        return {
          x: x + (dx / safeDistance) * (pull + ripple),
          y: y + (dy / safeDistance) * (pull + ripple),
        };
      };

      context.lineWidth = 0.7;
      for (let row = 0; row <= rows; row++) {
        context.beginPath();
        for (let col = 0; col <= columns; col++) {
          const point = warped(col * spacing, row * spacing);
          if (col === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = active.current ? "rgba(190, 158, 255, 0.15)" : "rgba(190, 158, 255, 0.075)";
        context.stroke();
      }
      for (let col = 0; col <= columns; col++) {
        context.beginPath();
        for (let row = 0; row <= rows; row++) {
          const point = warped(col * spacing, row * spacing);
          if (row === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = active.current ? "rgba(190, 158, 255, 0.15)" : "rgba(190, 158, 255, 0.075)";
        context.stroke();
      }

      if (active.current) {
        const gradient = context.createRadialGradient(px, py, 0, px, py, 150);
        gradient.addColorStop(0, "rgba(150, 108, 242, 0.09)");
        gradient.addColorStop(1, "rgba(150, 108, 242, 0)");
        context.fillStyle = gradient;
        context.fillRect(px - 150, py - 150, 300, 300);
      }
    }

    function animate() {
      const ease = 0.18;
      pointer.current.x += (target.current.x - pointer.current.x) * ease;
      pointer.current.y += (target.current.y - pointer.current.y) * ease;
      draw();
      const distance = Math.hypot(target.current.x - pointer.current.x, target.current.y - pointer.current.y);
      if (distance > 0.35) frame = window.requestAnimationFrame(animate);
      else frame = 0;
    }

    function start() {
      if (!frame) frame = window.requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    const onMotionChange = () => {
      if (reducedMotion.matches) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        pointer.current = { ...target.current };
        draw();
      } else start();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="interactive-hero-field" ref={rootRef} aria-hidden="true" data-active="false">
      <canvas className="interactive-hero-grid" ref={canvasRef} />
      <span className="interactive-hero-cursor" />
    </div>
  );
}

"use client";

import { useRef, type PointerEvent } from "react";
import { useReducedMotion } from "motion/react";
import { HeroEnvironment } from "@/components/hero-environment";

export function HeroScene() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    sceneRef.current.style.setProperty("--atrium-pointer-x", (((event.clientX - rect.left) / rect.width - .5) * 2).toFixed(3));
    sceneRef.current.style.setProperty("--atrium-pointer-y", (((event.clientY - rect.top) / rect.height - .5) * 2).toFixed(3));
  };
  const resetPointer = () => {
    sceneRef.current?.style.setProperty("--atrium-pointer-x", "0");
    sceneRef.current?.style.setProperty("--atrium-pointer-y", "0");
  };
  return (
    <div ref={sceneRef} className={`hero-scene${reducedMotion ? " is-reduced-motion" : ""}`} aria-hidden="true" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <HeroEnvironment />
      <div className="hero-scene-vignette" />
    </div>
  );
}

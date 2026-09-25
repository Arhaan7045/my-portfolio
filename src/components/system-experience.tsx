"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSiteSystem } from "@/components/site-system-provider";

const SYSTEM_TARGETS = [
  { selector: ".hero", label: "HERO" },
  { selector: "#about", label: "ABOUT" },
  { selector: "#skills", label: "SKILLS" },
  { selector: "#projects", label: "PROJECTS" },
  { selector: "#experience", label: "EXPERIENCE" },
  { selector: "#certifications", label: "CREDENTIALS" },
  { selector: "#learning", label: "LEARNING" },
  { selector: "#contact", label: "CONTACT" },
  { selector: "footer.footer", label: "ENDPOINT" },
] as const;

type Target = (typeof SYSTEM_TARGETS)[number];

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function SystemExperience() {
  const { systemActive, closeSystem } = useSiteSystem();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [route, setRoute] = useState<{ x: number; y: number }[]>([]);
  const runRef = useRef(0);

  const targets = useMemo(() => SYSTEM_TARGETS, []);

  const measureRoute = useCallback(() => {
    const points = targets.map(({ selector }) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: window.innerWidth * 0.5, y: rect.top + Math.min(rect.height * 0.28, 180) };
    }).filter((point): point is { x: number; y: number } => Boolean(point));
    setRoute(points);
  }, [targets]);

  useEffect(() => {
    if (!systemActive) {
      runRef.current += 1;
      setVisible(false);
      setStep(0);
      document.querySelectorAll(".system-focus, .system-next").forEach((element) => {
        element.classList.remove("system-focus", "system-next");
      });
      return;
    }

    const runId = ++runRef.current;
    const run = async () => {
      setVisible(true);
      setStep(0);

      const elements = targets
        .map(({ selector }) => document.querySelector<HTMLElement>(selector))
        .filter((element): element is HTMLElement => Boolean(element));

      if (!elements.length) return;

      elements.forEach((element) => element.classList.remove("system-focus", "system-next"));
      elements[0]?.classList.add("system-focus");
      elements[1]?.classList.add("system-next");

      const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
      elements[0]?.scrollIntoView({ behavior, block: "start" });

      if (reducedMotion) {
        await sleep(250);
        if (runId !== runRef.current) return;
        closeSystem();
        return;
      }

      await sleep(900);

      for (let index = 0; index < elements.length; index += 1) {
        if (runId !== runRef.current) return;

        setStep(index);
        elements.forEach((element) => element.classList.remove("system-focus", "system-next"));
        elements[index]?.classList.add("system-focus");
        elements[index + 1]?.classList.add("system-next");

        elements[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
        await sleep(index === elements.length - 1 ? 1500 : 1150);
      }

      if (runId !== runRef.current) return;
      await sleep(500);
      closeSystem();
    };

    void run();
  }, [closeSystem, reducedMotion, systemActive, targets]);

  useEffect(() => {
    if (!systemActive) return;

    const update = () => measureRoute();
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    const frame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [measureRoute, systemActive]);

  useEffect(() => {
    if (!systemActive) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSystem();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSystem, systemActive]);

  if (!systemActive || !visible) return null;

  const current = targets[Math.min(step, targets.length - 1)];
  const progress = ((Math.min(step, targets.length - 1) + 1) / targets.length) * 100;

  return (
    <div className="system-experience" aria-hidden="true">
      <div className="system-vignette" />
      <motion.div
        className="system-signal"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.7 }}
        style={{ transformOrigin: "left center" }}
      />

      <svg className="system-route" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={route.length > 1 ? route.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") : ""}
          pathLength={1}
          className="system-route-path"
        />
        {route[step] && (
          <motion.circle
            cx={route[step].x}
            cy={route[step].y}
            r="4"
            className="system-route-node"
            animate={reducedMotion ? undefined : { r: [3, 6, 3], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </svg>

      <div className="system-minimal-ui">
        <span className="system-minimal-label">SYSTEM</span>
        <span className="system-minimal-current">{current?.label}</span>
        <span className="system-minimal-count">
          {String(Math.min(step + 1, targets.length)).padStart(2, "0")} / {String(targets.length).padStart(2, "0")}
        </span>
        <button type="button" onClick={closeSystem} aria-label="Stop system experience">
          ESC
        </button>
      </div>

      <div className="system-progress" style={{ "--system-progress": `${progress}%` } as React.CSSProperties}>
        <span />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ControlLink } from "@/components/control-surface";
import { HeroMode, HeroVisual } from "@/components/hero-visual";

const modes: HeroMode[] = ["LEARN", "TEST", "BUILD"];

const primaryActionByMode = {
  LEARN: { label: "EXPLORE LEARNING", href: "#learning" },
  TEST: { label: "VIEW PROJECTS", href: "#projects" },
  BUILD: { label: "SEE EXPERIENCE", href: "#experience" },
} as const;

export function HeroSection() {
  const [mode, setMode] = useState<HeroMode>("LEARN");
  const cycleMode = () => setMode((current) => modes[(modes.indexOf(current) + 1) % modes.length]);
  const primaryAction = primaryActionByMode[mode];

  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy reveal">
        <p className="eyebrow">CYBERSECURITY • VAPT • SECURITY</p>
        <h1 id="hero-title" className="hero-headline" aria-label="Learn. Test. Build.">
          {modes.map((item) => (
            <span
              key={item}
              className={`hero-word${mode === item ? " hero-word-active" : ""}`}
              aria-current={mode === item ? "true" : undefined}
            >
              {item}<span className="hero-word-dot" aria-hidden="true">.</span>
            </span>
          ))}
        </h1>
        <p className="hero-intro">
          Building practical cybersecurity skills through labs, testing, and hands-on experience.
        </p>
        <p className="availability">
          <span aria-hidden="true" />
          Currently focused on hands-on cybersecurity learning
        </p>
        <div className="hero-actions">
          <ControlLink className="button button-primary" href={primaryAction.href}>
            <span className="control-label">{primaryAction.label}</span>
            <span className="control-arrow control-arrow-up" aria-hidden="true">↗</span>
          </ControlLink>
          <ControlLink
            className="button button-secondary"
            href="https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="control-label">RESUME</span>
            <span className="control-arrow control-arrow-down" aria-hidden="true">↓</span>
          </ControlLink>
        </div>
      </div>
      <HeroVisual mode={mode} onModeCycle={cycleMode} />
    </section>
  );
}

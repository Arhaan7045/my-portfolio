"use client";

import { useEffect, useState } from "react";
import { ControlLink } from "@/components/control-surface";
import { HeroVisual } from "@/components/hero-visual";

const HERO_NAME = "Arhaan Shaikh";
const ENCRYPTED_NAME = "X7#A4N S#A1KH";

function useDecryptReveal(text: string) {
  const [displayText, setDisplayText] = useState(ENCRYPTED_NAME);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplayText(text);
      return;
    }

    let animationFrame = 0;
    let startTime = 0;
    const holdDuration = 1000;
    const revealDuration = 850;
    const encrypted = Array.from(ENCRYPTED_NAME);
    const target = Array.from(text);

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      if (elapsed < holdDuration) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((elapsed - holdDuration) / revealDuration, 1);
      const resolvedCount = Math.floor(progress * target.length);
      const next = target.map((character, index) => {
        if (character === " ") return " ";
        return index < resolvedCount ? character : encrypted[index] ?? character;
      }).join("");

      setDisplayText(next);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [text]);

  return displayText;
}

const RESUME_URL =
  "https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing";

export function HeroSection() {
  const revealedName = useDecryptReveal(HERO_NAME);

  return (
    <section
      className="hero shell"
      aria-labelledby="hero-title"
    >
      <div className="hero-copy reveal">
        <p className="eyebrow">HELLO, I&apos;M</p>

        <h1 id="hero-title" className="hero-headline hero-headline-identity" aria-label="Arhaan Shaikh">
          <span aria-hidden="true">{revealedName}<span>.</span></span>
        </h1>

        <p className="hero-positioning">
          Cybersecurity learner focused on <strong>web security and VAPT.</strong>
        </p>

        <p className="hero-intro">
          I’m an MCA student building practical skills through security labs and hands-on projects, while documenting what I learn.
        </p>

        <div className="hero-actions">
          <ControlLink className="button button-primary" href="#projects">
            <span className="control-label">EXPLORE MY WORK</span>
            <span className="control-arrow control-arrow-up" aria-hidden="true">↗</span>
          </ControlLink>
          <ControlLink
            className="button button-secondary"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="control-label">VIEW RESUME</span>
            <span className="control-arrow control-arrow-down" aria-hidden="true">↓</span>
          </ControlLink>
        </div>

        <p className="hero-focus" aria-label="Current focus">
          WEB SECURITY <span>·</span> VAPT <span>·</span> LINUX <span>·</span> NETWORKING
        </p>
      </div>

      <HeroVisual />
    </section>
  );
}

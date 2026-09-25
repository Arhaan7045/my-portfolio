"use client";

import { motion, useReducedMotion } from "motion/react";
import { ControlLink } from "@/components/control-surface";
import { HeroVisual } from "@/components/hero-visual";

const RESUME_URL =
  "https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing";

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy reveal">
        <p className="eyebrow">HELLO, I&apos;M</p>

        <h1 id="hero-title" className="hero-headline hero-headline-identity">
          ARHAAN SHAIKH<span>.</span>
        </h1>

        <p className="hero-positioning">
          I&apos;m building my way into <strong>cybersecurity.</strong>
        </p>

        <p className="hero-intro">
          I&apos;m an MCA student learning how systems work, how they break,
          and how they can be secured.
        </p>

        <p className="hero-detail">
          Currently focused on web application security, VAPT, Linux,
          networking, and security operations — building practical skills
          through hands-on learning and real-world experience.
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

        <div className="hero-meta" aria-label="Current focus">
          <span><i aria-hidden="true" /> MCA STUDENT</span>
          <span>•</span>
          <span>CYBERSECURITY</span>
          <span>•</span>
          <span>VAPT</span>
        </div>
      </div>

      <HeroVisual reducedMotion={reducedMotion} />
    </section>
  );
}

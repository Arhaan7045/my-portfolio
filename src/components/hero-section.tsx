"use client";

import { ControlLink } from "@/components/control-surface";
import { HeroVisual } from "@/components/hero-visual";

const RESUME_URL =
  "https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing";

export function HeroSection() {
  return (
    <section
      className="hero shell"
      aria-labelledby="hero-title"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        event.currentTarget.style.setProperty("--hero-pointer-x", `${x}%`);
        event.currentTarget.style.setProperty("--hero-pointer-y", `${y}%`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--hero-pointer-x", "50%");
        event.currentTarget.style.setProperty("--hero-pointer-y", "45%");
      }}
    >
      <div className="hero-copy reveal">
        <p className="eyebrow">HELLO, I&apos;M</p>

        <h1 id="hero-title" className="hero-headline hero-headline-identity">
          Arhaan Shaikh<span>.</span>
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

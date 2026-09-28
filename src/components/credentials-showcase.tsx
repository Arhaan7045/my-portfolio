"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Certification = {
  title: string;
  issuer: string;
  description: string;
};

type CredentialsShowcaseProps = {
  formalCertifications: Certification[];
  virtualExperiences: Certification[];
};

const ease = [0.22, 1, 0.36, 1] as const;
const PEEK_INTERVAL = 5200;
const PEEK_DURATION = 850;

export function CredentialsShowcase({
  formalCertifications,
  virtualExperiences,
}: CredentialsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoPeekIndex, setAutoPeekIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setActiveIndex((current) =>
      formalCertifications.length === 0
        ? 0
        : Math.min(current, formalCertifications.length - 1),
    );
  }, [formalCertifications.length]);

  useEffect(() => {
    if (reducedMotion || formalCertifications.length < 2) {
      setAutoPeekIndex(null);
      return;
    }

    let nextCandidate = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      let candidate = nextCandidate % formalCertifications.length;
      nextCandidate += 1;

      if (candidate === activeIndex) {
        candidate = nextCandidate % formalCertifications.length;
        nextCandidate += 1;
      }

      setAutoPeekIndex(candidate);

      if (resetTimer) clearTimeout(resetTimer);

      resetTimer = setTimeout(() => {
        setAutoPeekIndex((current) => (current === candidate ? null : current));
      }, PEEK_DURATION);
    }, PEEK_INTERVAL);

    return () => {
      clearInterval(interval);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [activeIndex, formalCertifications.length, reducedMotion]);

  const peekIndex = hoveredIndex ?? autoPeekIndex;

  return (
    <div className="credentials-showcase reveal">
      <div className="credential-deck-wrap">
        <div className="credential-deck-label">
          <span>01 / FORMAL CREDENTIALS</span>
          <span>
            ARCHIVE / {String(formalCertifications.length).padStart(2, "0")}
          </span>
        </div>

        <div className="credential-deck" aria-label="Formal certifications">
          {formalCertifications.map((certification, index) => {
            const isActive = activeIndex === index;
            const depth = Math.abs(index - activeIndex);
            const isPeeking = !isActive && peekIndex === index;

            return (
              <motion.button
                type="button"
                key={certification.title + "-" + index}
                className={`credential-deck-card${isActive ? " is-active" : ""}`}
                style={{
                  zIndex: isActive ? 30 : 20 - Math.min(depth, 10),
                }}
                initial={false}
                animate={{
                  x: 0,
                  y: isActive ? 0 : isPeeking ? 6 : 12 + Math.min(depth, 5) * 9,
                  rotate: 0,
                  scale: 1,
                }}
                transition={{
                  duration: isPeeking ? 0.72 : 0.58,
                  ease,
                }}
                onHoverStart={() => {
                  if (!isActive) setHoveredIndex(index);
                }}
                onHoverEnd={() => {
                  setHoveredIndex((current) =>
                    current === index ? null : current,
                  );
                }}
                onClick={() => {
                  setActiveIndex(index);
                  setHoveredIndex(null);
                  setAutoPeekIndex(null);
                }}
                aria-pressed={isActive}
              >
                <span className="credential-deck-top">
                  <span>FORMAL CREDENTIAL</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>

                <span className="credential-deck-core">
                  <span className="credential-deck-mark" aria-hidden="true">
                    ✦
                  </span>
                  <span className="credential-deck-copy">
                    <span className="credential-deck-issuer">
                      {certification.issuer}
                    </span>
                    <span className="credential-deck-title">
                      {certification.title}
                    </span>
                    <span className="credential-deck-description">
                      {certification.description}
                    </span>
                  </span>
                </span>

                <span className="credential-deck-bottom">
                  <span>
                    {isActive ? "SELECTED CREDENTIAL" : "ARCHIVED CREDENTIAL"}
                  </span>
                  <span>{isActive ? "ACTIVE" : "OPEN"}</span>
                </span>
              </motion.button>
            );
          })}

          {formalCertifications.length === 0 && (
            <div className="credential-deck-empty">
              No formal credentials published yet.
            </div>
          )}
        </div>

        {formalCertifications.length > 1 && (
          <p className="credential-deck-hint">
            Hover the exposed edge to preview · click or tap to select
          </p>
        )}
      </div>

      <div className="virtual-experience-card">
        <div className="credentials-archive-divider">
          <span>VIRTUAL EXPERIENCE</span>
          <span>FORAGE / JOB SIMULATIONS</span>
        </div>
        <div className="virtual-experience-list">
          {virtualExperiences.map((item, index) => (
            <motion.article
              className="virtual-experience-row"
              key={item.title + "-" + index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease,
              }}
            >
              <span className="virtual-experience-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="virtual-experience-platform">
                {item.issuer}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

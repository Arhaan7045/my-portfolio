"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev" | null>(null);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const credentialCount = formalCertifications.length;

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch || formalCertifications.length < 2) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }

      const nextIndex = deltaX < 0 ? activeIndex + 1 : activeIndex - 1;
      if (nextIndex < 0 || nextIndex >= formalCertifications.length) return;

      setSwipeDirection(deltaX < 0 ? "next" : "prev");
      setOutgoingIndex(activeIndex);
      setActiveIndex(nextIndex);
      setHoveredIndex(null);
      setAutoPeekIndex(null);

      window.setTimeout(() => {
        setOutgoingIndex(null);
        setSwipeDirection(null);
      }, 360);
    };

    deck.addEventListener("touchstart", handleTouchStart, { passive: true });
    deck.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      deck.removeEventListener("touchstart", handleTouchStart);
      deck.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, formalCertifications.length]);

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

    if (isMobile) {
      setAutoPeekIndex(activeIndex === 0 ? 1 : 0);
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
  }, [activeIndex, formalCertifications.length, reducedMotion, isMobile]);

  const peekIndex = hoveredIndex ?? autoPeekIndex;

  const selectCredential = (index: number) => {
    if (index < 0 || index >= formalCertifications.length || index === activeIndex) {
      return;
    }
    setActiveIndex(index);
    setHoveredIndex(null);
    setAutoPeekIndex(null);
  };
  return (
    <div className="credentials-showcase reveal">
      <div
        className="credential-deck-wrap"
        style={
          {
            "--credential-count": Math.max(credentialCount, 1),
          } as CSSProperties
        }
      >
        <div className="credential-deck-label">
          <span>01 / FORMAL CREDENTIALS</span>
          <span>
            ARCHIVE / {String(formalCertifications.length).padStart(2, "0")}
          </span>
        </div>

        <div
          ref={deckRef}
          className="credential-deck"
          aria-label="Formal certifications"
        >
          {formalCertifications.map((certification, index) => {
            const isActive = activeIndex === index;
            const depth = Math.abs(index - activeIndex);
            const side = index === activeIndex ? 0 : index > activeIndex ? 1 : -1;
            const isPeeking = !isActive && peekIndex === index;
            const restingX =
              side * (92 + Math.max(0, depth - 1) * 20);
            const restingY = 14 + Math.min(2, depth) * 4;
            const restingRotate =
              side * (1.6 + Math.min(2, Math.max(0, depth - 1)) * 0.4);

            return (
              <motion.button
                type="button"
                key={certification.title + "-" + index}
                className={`credential-deck-card${isActive ? " is-active" : ""}`}
                style={{
                  zIndex:
                    isActive
                      ? 30
                      : outgoingIndex === index
                        ? 29
                        : 20 - Math.min(depth, 10),
                }}
                initial={false}
                animate={{
                  x: isMobile
                    ? outgoingIndex === index
                      ? swipeDirection === "next"
                        ? -360
                        : 360
                      : 0
                    : isActive
                      ? 0
                      : isPeeking
                        ? side * 190
                        : restingX,
                  y: isMobile
                    ? outgoingIndex === index
                      ? 8
                      : isPeeking
                        ? 14
                        : 20 + Math.min(depth, 3) * 8
                    : isActive
                      ? 0
                      : restingY,
                  rotate: isMobile ? 0 : isActive ? 0 : restingRotate,
                  scale: isMobile ? 1 : isActive ? 1 : 0.975,
                  opacity:
                    isMobile && outgoingIndex === index
                      ? 0.35
                      : 1,
                }}
                transition={{
                  duration: isMobile && outgoingIndex === index ? 0.32 : isPeeking ? 0.72 : 0.58,
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
                  selectCredential(index);
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
          <>
            <div className="credential-deck-position" aria-label="Credential position">
              <button
                type="button"
                className="credential-deck-nav"
                onClick={() => (isMobile ? swipeTo("prev") : selectCredential(activeIndex - 1))}
                disabled={activeIndex === 0 || outgoingIndex !== null}
                aria-label="Previous certificate"
              >
                ‹
              </button>
              <span className="credential-deck-position-label">
                CERTIFICATE {String(activeIndex + 1).padStart(2, "0")} / {String(formalCertifications.length).padStart(2, "0")}
              </span>
              <div className="credential-deck-progress" aria-hidden="true">
                {formalCertifications.map((_, index) => (
                  <span
                    key={index}
                    className={index === activeIndex ? "is-active" : ""}
                  />
                ))}
              </div>
              <button
                type="button"
                className="credential-deck-nav"
                onClick={() => (isMobile ? swipeTo("next") : selectCredential(activeIndex + 1))}
                disabled={activeIndex === formalCertifications.length - 1 || outgoingIndex !== null}
                aria-label="Next certificate"
              >
                ›
              </button>
            </div>
            <p className="credential-deck-hint">
              {isMobile
                ? "Swipe left or right to move through certificates"
                : "Hover the exposed edge to preview · click or tap to select"}
            </p>
          </>
        )}
      </div>

      <div className="virtual-experience-card">
        <div className="credentials-archive-divider">
          <span>VIRTUAL EXPERIENCE</span>
          <span>FORAGE / JOB SIMULATIONS</span>
        </div>
        <div className="virtual-experience-list">
          {virtualExperiences.map((item, index) => (
            <article
              className="virtual-experience-row"
              key={item.title + "-" + index}
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
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

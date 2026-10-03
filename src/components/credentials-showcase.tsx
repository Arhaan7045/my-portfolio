"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

type Certification = {
  title: string;
  issuer: string;
  description: string;
  certificateUrl?: string | null;
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
  const [storedActiveIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoPeekIndex, setAutoPeekIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev" | null>(null);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const pointerSwipeTriggered = useRef(false);
  const reducedMotion = useReducedMotion();
  const credentialCount = formalCertifications.length;
  const activeIndex =
    credentialCount === 0
      ? 0
      : Math.min(storedActiveIndex, credentialCount - 1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);

    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    if (reducedMotion || formalCertifications.length < 2) {
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
  }, [activeIndex, formalCertifications.length, reducedMotion, isMobile]);

  const peekIndex =
    hoveredIndex ??
    (reducedMotion || credentialCount < 2
      ? null
      : autoPeekIndex ?? (isMobile ? (activeIndex === 0 ? 1 : 0) : null));

  const swipeTo = (direction: "next" | "prev") => {
    if (formalCertifications.length < 2 || outgoingIndex !== null) return;

    const nextIndex =
      direction === "next" ? activeIndex + 1 : activeIndex - 1;

    if (nextIndex < 0 || nextIndex >= formalCertifications.length) return;

    setSwipeDirection(direction);
    setOutgoingIndex(activeIndex);
    setActiveIndex(nextIndex);
    setHoveredIndex(null);
    setAutoPeekIndex(null);

    window.setTimeout(() => {
      setOutgoingIndex(null);
      setSwipeDirection(null);
    }, 360);
  };

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
                onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
                  if (event.pointerType === "mouse") return;
                  pointerStart.current = {
                    x: event.clientX,
                    y: event.clientY,
                  };
                  pointerSwipeTriggered.current = false;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
                  const start = pointerStart.current;
                  if (!start || event.pointerType === "mouse") return;

                  const deltaX = event.clientX - start.x;
                  const deltaY = event.clientY - start.y;

                  if (
                    Math.abs(deltaX) < 10 ||
                    Math.abs(deltaX) <= Math.abs(deltaY) ||
                    pointerSwipeTriggered.current
                  ) {
                    return;
                  }

                  if (Math.abs(deltaX) >= 40) {
                    pointerSwipeTriggered.current = true;
                    swipeTo(deltaX < 0 ? "next" : "prev");
                  }
                }}
                onPointerUp={() => {
                  pointerStart.current = null;
                }}
                onPointerCancel={() => {
                  pointerStart.current = null;
                  pointerSwipeTriggered.current = false;
                }}
                onClick={() => {
                  if (pointerSwipeTriggered.current) {
                    pointerSwipeTriggered.current = false;
                    return;
                  }
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

        {formalCertifications[activeIndex]?.certificateUrl ? (
          <div className="credential-view-row">
            <span>OPEN CREDENTIAL</span>
            <a className="credential-view-link credential-view-link-selected" href={formalCertifications[activeIndex].certificateUrl!} target="_blank" rel="noopener noreferrer">
              View certificate <span aria-hidden="true">↗</span>
            </a>
          </div>
        ) : null}

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
                {item.certificateUrl ? <a className="credential-view-link credential-view-link-virtual" href={item.certificateUrl} target="_blank" rel="noopener noreferrer">View certificate ↗</a> : null}
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

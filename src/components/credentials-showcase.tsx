"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Certification = {
  title: string;
  issuer: string;
  description: string;
};

type CredentialsShowcaseProps = {
  formalCertifications: Certification[];
  virtualExperiences: Certification[];
};

const ease = [0.16, 1, 0.3, 1] as const;

export function CredentialsShowcase({
  formalCertifications,
  virtualExperiences,
}: CredentialsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const focusedIndex = hoveredIndex ?? activeIndex;

  return (
    <div className="credentials-showcase reveal">
      <div className="credential-deck-wrap">
        <div className="credential-deck-label">
          <span>01 / FORMAL CREDENTIALS</span>
          <span>ARCHIVE / {String(formalCertifications.length).padStart(2, "0")}</span>
        </div>

        <div
          className="credential-deck"
          aria-label="Formal certifications"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {formalCertifications.map((certification, index) => {
            const isFocused = focusedIndex === index;
            const isBehind = index !== focusedIndex;

            let x = 0;
            let rotate = 0;
            let scale = 1;
            let y = 0;

            if (formalCertifications.length > 1) {
              if (index === focusedIndex) {
                x = 0;
                rotate = 0;
                scale = 1;
                y = -4;
              } else if (index < focusedIndex) {
                x = -30 - (focusedIndex - index) * 5;
                rotate = -4 - (focusedIndex - index) * 1.5;
                scale = 0.96;
                y = 12 + (focusedIndex - index) * 4;
              } else {
                x = 30 + (index - focusedIndex) * 5;
                rotate = 4 + (index - focusedIndex) * 1.5;
                scale = 0.96;
                y = 12 + (index - focusedIndex) * 4;
              }
            }

            return (
              <motion.button
                type="button"
                key={certification.title + "-" + index}
                className={`credential-deck-card credential-deck-card-${index}${isFocused ? " is-focused" : ""}`}
                style={{ zIndex: isFocused ? 20 : 10 - index }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                animate={{ x: `${x}%`, y, rotate, scale }}
                transition={{
                  opacity: { duration: 0.45, delay: index * 0.08, ease },
                  x: { duration: 0.65, ease },
                  y: { duration: 0.65, ease },
                  rotate: { duration: 0.65, ease },
                  scale: { duration: 0.65, ease },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => setActiveIndex(index)}
                aria-pressed={activeIndex === index}
              >
                <span className="credential-deck-top">
                  <span>FORMAL CREDENTIAL</span>
                  <span>0{index + 1}</span>
                </span>

                <span className="credential-deck-core">
                  <span className="credential-deck-mark" aria-hidden="true">
                    ✦
                  </span>
                  <span>
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
                  <span>VERIFIED LEARNING</span>
                  <span>{isFocused ? "ACTIVE" : "VIEW"}</span>
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

        <p className="credential-deck-hint">
          Hover or select a credential to browse the archive.
        </p>
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
              <span className="virtual-experience-index">0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="virtual-experience-platform">{item.issuer}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

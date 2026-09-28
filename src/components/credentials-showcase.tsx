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

const ease = [0.22, 1, 0.36, 1] as const;

export function CredentialsShowcase({
  formalCertifications,
  virtualExperiences,
}: CredentialsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="credentials-showcase reveal">
      <div className="credential-deck-wrap">
        <div className="credential-deck-label">
          <span>01 / FORMAL CREDENTIALS</span>
          <span>ARCHIVE / {String(formalCertifications.length).padStart(2, "0")}</span>
        </div>

        <div className="credential-deck" aria-label="Formal certifications">
          {formalCertifications.map((certification, index) => {
            const isActive = activeIndex === index;
            const offset = index - activeIndex;

            return (
              <motion.button
                type="button"
                key={certification.title + "-" + index}
                className={`credential-deck-card${isActive ? " is-active" : ""}`}
                style={{ zIndex: isActive ? 20 : 10 - Math.abs(offset) }}
                animate={{
                  x: isActive ? 0 : offset > 0 ? 34 : -34,
                  y: isActive ? 0 : 14 + Math.abs(offset) * 5,
                  rotate: isActive ? 0 : offset > 0 ? 2.4 : -2.4,
                  scale: isActive ? 1 : 0.965,
                }}
                transition={{ duration: 0.52, ease }}
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
              >
                <span className="credential-deck-top">
                  <span>FORMAL CREDENTIAL</span>
                  <span>0{index + 1}</span>
                </span>

                <span className="credential-deck-core">
                  <span className="credential-deck-mark" aria-hidden="true">✦</span>
                  <span>
                    <span className="credential-deck-issuer">{certification.issuer}</span>
                    <span className="credential-deck-title">{certification.title}</span>
                    <span className="credential-deck-description">{certification.description}</span>
                  </span>
                </span>

                <span className="credential-deck-bottom">
                  <span>{isActive ? "SELECTED CREDENTIAL" : "ARCHIVED CREDENTIAL"}</span>
                  <span>{isActive ? "ACTIVE" : "OPEN"}</span>
                </span>
              </motion.button>
            );
          })}

          {formalCertifications.length === 0 && (
            <div className="credential-deck-empty">No formal credentials published yet.</div>
          )}
        </div>

        {formalCertifications.length > 1 && (
          <p className="credential-deck-hint">Click or tap a credential to bring it forward.</p>
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
              transition={{ duration: 0.45, delay: index * 0.06, ease }}
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

"use client";

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
  return (
    <div className="credentials-showcase reveal">
      <div className="credential-deck-wrap">
        <div className="credential-deck-label">
          <span>01 / FORMAL CREDENTIALS</span>
          <span>ARCHIVE / {String(formalCertifications.length).padStart(2, "0")}</span>
        </div>

        <div className="credential-deck" aria-label="Formal certifications">
          {formalCertifications.map((certification, index) => (
            <motion.article
              key={certification.title + "-" + index}
              className={`credential-deck-card credential-deck-card-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease }}
            >
              <div className="credential-deck-top">
                <span>FORMAL CREDENTIAL</span>
                <span>0{index + 1}</span>
              </div>

              <div className="credential-deck-core">
                <span className="credential-deck-mark" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <span className="credential-deck-issuer">{certification.issuer}</span>
                  <h3>{certification.title}</h3>
                  <p>{certification.description}</p>
                </div>
              </div>

              <div className="credential-deck-bottom">
                <span>VERIFIED LEARNING</span>
                <span>↗</span>
              </div>
            </motion.article>
          ))}

          {formalCertifications.length === 0 && (
            <div className="credential-deck-empty">
              No formal credentials published yet.
            </div>
          )}
        </div>

        <p className="credential-deck-hint">
          Hover to browse the credential archive.
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
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
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

"use client";

import { motion, useReducedMotion } from "motion/react";

export type ExperienceItem = {
  period: string;
  title: string;
  organization: string;
  description: string;
};

export function ExperienceShowcase({ items }: { items: ExperienceItem[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section shell experience-field-section" id="experience" aria-labelledby="experience-title">
      <motion.div
        className="experience-field-intro"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="eyebrow">EXPERIENCE</p>
          <h2 id="experience-title">Experience in <span>cybersecurity.</span></h2>
        </div>
        <p className="experience-field-note">
          Internships and practical experience that are helping me build my skills.
        </p>
      </motion.div>

      <div className="experience-field-list">
        {items.map((item, index) => (
          <article
            className={`experience-field-entry ${index === 0 ? "experience-field-entry-featured" : ""}`}
            key={item.period + "-" + item.title}
          >
            <div className="experience-field-date">{item.period}</div>
            <div className="experience-field-content">
              <div className="experience-field-heading">
                <div className="experience-field-title-group">
                  <p className="experience-field-type">{index === 0 ? "CURRENT ROLE" : "EXPERIENCE"}</p>
                  <h3>{item.title}</h3>
                  <p className="experience-field-organization">{item.organization}</p>
                </div>
              </div>
              <p className="experience-field-description">{item.description}</p>
            </div>
            <div className="experience-field-rail" aria-hidden="true">
              <span className="experience-field-number">{String(index + 1).padStart(2, "0")}</span>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p className="experience-field-empty">Experience entries will appear here as they are published.</p>
        )}
      </div>
      <div className="experience-field-endnote" aria-hidden="true">
        <span /> LEARN · PRACTISE · IMPROVE
      </div>
    </section>
  );
}

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
          <p className="eyebrow">EXPERIENCE / FIELD RECORD</p>
          <h2 id="experience-title">Where learning meets <span>real-world practice.</span></h2>
        </div>
        <p className="experience-field-note">
          A record of the roles, responsibilities, and hands-on exposure shaping my cybersecurity journey.
        </p>
      </motion.div>

      <div className="experience-field-list">
        {items.map((item, index) => (
          <motion.article
            className={`experience-field-entry ${index === 0 ? "experience-field-entry-featured" : ""}`}
            key={item.period + "-" + item.title}
            initial={reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: reduceMotion ? 0 : Math.min(index * 0.1, 0.35), ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="experience-field-rail" aria-hidden="true">
              <span className="experience-field-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="experience-field-line" />
            </div>
            <div className="experience-field-date">{item.period}</div>
            <div className="experience-field-content">
              <div className="experience-field-heading">
                <div>
                  <p className="experience-field-type">{index === 0 ? "LATEST EXPERIENCE" : "FIELD EXPERIENCE"}</p>
                  <h3>{item.title}</h3>
                  <p className="experience-field-organization">{item.organization}</p>
                </div>
                <span className="experience-field-arrow" aria-hidden="true">↗</span>
              </div>
              <p className="experience-field-description">{item.description}</p>
            </div>
          </motion.article>
        ))}
        {items.length === 0 && (
          <p className="experience-field-empty">Experience entries will appear here as they are published.</p>
        )}
      </div>
      <div className="experience-field-endnote" aria-hidden="true">
        <span /> LEARNING · BUILDING · CONTRIBUTING
      </div>
    </section>
  );
}

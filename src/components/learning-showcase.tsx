"use client";

import { motion, useReducedMotion } from "motion/react";

export type LearningArea = {
  title: string;
  description: string;
};

export function LearningShowcase({ areas }: { areas: LearningArea[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section shell learning-console-section" id="learning" aria-labelledby="learning-title">
      <motion.div
        className="learning-console-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">CURRENTLY LEARNING / FIELD NOTES 02</p>
        <h2 id="learning-title">Building the mindset to <span>think like a defender.</span></h2>
      </motion.div>

      <div className="learning-console-layout">
        <motion.aside
          className="learning-console-aside"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="learning-console-orbit" aria-hidden="true">
            <motion.span
              className="learning-console-orbit-ring learning-console-orbit-ring-one"
              animate={reduceMotion ? undefined : { rotate: 332 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="learning-console-orbit-ring learning-console-orbit-ring-two"
              animate={reduceMotion ? undefined : { rotate: -317 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <span className="learning-console-orbit-core"><span>AS</span></span>
            <span className="learning-console-orbit-dot learning-console-orbit-dot-one" />
            <span className="learning-console-orbit-dot learning-console-orbit-dot-two" />
          </div>
          <p className="learning-console-kicker">THE LEARNING LOOP</p>
          <h3>Study.<br />Practice.<br /><span>Understand.</span></h3>
          <p className="learning-console-summary">
            A living record of the concepts I’m exploring and the foundations I’m strengthening on my cybersecurity path.
          </p>
          <div className="learning-console-status"><span /> OPEN KNOWLEDGE BASE <b>{String(areas.length).padStart(2, "0")} TOPICS</b></div>
        </motion.aside>

        <div className="learning-console-list" aria-label="Current learning topics">
          {areas.map((area, index) => (
            <motion.article
              className="learning-console-row"
              key={area.title + "-" + index}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : Math.min(index * 0.08, 0.32), ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="learning-console-row-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="learning-console-row-copy">
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </div>
              <span className="learning-console-row-mark" aria-hidden="true">↗</span>
            </motion.article>
          ))}
          {areas.length === 0 && (
            <p className="learning-console-empty">Learning topics will appear here as they are published.</p>
          )}
          <div className="learning-console-list-foot"><span /> PROGRESS IS BUILT ONE CONCEPT AT A TIME</div>
        </div>
      </div>
    </section>
  );
}

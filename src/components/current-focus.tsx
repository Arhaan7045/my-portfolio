"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export type FocusItem = {
  title: string;
  description: string;
};

export function CurrentFocus({ items }: { items: FocusItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 35%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div id="learning" ref={ref} className="current-focus">
      <div className="current-focus-head">
        <div>
          <span>NOW</span>
          <strong>Current focus.</strong>
        </div>
        <span>{String(items.length).padStart(2, "0")} AREAS</span>
      </div>

      <div className="current-focus-progress" aria-hidden="true">
        <motion.span style={{ scaleX: progress }} />
      </div>

      <div className="current-focus-grid">
        {items.map((item, index) => (
          <article className="current-focus-item" key={item.title + "-" + index}>
            <div className="current-focus-meta">
              <span>0{index + 1}</span>
              <span>ACTIVE</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

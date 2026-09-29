"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type ExperienceItem = {
  period: string;
  title: string;
  organization: string;
  description: string;
};

function ExperienceRow({
  item,
  index,
  active,
  onActivate,
}: {
  item: ExperienceItem;
  index: number;
  active: boolean;
  onActivate: (index: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActivate(index);
      },
      { rootMargin: "-38% 0px -42% 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [index, onActivate]);

  return (
    <article
      ref={ref}
      className={`field-log-row${active ? " is-active" : ""}`}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
    >
      <div className="field-log-index" aria-hidden="true">
        <span>0{index + 1}</span>
      </div>

      <div className="field-log-period">{item.period}</div>

      <div className="field-log-main">
        <div className="field-log-heading">
          <div>
            <span className="field-log-organization">{item.organization}</span>
            <h3>{item.title}</h3>
          </div>
          <span className="field-log-arrow" aria-hidden="true">↗</span>
        </div>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

export function ExperienceShowcase({ items }: { items: ExperienceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 72%", "end 28%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={sectionRef} className="field-log">
      <div className="field-log-topline">
        <div>
          <span>FIELD LOG</span>
          <strong>Practical experience.</strong>
        </div>
        <span>{String(items.length).padStart(2, "0")} ROLES</span>
      </div>

      <div className="field-log-body">
        <aside className="field-log-rail" aria-hidden="true">
          <div className="field-log-rail-track">
            <motion.span style={{ scaleY: progress }} />
          </div>
          <span className="field-log-current">0{activeIndex + 1}</span>
        </aside>

        <div className="field-log-list">
          {items.map((item, index) => (
            <ExperienceRow
              key={item.period + "-" + item.title}
              item={item}
              index={index}
              active={index === activeIndex}
              onActivate={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

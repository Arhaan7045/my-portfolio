"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const learningSection = document.getElementById("learning");
    if (!learningSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        threshold: 0.08,
        rootMargin: "0px 0px -18% 0px",
      },
    );

    observer.observe(learningSection);
    return () => observer.disconnect();
  }, []);

  const scrollToHero = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("page-top")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={scrollToHero}
      aria-label="Back to top"
    >
      <span>TOP</span>
      <span aria-hidden="true">↑</span>
    </button>
  );
}

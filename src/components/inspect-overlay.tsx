"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useSiteSystem } from "@/components/site-system-provider";

type AnatomyNode = {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
};

const anatomy = [
  { id: "top", label: "IDENTITY", sublabel: "NAVIGATION" },
  { id: "about", label: "CONTEXT", sublabel: "ABOUT" },
  { id: "skills", label: "CAPABILITIES", sublabel: "SKILLS" },
  { id: "projects", label: "PRACTICE", sublabel: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE", sublabel: "WORK" },
  { id: "certifications", label: "CREDENTIALS", sublabel: "CERTIFICATIONS" },
  { id: "learning", label: "DEVELOPMENT", sublabel: "LEARNING" },
  { id: "contact", label: "CONNECTION", sublabel: "CONTACT" },
] as const;

const inspectStyles = `
  .site-frame.inspect-active > :not(.inspect-overlay) {
    transition: opacity 320ms ease, filter 320ms ease, transform 320ms ease;
  }
  .site-frame.inspect-active main > .section,
  .site-frame.inspect-active main > .contact-section,
  .site-frame.inspect-active .site-header,
  .site-frame.inspect-active .footer,
  .site-frame.inspect-active .hero-copy,
  .site-frame.inspect-active .hero-visual {
    opacity: .42;
    filter: saturate(.55) brightness(.72);
  }
  .site-frame.inspect-active .hero-visual { transform: scale(.992); }
  .inspect-overlay {
    position: absolute;
    z-index: 18;
    inset: 0;
    pointer-events: none;
    overflow: visible;
    color: #d0b9ff;
  }
  .inspect-header {
    position: fixed;
    z-index: 26;
    top: 5.9rem;
    right: 1.5rem;
    left: 1.5rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    pointer-events: none;
  }
  .inspect-header > div {
    display: grid;
    gap: .2rem;
    padding: .55rem .7rem;
    border-left: 1px solid rgba(208,185,255,.55);
    background: rgba(9,8,14,.7);
    backdrop-filter: blur(10px);
  }
  .inspect-kicker, .inspect-node-sublabel, .inspect-note {
    font-family: var(--font-geist-mono), monospace;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .inspect-kicker { color: rgba(208,185,255,.7); font-size: .58rem; }
  .inspect-header strong {
    font-family: var(--font-geist-mono), monospace;
    font-size: .72rem;
    letter-spacing: .08em;
  }
  .inspect-close {
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
    gap: .7rem;
    padding: .55rem .7rem;
    color: var(--lavender);
    font-family: var(--font-geist-mono), monospace;
    font-size: .62rem;
    letter-spacing: .06em;
    pointer-events: auto;
    cursor: pointer;
  }
  .inspect-close span:last-child { font-size: 1rem; line-height: 1; }
  .inspect-architecture {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    pointer-events: none;
    overflow: visible;
  }
  .inspect-grid path {
    fill: none;
    stroke: rgba(208,185,255,.08);
    stroke-width: 1;
    stroke-dasharray: 2 10;
  }
  .inspect-route {
    fill: none;
    stroke: url(#inspect-route);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-dasharray: 3 7;
    filter: drop-shadow(0 0 5px rgba(150,108,242,.28));
  }
  .inspect-node-halo {
    fill: none;
    stroke: rgba(208,185,255,.08);
    stroke-width: 1;
    stroke-dasharray: 1 5;
  }
  .inspect-node-ring {
    fill: rgba(9,8,14,.88);
    stroke: rgba(208,185,255,.72);
    stroke-width: 1;
  }
  .inspect-node-core { fill: var(--lavender); }
  .inspect-node-crosshair { stroke: rgba(208,185,255,.38); stroke-width: .7; }
  .inspect-node-label {
    fill: var(--lavender);
    font-family: var(--font-geist-mono), monospace;
    font-size: 8px;
    letter-spacing: 1px;
  }
  .inspect-node-sublabel { fill: rgba(183,174,196,.72); font-size: 6px; }
  .inspect-core { pointer-events: none; }
  .inspect-core-ring {
    fill: none;
    stroke: rgba(208,185,255,.22);
    stroke-width: 1;
    stroke-dasharray: 2 4;
  }
  .inspect-core-inner {
    fill: rgba(150,108,242,.06);
    stroke: rgba(208,185,255,.34);
    stroke-width: 1;
  }
  .inspect-core-mark {
    fill: none;
    stroke: rgba(208,185,255,.62);
    stroke-width: 1;
  }
  .inspect-note {
    position: fixed;
    z-index: 26;
    right: 1.5rem;
    bottom: 1.25rem;
    display: inline-flex;
    align-items: center;
    gap: .55rem;
    padding: .5rem .65rem;
    border: 1px solid rgba(208,185,255,.14);
    background: rgba(9,8,14,.76);
    color: rgba(208,185,255,.62);
    font-size: .55rem;
    pointer-events: none;
    backdrop-filter: blur(10px);
  }
  .inspect-note-pip {
    width: .35rem;
    height: .35rem;
    border-radius: 50%;
    background: var(--lavender);
    box-shadow: 0 0 8px rgba(150,108,242,.7);
  }
  .inspect-note i { width: 1rem; height: 1px; background: rgba(208,185,255,.2); }
  @media (max-width: 640px) {
    .site-frame.inspect-active main > .section,
    .site-frame.inspect-active main > .contact-section,
    .site-frame.inspect-active .hero-copy,
    .site-frame.inspect-active .hero-visual,
    .site-frame.inspect-active .footer { opacity: .5; }
    .inspect-header { top: 5.25rem; right: .75rem; left: .75rem; }
    .inspect-header > div { padding: .45rem .55rem; }
    .inspect-header strong { font-size: .6rem; }
    .inspect-kicker { font-size: .5rem; }
    .inspect-close { min-height: 44px; padding-inline: .55rem; font-size: .54rem; }
    .inspect-note { right: .75rem; bottom: .75rem; max-width: calc(100vw - 1.5rem); font-size: .48rem; }
    .inspect-node-label { font-size: 6px; }
    .inspect-node-sublabel { font-size: 4.8px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .site-frame.inspect-active > :not(.inspect-overlay) { transition: none; }
  }
`;

export function InspectOverlay() {
  const { inspectActive, closeInspect } = useSiteSystem();
  const reducedMotion = useReducedMotion();
  const [nodes, setNodes] = useState<AnatomyNode[]>([]);
  const [canvas, setCanvas] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!inspectActive) return;

    const measure = () => {
      const frame = document.querySelector(".site-frame");
      if (!(frame instanceof HTMLElement)) return;

      const frameRect = frame.getBoundingClientRect();
      const width = frame.clientWidth;
      const height = Math.max(frame.scrollHeight, document.documentElement.scrollHeight);

      const next = anatomy.flatMap((item, index) => {
        const element = document.getElementById(item.id);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        const baseX = rect.left + rect.width / 2;
        const spread = Math.min(110, width * 0.22);
        const x = Math.max(28, Math.min(width - 28, baseX + (index % 2 === 0 ? -spread : spread)));
        const y = Math.max(76, rect.top + window.scrollY - frameRect.top + Math.min(64, rect.height * 0.2));
        return [{ id: item.id, label: item.label, sublabel: item.sublabel, x, y }];
      });

      setCanvas({ width, height });
      setNodes(next);
    };

    const frame = document.querySelector(".site-frame");
    const observer = frame instanceof HTMLElement && "ResizeObserver" in window
      ? new ResizeObserver(measure)
      : null;

    measure();
    window.addEventListener("resize", measure);
    observer?.observe(document.body);

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInspect();
    };
    window.addEventListener("keydown", escape);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", escape);
      observer?.disconnect();
    };
  }, [closeInspect, inspectActive]);

  const paths = useMemo(
    () =>
      nodes.slice(0, -1).map((node, index) => {
        const next = nodes[index + 1];
        const midpoint = (node.y + next.y) / 2;
        return {
          id: node.id + "-" + next.id,
          d: "M " + node.x + " " + node.y + " C " + node.x + " " + midpoint + ", " + next.x + " " + midpoint + ", " + next.x + " " + next.y,
        };
      }),
    [nodes],
  );

  if (!inspectActive || !canvas.width || !nodes.length) return null;

  return (
    <>
      <style>{inspectStyles}</style>
      <div className="inspect-overlay" aria-hidden="false">
        <div className="inspect-header">
          <div>
            <span className="inspect-kicker">INSPECT // X-RAY</span>
            <strong>PORTFOLIO ANATOMY</strong>
          </div>
          <button
            type="button"
            className="inspect-close control-surface"
            onClick={closeInspect}
            aria-label="Close portfolio inspection"
          >
            <span>CLOSE INSPECT</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <svg
          className="inspect-architecture"
          width={canvas.width}
          height={canvas.height}
          viewBox={"0 0 " + canvas.width + " " + canvas.height}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="inspect-route" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d0b9ff" stopOpacity=".2" />
              <stop offset=".5" stopColor="#966cf2" stopOpacity=".82" />
              <stop offset="1" stopColor="#d0b9ff" stopOpacity=".18" />
            </linearGradient>
            <radialGradient id="inspect-core">
              <stop stopColor="#d0b9ff" stopOpacity=".55" />
              <stop offset=".25" stopColor="#966cf2" stopOpacity=".24" />
              <stop offset="1" stopColor="#966cf2" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="inspect-grid">
            <path d={"M " + canvas.width * 0.5 + " 0 V " + canvas.height} />
            <path d={"M " + canvas.width * 0.16 + " 0 V " + canvas.height} />
            <path d={"M " + canvas.width * 0.84 + " 0 V " + canvas.height} />
          </g>

          <g className="inspect-routes">
            {paths.map((path, index) => (
              <motion.path
                key={path.id}
                d={path.d}
                pathLength={1}
                className="inspect-route"
                initial={{ pathLength: reducedMotion ? 1 : 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.8,
                  delay: reducedMotion ? 0 : index * 0.07,
                  ease: "easeOut",
                }}
              />
            ))}
          </g>

          <g className="inspect-nodes">
            {nodes.map((node, index) => (
              <g key={node.id} transform={"translate(" + node.x + " " + node.y + ")"}>
                <circle className="inspect-node-halo" r="28" />
                <circle className="inspect-node-ring" r={index === 0 ? 9 : 7} />
                <circle className="inspect-node-core" r="2.2" />
                <line className="inspect-node-crosshair" x1="-16" y1="0" x2="-11" y2="0" />
                <line className="inspect-node-crosshair" x1="11" y1="0" x2="16" y2="0" />
                <line className="inspect-node-crosshair" x1="0" y1="-16" x2="0" y2="-11" />
                <line className="inspect-node-crosshair" x1="0" y1="11" x2="0" y2="16" />
                <text className="inspect-node-label" x="13" y="-13">{node.label}</text>
                <text className="inspect-node-sublabel" x="13" y="1">{node.sublabel}</text>
              </g>
            ))}
          </g>

          {nodes[0] && (
            <g transform={"translate(" + nodes[0].x + " " + nodes[0].y + ")"} className="inspect-core">
              <circle r="58" fill="url(#inspect-core)" />
              <circle r="22" className="inspect-core-ring" />
              <circle r="14" className="inspect-core-inner" />
              <path d="M -7 0 H 7 M 0 -7 V 7" className="inspect-core-mark" />
            </g>
          )}
        </svg>

        <div className="inspect-note">
          <span className="inspect-note-pip" aria-hidden="true" />
          <span>UI SURFACE</span>
          <i aria-hidden="true" />
          <span>STRUCTURE</span>
          <i aria-hidden="true" />
          <span>SIGNAL PATH</span>
        </div>
      </div>
    </>
  );
}

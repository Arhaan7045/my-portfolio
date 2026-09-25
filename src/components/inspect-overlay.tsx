"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useSiteSystem, type InspectLayer } from "@/components/site-system-provider";

type InspectElement = {
  id: string;
  selector: string;
  label: string;
  detail: string;
  rect: { x: number; y: number; width: number; height: number };
};

const targets = [
  { id: "header", selector: "header", label: "<header>", detail: "navigation shell" },
  { id: "hero", selector: ".hero", label: "section#hero", detail: "hero composition" },
  { id: "hero-copy", selector: ".hero-copy", label: "<HeroCopy />", detail: "headline + actions" },
  { id: "headline", selector: ".hero-headline", label: "<h1>", detail: "mode headline" },
  { id: "actions", selector: ".hero-actions", label: "<HeroActions />", detail: "primary controls" },
  { id: "visual", selector: ".hero-visual", label: "<HeroVisual />", detail: "interactive SVG" },
  { id: "controls", selector: ".hero-controls", label: "<ControlGroup />", detail: "mode / inspect / system" },
  { id: "about", selector: "#about", label: "section#about", detail: "about layout" },
  { id: "skills", selector: "#skills", label: "section#skills", detail: "skills grid" },
  { id: "skill-grid", selector: ".skills-grid", label: "<SkillsGrid />", detail: "practice areas" },
  { id: "projects", selector: "#projects", label: "section#projects", detail: "project space" },
  { id: "experience", selector: "#experience", label: "section#experience", detail: "timeline" },
  { id: "certifications", selector: "#certifications", label: "section#certifications", detail: "credentials" },
  { id: "learning", selector: "#learning", label: "section#learning", detail: "learning lab" },
  { id: "contact", selector: "#contact", label: "section#contact", detail: "contact interface" },
  { id: "footer", selector: "footer", label: "<footer>", detail: "site closing layer" },
] as const;

const layerIndex: Record<InspectLayer, number> = {
  STRUCTURE: 0,
  COMPONENTS: 1,
  FLOW: 2,
  FULL: 3,
};

const styles = `
  .inspect-overlay {
    position: fixed;
    z-index: 80;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    color: #d9c9ff;
  }
  .inspect-overlay::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(150,108,242,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(150,108,242,.035) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,.75), transparent 90%);
  }
  .inspect-scan {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    top: 0;
    background: linear-gradient(90deg, transparent, rgba(208,185,255,.9), rgba(150,108,242,.95), transparent);
    box-shadow: 0 0 18px rgba(150,108,242,.7);
  }
  .inspect-hud {
    position: fixed;
    z-index: 83;
    top: 5.8rem;
    left: 1.5rem;
    display: grid;
    gap: .22rem;
    min-width: 13rem;
    padding: .65rem .75rem;
    border-left: 1px solid rgba(208,185,255,.75);
    background: rgba(7,6,11,.76);
    box-shadow: 0 12px 35px rgba(0,0,0,.24);
    backdrop-filter: blur(12px);
  }
  .inspect-kicker,
  .inspect-hud-meta,
  .inspect-tag,
  .inspect-callout,
  .inspect-measure,
  .inspect-note {
    font-family: var(--font-geist-mono), monospace;
    text-transform: uppercase;
    letter-spacing: .08em;
  }
  .inspect-kicker { font-size: .56rem; color: rgba(208,185,255,.68); }
  .inspect-hud strong { font-size: .7rem; letter-spacing: .08em; }
  .inspect-hud-meta { font-size: .52rem; color: rgba(208,185,255,.55); }
  .inspect-close {
    position: fixed;
    z-index: 83;
    top: 5.8rem;
    right: 1.5rem;
    min-height: 44px;
    padding: .55rem .7rem;
    border: 1px solid rgba(208,185,255,.25);
    background: rgba(7,6,11,.78);
    color: #d9c9ff;
    font: 500 .58rem var(--font-geist-mono), monospace;
    letter-spacing: .08em;
    pointer-events: auto;
    cursor: pointer;
  }
  .inspect-close:hover { border-color: rgba(208,185,255,.65); }
  .inspect-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .inspect-box {
    fill: rgba(150,108,242,.018);
    stroke: rgba(190,166,255,.72);
    stroke-width: 1;
    stroke-dasharray: 5 5;
    vector-effect: non-scaling-stroke;
  }
  .inspect-box-inner {
    fill: none;
    stroke: rgba(190,166,255,.18);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .inspect-corner { fill: none; stroke: rgba(220,205,255,.95); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
  .inspect-gridline { stroke: rgba(190,166,255,.12); stroke-width: 1; vector-effect: non-scaling-stroke; }
  .inspect-flow { fill: none; stroke: rgba(180,147,255,.55); stroke-width: 1; stroke-dasharray: 3 6; vector-effect: non-scaling-stroke; }
  .inspect-dot { fill: #d9c9ff; filter: drop-shadow(0 0 5px rgba(150,108,242,.9)); }
  .inspect-callout-line { stroke: rgba(208,185,255,.55); stroke-width: 1; vector-effect: non-scaling-stroke; }
  .inspect-tag {
    fill: rgba(7,6,11,.9);
    stroke: rgba(208,185,255,.32);
    stroke-width: 1;
  }
  .inspect-label {
    fill: #d9c9ff;
    font: 600 9px var(--font-geist-mono), monospace;
    letter-spacing: .7px;
  }
  .inspect-detail {
    fill: rgba(208,185,255,.55);
    font: 500 7px var(--font-geist-mono), monospace;
    letter-spacing: .45px;
  }
  .inspect-measure {
    fill: rgba(208,185,255,.5);
    font-size: 7px;
  }
  .inspect-note {
    position: fixed;
    z-index: 83;
    right: 1.5rem;
    bottom: 1.2rem;
    padding: .45rem .6rem;
    border: 1px solid rgba(208,185,255,.16);
    background: rgba(7,6,11,.75);
    color: rgba(208,185,255,.58);
    font-size: .5rem;
  }
  .inspect-crosshair { stroke: rgba(208,185,255,.3); stroke-width: 1; vector-effect: non-scaling-stroke; }
  @media (max-width: 640px) {
    .inspect-hud { top: 5.2rem; left: .75rem; min-width: 10rem; }
    .inspect-close { top: 5.2rem; right: .75rem; }
    .inspect-note { right: .75rem; bottom: .75rem; font-size: .44rem; }
    .inspect-label { font-size: 7px; }
    .inspect-detail { font-size: 5.5px; }
    .inspect-hud strong { font-size: .62rem; }
  }
`;

function viewportRect(element: Element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}

export function InspectOverlay() {
  const { inspectActive, inspectLayer, closeInspect } = useSiteSystem();
  const reducedMotion = useReducedMotion();
  const [elements, setElements] = useState<InspectElement[]>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [scan, setScan] = useState(true);

  useEffect(() => {
    if (!inspectActive) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight });
        const next = targets.flatMap((target) => {
          const element = document.querySelector(target.selector);
          if (!element) return [];
          const rect = viewportRect(element);
          const visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0 && rect.height > 0;
          if (!visible) return [];
          return [{ ...target, rect }];
        });
        setElements(next);
      });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    const timer = window.setTimeout(() => setScan(false), reducedMotion ? 0 : 850);

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInspect();
    };
    window.addEventListener("keydown", escape);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", escape);
      observer.disconnect();
      window.clearTimeout(timer);
      setScan(true);
    };
  }, [closeInspect, inspectActive, reducedMotion]);

  const flowPairs = useMemo(() => {
    const byId = new Map(elements.map((item) => [item.id, item]));
    const pairs: [InspectElement, InspectElement][] = [];
    const links = [
      ["hero-copy", "visual"],
      ["headline", "actions"],
      ["controls", "visual"],
      ["about", "skills"],
      ["skills", "projects"],
      ["projects", "experience"],
    ];
    for (const [a, b] of links) {
      const first = byId.get(a);
      const second = byId.get(b);
      if (first && second) pairs.push([first, second]);
    }
    return pairs;
  }, [elements]);

  if (!inspectActive || !viewport.width) return null;

  const showStructure = inspectLayer === "STRUCTURE" || inspectLayer === "FULL";
  const showComponents = inspectLayer === "COMPONENTS" || inspectLayer === "FULL";
  const showFlow = inspectLayer === "FLOW" || inspectLayer === "FULL";
  const visibleCount = elements.length;
  const layerNumber = String(layerIndex[inspectLayer] + 1).padStart(2, "0");

  return (
    <>
      <style>{styles}</style>
      <div className="inspect-overlay" aria-hidden="false">
        {!reducedMotion && scan && <motion.div className="inspect-scan" animate={{ top: ["0%", "100%"] }} transition={{ duration: .82, ease: "easeInOut" }} />}
        <div className="inspect-hud">
          <span className="inspect-kicker">INSPECT // X-RAY</span>
          <strong>{inspectLayer}</strong>
          <span className="inspect-hud-meta">VIEWPORT {Math.round(viewport.width)} × {Math.round(viewport.height)} · {visibleCount} ELEMENTS</span>
        </div>
        <button type="button" className="inspect-close control-surface" onClick={closeInspect}>
          CLOSE · ESC
        </button>

        <svg className="inspect-svg" viewBox={"0 0 " + viewport.width + " " + viewport.height} aria-hidden="true">
          {showStructure && (
            <g>
              <path className="inspect-gridline" d={"M " + viewport.width * .08 + " 0 V " + viewport.height} />
              <path className="inspect-gridline" d={"M " + viewport.width * .92 + " 0 V " + viewport.height} />
              <path className="inspect-gridline" d={"M 0 " + viewport.height * .5 + " H " + viewport.width} />
            </g>
          )}

          {showFlow && flowPairs.map(([a, b]) => {
            const x1 = a.rect.x + a.rect.width / 2;
            const y1 = a.rect.y + a.rect.height / 2;
            const x2 = b.rect.x + b.rect.width / 2;
            const y2 = b.rect.y + b.rect.height / 2;
            return <path key={a.id + b.id} className="inspect-flow" d={"M " + x1 + " " + y1 + " C " + ((x1 + x2) / 2) + " " + y1 + ", " + ((x1 + x2) / 2) + " " + y2 + ", " + x2 + " " + y2} />;
          })}

          {elements.map((item, index) => {
            const r = item.rect;
            const component = targetComponent(item);
            const x = Math.max(6, Math.min(viewport.width - 166, r.x + r.width + 12));
            const y = Math.max(70, Math.min(viewport.height - 58, r.y + 8));
            const callout = showComponents && component;
            const measurement = showStructure;
            return (
              <g key={item.id}>
                {showStructure && (
                  <>
                    <rect className="inspect-box" x={r.x} y={r.y} width={r.width} height={r.height} rx="2" />
                    <rect className="inspect-box-inner" x={r.x + 5} y={r.y + 5} width={Math.max(0, r.width - 10)} height={Math.max(0, r.height - 10)} rx="1" />
                    <path className="inspect-corner" d={"M " + r.x + " " + (r.y + 12) + " V " + r.y + " H " + (r.x + 12) + " M " + (r.x + r.width - 12) + " " + r.y + " H " + (r.x + r.width) + " V " + (r.y + 12) + " M " + r.x + " " + (r.y + r.height - 12) + " V " + (r.y + r.height) + " H " + (r.x + 12) + " M " + (r.x + r.width - 12) + " " + (r.y + r.height) + " H " + (r.x + r.width) + " V " + (r.y + r.height - 12)} />
                    {measurement && r.width > 140 && <text className="inspect-measure" x={r.x + r.width / 2} y={r.y - 5} textAnchor="middle">{Math.round(r.width)}PX</text>}
                  </>
                )}
                {showComponents && (
                  <>
                    <circle className="inspect-dot" cx={r.x} cy={r.y} r="2.4" />
                    {callout && (
                      <>
                        <path className="inspect-callout-line" d={"M " + (r.x + r.width) + " " + (r.y + 10) + " H " + x + " V " + (y + 18)} />
                        <rect className="inspect-tag" x={x} y={y} width="154" height="42" rx="2" />
                        <text className="inspect-label" x={x + 8} y={y + 16}>{item.label}</text>
                        <text className="inspect-detail" x={x + 8} y={y + 30}>{item.detail}</text>
                      </>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <div className="inspect-note">
          REAL DOM · LIVE GEOMETRY · LAYER {layerNumber}/04 · SCROLL TO INSPECT
        </div>
      </div>
    </>
  );
}

function targetComponent(item: InspectElement) {
  if (item.id === "header") return true;
  if (item.id === "hero") return true;
  if (item.id === "about" || item.id === "skills" || item.id === "projects" || item.id === "experience" || item.id === "certifications" || item.id === "learning" || item.id === "contact") return true;
  if (item.id === "hero-copy" || item.id === "headline" || item.id === "actions" || item.id === "visual" || item.id === "controls" || item.id === "skill-grid") return true;
  return false;
}

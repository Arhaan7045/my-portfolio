"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ControlButton } from "@/components/control-surface";
import { useSiteSystem } from "@/components/site-system-provider";

export type HeroMode = "LEARN" | "TEST" | "BUILD";
type HeroVisualProps = { mode: HeroMode; onModeCycle: () => void };

const nodes = [
  { id: "obs", x: 42, y: 56, label: "OBS" },
  { id: "rte", x: 150, y: 43, label: "RTE" },
  { id: "prb", x: 260, y: 64, label: "PRB" },
  { id: "anl", x: 145, y: 126, label: "ANL" },
  { id: "sys", x: 55, y: 192, label: "SYS" },
  { id: "bld", x: 250, y: 188, label: "BLD" },
];
const edges: [number, number][] = [[0,1],[1,2],[0,3],[1,3],[2,3],[3,4],[3,5],[4,5],[2,5]];
const highlights: Record<HeroMode, number[]> = { LEARN: [0,1], TEST: [2,3], BUILD: [4,5] };
const descriptors: Record<HeroMode, string> = { LEARN: "RECON // OBSERVE", TEST: "ASSESS // VAPT", BUILD: "SECURE // HARDEN" };

export function HeroVisual({ mode, onModeCycle }: HeroVisualProps) {
  const [trace, setTrace] = useState<"idle" | "running" | "complete">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const { systemActive, activateSystem } = useSiteSystem();
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const startTrace = () => {
    if (timer.current) clearTimeout(timer.current);
    if (trace !== "idle") { setTrace("idle"); return; }
    if (reducedMotion) {
      setTrace("complete");
      timer.current = setTimeout(() => setTrace("idle"), 1600);
    } else {
      setTrace("running");
      timer.current = setTimeout(() => {
        setTrace("complete");
        timer.current = setTimeout(() => setTrace("idle"), 1800);
      }, 1450);
    }
  };

  const active = new Set(highlights[mode]);
  return (
    <div className={`hero-visual reveal${systemActive ? " hero-system-live" : ""}`}>
      <div className="hero-visual-inner">
        <svg viewBox="0 0 300 230" className="hero-network-svg" aria-hidden="true" focusable="false">
          <defs><radialGradient id="map-light"><stop stopColor="#966cf2" stopOpacity=".11"/><stop offset="1" stopColor="#09080e" stopOpacity="0"/></radialGradient></defs>
          <rect width="300" height="230" fill="url(#map-light)" />
          <text x="10" y="15" className="map-meta">SYS. MAP // 01</text>
          <text x="290" y="15" textAnchor="end" className="map-meta map-status">{trace === "running" ? "TRACING PATH…" : trace === "complete" ? "TRACE COMPLETE" : descriptors[mode]}</text>
          {edges.map(([a,b]) => <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} className={active.has(a) && active.has(b) ? "hero-edge hero-edge-selected" : "hero-edge"} />)}
          <motion.path d="M 42 56 L 150 43 L 260 64 L 145 126 L 55 192 L 250 188" fill="none" pathLength="100" className={`trace-path trace-${trace}`} initial={false} animate={{ strokeDashoffset: trace === "running" ? -100 : trace === "complete" ? 0 : 100, opacity: trace === "idle" ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : trace === "running" ? 1.45 : .24, ease: "easeInOut" }} />
          {nodes.map((node, index) => <g key={node.id} className="map-node">
            <circle cx={node.x} cy={node.y} r={active.has(index) ? 8 : 5.5} className={active.has(index) ? "map-node-ring map-node-active" : "map-node-ring"} />
            <circle cx={node.x} cy={node.y} r={active.has(index) ? 2.5 : 1.8} className="map-node-core" />
            <text x={node.x} y={node.y + (node.y > 120 ? 18 : -12)} textAnchor="middle" className={active.has(index) ? "map-label map-label-active" : "map-label"}>{node.label}</text>
          </g>)}
        </svg>
        <div className="hero-controls" role="group" aria-label="System map controls">
          <ControlButton
            type="button"
            className="hero-btn hero-btn-mode"
            onClick={onModeCycle}
            aria-label={`Mode: ${mode}. Click to cycle mode.`}
          >
            <span className="hero-btn-pip" aria-hidden="true" />
            <span className="hero-btn-label">MODE</span>
            <span className="hero-btn-state">{mode}</span>
          </ControlButton>
          <ControlButton
            type="button"
            className={`hero-btn ${trace !== "idle" ? "hero-btn-active" : ""}`}
            onClick={startTrace}
            aria-label="Trace the connected system paths"
            aria-pressed={trace !== "idle"}
          >
            <span className={`hero-btn-pip${trace === "running" ? " hero-btn-pip-pulse" : ""}`} aria-hidden="true" />
            <span className="hero-btn-label">TRACE</span>
            {trace === "complete" && <span className="hero-btn-state">DONE</span>}
          </ControlButton>
          <ControlButton
            type="button"
            className={`hero-btn ${systemActive ? "hero-btn-active" : ""}`}
            onClick={activateSystem}
            aria-label="Activate the portfolio system"
            aria-pressed={systemActive}
          >
            <span className="hero-btn-pip" aria-hidden="true" />
            <span className="hero-btn-label">SYSTEM</span>
            {systemActive && <span className="hero-btn-state">LIVE</span>}
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

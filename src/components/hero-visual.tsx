"use client";

import { motion, useReducedMotion } from "motion/react";
import { ControlButton } from "@/components/control-surface";
import { useSiteSystem } from "@/components/site-system-provider";

export type HeroMode = "LEARN" | "TEST" | "BUILD";
type HeroVisualProps = { mode: HeroMode; onModeCycle: () => void };

const nodes = [
  { id: "obs", x: 42, y: 56, label: "OBSERVE" },
  { id: "rte", x: 150, y: 43, label: "ROUTE" },
  { id: "prb", x: 260, y: 64, label: "PROBE" },
  { id: "anl", x: 145, y: 126, label: "ANALYZE" },
  { id: "sys", x: 55, y: 192, label: "SYSTEM" },
  { id: "bld", x: 250, y: 188, label: "BUILD" },
] as const;

const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 5],
  [2, 5],
];

const modePaths: Record<HeroMode, number[][]> = {
  LEARN: [[0, 1], [1, 3]],
  TEST: [[0, 2], [2, 3], [3, 5]],
  BUILD: [[3, 4], [4, 5]],
};

const descriptors: Record<HeroMode, string> = {
  LEARN: "RECON // OBSERVE",
  TEST: "ASSESS // VAPT",
  BUILD: "SECURE // HARDEN",
};

export function HeroVisual({ mode, onModeCycle }: HeroVisualProps) {
  const reducedMotion = useReducedMotion();
  const { systemActive, activateSystem } = useSiteSystem();
  const activeNodes = new Set(modePaths[mode].flat());
  const activeEdges = new Set(modePaths[mode].map(([a, b]) => `${a}-${b}`));
  const modeTransition = {
    duration: reducedMotion ? 0 : 0.72,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div
      className={`hero-visual reveal${systemActive ? " hero-system-live" : ""}`}
      data-mode={mode.toLowerCase()}
    >
      <div className="hero-visual-inner">
        <svg
          viewBox="0 0 300 230"
          className="hero-network-svg"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="map-light">
              <stop stopColor="#966cf2" stopOpacity=".11" />
              <stop offset="1" stopColor="#09080e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="route-light" x1="0" x2="1">
              <stop stopColor="#966cf2" stopOpacity=".2" />
              <stop offset=".5" stopColor="#d0b9ff" stopOpacity=".8" />
              <stop offset="1" stopColor="#966cf2" stopOpacity=".2" />
            </linearGradient>
            <radialGradient id="core-well">
              <stop stopColor="#30233e" stopOpacity=".8" />
              <stop offset=".72" stopColor="#15111d" />
              <stop offset="1" stopColor="#09080e" />
            </radialGradient>
          </defs>

          <rect width="300" height="230" fill="url(#map-light)" />

          <g className="map-shell" aria-hidden="true">
            <rect className="map-recess" x="20" y="28" width="260" height="174" rx="2" />
            <path className="map-shell-line" d="M20 48V28h28M252 28h28v20M20 182v20h28M252 202h28v-20" />
            <path className="map-shell-detail" d="M28 78h18M28 151h18M254 78h18M254 151h18M72 28v12M228 28v12M72 202v-12M228 202v-12" />
          </g>

          <text x="10" y="15" className="map-meta">SYS. MAP // 01</text>
          <text x="290" y="15" textAnchor="end" className="map-meta map-status">
            {descriptors[mode]}
          </text>

          <g className="map-pathways" aria-hidden="true">
            {edges.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                className={activeEdges.has(`${a}-${b}`) ? "hero-edge hero-edge-selected" : "hero-edge"}
              />
            ))}
            {modePaths[mode].map(([a, b], index) => {
              const from = nodes[a];
              const to = nodes[b];
              return (
                <motion.path
                  key={`${mode}-${a}-${b}`}
                  d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  pathLength={1}
                  className="map-mode-path"
                  initial={false}
                  animate={{ pathLength: 0.78, strokeDashoffset: 0, opacity: 0.72 }}
                  transition={{ ...modeTransition, delay: reducedMotion ? 0 : index * 0.06 }}
                />
              );
            })}
          </g>

          <motion.g
            className="system-core"
            style={{ transformOrigin: "145px 126px" }}
            animate={{
              scale: mode === "LEARN" ? 1 : mode === "TEST" ? 0.96 : 1.035,
              rotate: mode === "LEARN" ? -5 : mode === "TEST" ? 0 : 5,
            }}
            transition={modeTransition}
            aria-hidden="true"
          >
            <circle className="system-core-well" cx="145" cy="126" r="18" />
            <circle className="system-core-ring" cx="145" cy="126" r="12" />
            <path className="system-core-mark" d="M139 126h12M145 120v12" />
            <circle className="system-core-pin" cx="145" cy="126" r="2.2" />
          </motion.g>

          {nodes.map((node, index) => {
            const isActive = activeNodes.has(index);
            return (
              <motion.g
                key={node.id}
                className="map-node"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0.66 }}
                transition={modeTransition}
              >
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  initial={false}
                  animate={{ r: isActive ? 8 : 5.5 }}
                  transition={modeTransition}
                  className={isActive ? "map-node-ring map-node-active" : "map-node-ring"}
                />
                <circle cx={node.x} cy={node.y} r={isActive ? 2.5 : 1.8} className="map-node-core" />
                <text
                  x={node.x}
                  y={node.y + (node.y > 120 ? 18 : -12)}
                  textAnchor="middle"
                  className={isActive ? "map-label map-label-active" : "map-label"}
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
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

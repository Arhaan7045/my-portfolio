"use client";

import { motion, useReducedMotion } from "motion/react";

type HeroVisualProps = {
  reducedMotion?: boolean | null;
};

const signals = [
  { x: 72, y: 76, label: "WEB" },
  { x: 218, y: 92, label: "NETWORK" },
  { x: 96, y: 190, label: "SYSTEM" },
  { x: 232, y: 204, label: "SECURITY" },
];

export function HeroVisual({ reducedMotion: reducedMotionProp }: HeroVisualProps) {
  const reducedMotionHook = useReducedMotion();
  const reducedMotion = reducedMotionProp ?? reducedMotionHook;

  return (
    <div className="hero-visual reveal" aria-label="Abstract security architecture">
      <div className="hero-visual-caption">
        <span>FIELD / 01</span>
        <strong>SECURITY ARCHITECTURE</strong>
      </div>

      <svg
        className="hero-architecture"
        viewBox="0 0 320 300"
        role="img"
        aria-label="Abstract architectural visualization connecting web, network, system, and security"
      >
        <defs>
          <radialGradient id="heroAtmosphere" cx="50%" cy="46%" r="62%">
            <stop offset="0%" stopColor="#966cf2" stopOpacity=".18" />
            <stop offset="52%" stopColor="#966cf2" stopOpacity=".035" />
            <stop offset="100%" stopColor="#09080e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="heroBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d0b9ff" stopOpacity=".08" />
            <stop offset="50%" stopColor="#d0b9ff" stopOpacity=".8" />
            <stop offset="100%" stopColor="#966cf2" stopOpacity=".08" />
          </linearGradient>
          <linearGradient id="heroPlane" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#241a33" stopOpacity=".92" />
            <stop offset="100%" stopColor="#100d17" stopOpacity=".35" />
          </linearGradient>
        </defs>

        <rect width="320" height="300" fill="url(#heroAtmosphere)" />

        <g className="hero-architecture-grid" aria-hidden="true">
          <path d="M30 64H290M30 118H290M30 172H290M30 226H290" />
          <path d="M74 34V260M128 34V260M182 34V260M236 34V260" />
        </g>

        <g className="hero-architecture-planes">
          <path d="M54 84L178 48L268 92L143 128Z" className="hero-plane hero-plane-back" />
          <path d="M52 150L178 112L270 154L144 192Z" className="hero-plane" />
          <path d="M54 216L178 178L268 218L143 254Z" className="hero-plane hero-plane-front" />
        </g>

        <g className="hero-architecture-frame" aria-hidden="true">
          <path d="M54 84L54 216M178 48L178 178M268 92L268 218M143 128L143 254" />
          <path d="M54 150L178 112L270 154L144 192L52 150Z" />
        </g>

        <motion.path
          className="hero-beam"
          d="M40 52L280 246"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 0.55 }
              : { pathLength: [0, 1, 1], opacity: [0, 0.72, 0] }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 4.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8 }
          }
        />

        <motion.g
          className="hero-core"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 151px" }}
        >
          <circle cx="160" cy="151" r="39" />
          <circle cx="160" cy="151" r="28" />
          <circle cx="160" cy="151" r="8" />
          <path d="M160 104V198M113 151H207" />
        </motion.g>

        {signals.map((signal, index) => (
          <g key={signal.label} className="hero-signal">
            <line x1="160" y1="151" x2={signal.x} y2={signal.y} />
            <circle cx={signal.x} cy={signal.y} r="4" />
            <text x={signal.x + (signal.x < 160 ? -10 : 10)} y={signal.y - 9}>
              {signal.label}
            </text>
            <motion.circle
              cx={signal.x}
              cy={signal.y}
              r="2"
              className="hero-signal-pulse"
              animate={
                reducedMotion
                  ? undefined
                  : { opacity: [0.25, 1, 0.25], r: [2, 4, 2] }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: index * 0.45,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>

      <div className="hero-visual-footer">
        <span>LEARN</span>
        <i aria-hidden="true" />
        <span>TEST</span>
        <i aria-hidden="true" />
        <span>BUILD</span>
      </div>
    </div>
  );
}

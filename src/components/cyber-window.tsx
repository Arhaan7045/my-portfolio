"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

type CyberWindowProps = {
  title: string;
  icon: string;
  active: boolean;
  minimized: boolean;
  maximized: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  children: ReactNode;
};

export function CyberWindow({
  title,
  icon,
  active,
  minimized,
  maximized,
  reducedMotion,
  onActivate,
  onMinimize,
  onMaximize,
  onClose,
  children,
}: CyberWindowProps) {
  return (
    <AnimatePresence>
      {!minimized ? (
        <motion.section
          key={title}
          className={[
            "cyber-app-window",
            active ? "is-active" : "",
            maximized ? "is-maximized" : "",
          ].filter(Boolean).join(" ")}
          role="dialog"
          aria-label={title}
          aria-modal="false"
          onPointerDown={onActivate}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10, scale: reducedMotion ? 1 : 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.99 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          <div className="cyber-window-header">
            <button
              type="button"
              className="cyber-window-title"
              onClick={onActivate}
              aria-label={"Activate " + title}
            >
              <span className="cyber-window-app-icon" aria-hidden="true">{icon}</span>
              <span>
                <strong>{title}</strong>
                <small>ARHAAN OS APP</small>
              </span>
            </button>
            <div className="cyber-window-controls" aria-label={title + " window controls"}>
              <button type="button" onClick={onMinimize} aria-label={"Minimize " + title}>−</button>
              <button
                type="button"
                onClick={onMaximize}
                aria-label={maximized ? "Restore " + title : "Maximize " + title}
                aria-pressed={maximized}
              >
                {maximized ? "❐" : "□"}
              </button>
              <button type="button" onClick={onClose} aria-label={"Close " + title}>×</button>
            </div>
          </div>
          <div className="cyber-window-content">{children}</div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

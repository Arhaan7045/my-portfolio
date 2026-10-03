"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const THEME_OPTIONS = [
  { id: "cyber-violet", label: "Cyber Violet" },
  { id: "obsidian-amber", label: "Obsidian Amber" },
  { id: "deep-forest", label: "Deep Forest" },
  { id: "midnight-rose", label: "Midnight Rose" },
] as const;

export type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

const STORAGE_KEY = "portfolio-theme";

function isThemeId(value: string | null): value is ThemeId {
  return THEME_OPTIONS.some((theme) => theme.id === value);
}

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

function ThemeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.2 7.4 8.7 4l3.3 3.4L15.4 4l3.4 3.4-3.4 3.4 3.4 3.4-3.4 3.4-3.4-3.4L8.7 18l-3.5-3.4 3.4-3.4Z" />
      <circle cx="12.1" cy="11.2" r="2.15" className="theme-icon-core" />
    </svg>
  );
}

export function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>("cyber-violet");
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme = isThemeId(storedTheme) ? storedTheme : "cyber-violet";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    if (mobile || !open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobile, open]);

  const selectTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setOpen(false);
  };

  if (mobile) {
    return (
      <div className="mobile-theme-switcher" aria-label="Choose color theme">
        <span className="mobile-theme-label">THEME</span>
        <div className="mobile-theme-options">
          {THEME_OPTIONS.map((option) => (
            <button
              type="button"
              className={`theme-option theme-${option.id}${option.id === theme ? " is-active" : ""}`}
              key={option.id}
              onClick={() => selectTheme(option.id)}
              aria-pressed={option.id === theme}
            >
              <span className="theme-swatch" aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-switcher" ref={switcherRef}>
      <button
        type="button"
        className={open ? "theme-trigger is-open" : "theme-trigger"}
        onClick={() => setOpen((current) => !current)}
        aria-label="Choose color theme"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="theme-icon" aria-hidden="true">
          <ThemeIcon />
        </span>
        <span className="theme-tooltip" role="tooltip">THEME</span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="theme-menu"
            role="menu"
            initial={{ opacity: 0, y: -5, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="theme-menu-heading">
              <span>APPEARANCE</span>
              <span>{theme.replace("-", " / ").toUpperCase()}</span>
            </div>
            {THEME_OPTIONS.map((option) => (
              <button
                type="button"
                className={`theme-option theme-${option.id}${option.id === theme ? " is-active" : ""}`}
                key={option.id}
                onClick={() => selectTheme(option.id)}
                aria-pressed={option.id === theme}
                role="menuitemradio"
              >
                <span className="theme-swatch" aria-hidden="true" />
                <span className="theme-option-copy">
                  <span>{option.label}</span>
                  {option.id === theme ? <small>ACTIVE</small> : null}
                </span>
                {option.id === theme ? (
                  <motion.span
                    className="theme-check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    aria-hidden="true"
                  >
                    ✓
                  </motion.span>
                ) : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

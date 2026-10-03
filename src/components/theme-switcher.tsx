"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const THEME_OPTIONS = [
  { id: "iron-man", label: "Iron Man", descriptor: "Reactor Red", themeColor: "#0a090b" },
  { id: "spider-man", label: "Spider-Man", descriptor: "Crimson Blue", themeColor: "#080a10" },
  { id: "thor", label: "Thor", descriptor: "Storm Steel", themeColor: "#080b12" },
  { id: "doctor-doom", label: "Doctor Doom", descriptor: "Latverian Green", themeColor: "#080b0a" },
] as const;

export type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

const STORAGE_KEY = "portfolio-theme";

function isThemeId(value: string | null): value is ThemeId {
  return THEME_OPTIONS.some((theme) => theme.id === value);
}

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const selectedTheme = THEME_OPTIONS.find((option) => option.id === theme);
  if (themeMeta && selectedTheme) {
    themeMeta.setAttribute("content", selectedTheme.themeColor);
  }
}

function ThemeIcon({ theme }: { theme: ThemeId }) {
  if (theme === "thor") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.8 2.8 6.7 13h5.1l-1.6 8.2L17.5 11h-5.1l1.4-8.2Z" />
      </svg>
    );
  }

  if (theme === "spider-man") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2.2" className="theme-icon-core" />
        <circle cx="12" cy="12" r="7.2" />
        <path d="M12 4.8v4M12 15.2v4M4.8 12h4M15.2 12h4M6.9 6.9l2.9 2.9M14.2 14.2l2.9 2.9M17.1 6.9l-2.9 2.9M9.8 14.2l-2.9 2.9" />
      </svg>
    );
  }

  if (theme === "doctor-doom") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3.2 6.3 3.4v7.1L12 20.8l-6.3-7.1V6.6L12 3.2Z" />
        <path d="M9.1 10.1h1.5M13.4 10.1h1.5M11.1 14.6h1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.4 18.5 7v7.5L12 18.1 5.5 14.5V7L12 3.4Z" />
      <circle cx="12" cy="10.7" r="2.2" className="theme-icon-core" />
      <path d="M12 12.9v2.4" />
    </svg>
  );
}

export function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>("iron-man");
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme = isThemeId(storedTheme) ? storedTheme : "iron-man";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  useEffect(() => {
    if (mobile || !open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
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

    if (mobile) {
      switcherRef.current?.closest("details")?.removeAttribute("open");
    }
  };

  const activeTheme = THEME_OPTIONS.find((option) => option.id === theme) ?? THEME_OPTIONS[0];

  if (mobile) {
    return (
      <div ref={switcherRef} className="mobile-theme-switcher" aria-label="Choose visual profile">
        <div className="mobile-theme-heading">
          <span>VISUAL PROFILE</span>
          <span>{activeTheme.label.toUpperCase()}</span>
        </div>

        <div className="mobile-theme-options">
          {THEME_OPTIONS.map((option) => (
            <motion.button
              type="button"
              className={`theme-option theme-${option.id}${option.id === theme ? " is-active" : ""}`}
              key={option.id}
              onClick={() => selectTheme(option.id)}
              aria-pressed={option.id === theme}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.12 }}
            >
              <span className="theme-option-topline">
                <span className="theme-option-icon" aria-hidden="true">
                  <ThemeIcon theme={option.id} />
                </span>
                <span className="theme-option-copy">
                  <span>{option.label}</span>
                  <small>{option.descriptor}</small>
                </span>
                {option.id === theme ? (
                  <span className="theme-selected-dot" aria-hidden="true" />
                ) : null}
              </span>
              <span className="theme-palette" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </motion.button>
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
        aria-label={`Choose visual profile. Current: ${activeTheme.label}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <motion.span
          className={`theme-icon theme-icon-${theme}`}
          key={theme}
          initial={{ opacity: 0, scale: 0.72, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <ThemeIcon theme={theme} />
        </motion.span>
        <span className="theme-tooltip">{activeTheme.label.toUpperCase()}</span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="theme-menu"
            role="menu"
            initial={{ opacity: 0, y: -7, scale: 0.965 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="theme-menu-heading">
              <span>VISUAL PROFILE</span>
              <span>{activeTheme.label.toUpperCase()}</span>
            </div>

            <div className="theme-grid">
              {THEME_OPTIONS.map((option, index) => (
                <motion.button
                  type="button"
                  className={`theme-option theme-${option.id}${option.id === theme ? " is-active" : ""}`}
                  key={option.id}
                  onClick={() => selectTheme(option.id)}
                  aria-pressed={option.id === theme}
                  role="menuitemradio"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.025 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <span className="theme-option-topline">
                    <span className="theme-option-icon" aria-hidden="true">
                      <ThemeIcon theme={option.id} />
                    </span>
                    <span className="theme-option-copy">
                      <span>{option.label}</span>
                      <small>{option.descriptor}</small>
                    </span>
                    {option.id === theme ? (
                      <span className="theme-selected-dot" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="theme-palette" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="theme-menu-footer">
              <span>4 PROFILES</span>
              <span>COLOR SYSTEM</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

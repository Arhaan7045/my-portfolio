"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const THEME_OPTIONS = [
  { id: "cyber-violet", label: "Cyber Violet", descriptor: "Core Profile", themeColor: "#09080e" },
  { id: "thor", label: "Thor", descriptor: "Storm Steel", themeColor: "#080b12" },
  { id: "iron-man", label: "Iron Man", descriptor: "Reactor Red", themeColor: "#0a090b" },
  { id: "doctor-doom", label: "Doctor Doom", descriptor: "Doom Green", themeColor: "#080b0a" },
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

  if (theme === "doctor-doom") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3.2 6.3 3.4v7.1L12 20.8l-6.3-7.1V6.6L12 3.2Z" />
        <path d="M9.1 10.1h1.5M13.4 10.1h1.5M11.1 14.6h1.8" />
      </svg>
    );
  }

  if (theme === "iron-man") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.4 18.4 7v7.4L12 18l-6.4-3.6V7L12 3.4Z" />
        <path d="m9.3 8.5 2.7-1.7 2.7 1.7v5.1L12 15.3l-2.7-1.7V8.5Z" />
        <path d="M12 9.3v3.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7.1" />
      <circle cx="12" cy="12" r="2" className="theme-icon-core" />
      <path d="M12 4.9v3.2M12 15.9v3.2M4.9 12h3.2M15.9 12h3.2M6.9 6.9l2.3 2.3M14.8 14.8l2.3 2.3M17.1 6.9l-2.3 2.3M9.2 14.8l-2.3 2.3" />
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

  const renderOption = (option: (typeof THEME_OPTIONS)[number], index: number, mobileMode = false) => (
    <motion.button
      type="button"
      className={`theme-option theme-${option.id}${option.id === theme ? " is-active" : ""}`}
      key={option.id}
      onClick={() => selectTheme(option.id)}
      aria-pressed={option.id === theme}
      role={mobileMode ? undefined : "menuitemradio"}
      initial={mobileMode ? undefined : { opacity: 0, y: 5 }}
      animate={mobileMode ? undefined : { opacity: 1, y: 0 }}
      transition={mobileMode ? { duration: 0.12 } : { duration: 0.18, delay: index * 0.025 }}
      whileHover={mobileMode ? undefined : { y: -2 }}
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
        {option.id === theme ? <span className="theme-selected-dot" aria-hidden="true" /> : null}
      </span>
      <span className="theme-palette" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </motion.button>
  );

  if (mobile) {
    return (
      <div ref={switcherRef} className="mobile-theme-switcher" aria-label="Choose visual profile">
        <div className="mobile-theme-heading">
          <span>VISUAL PROFILE</span>
          <span>{activeTheme.label.toUpperCase()}</span>
        </div>

        <div className="mobile-theme-options">
          {THEME_OPTIONS.map((option, index) => renderOption(option, index, true))}
        </div>

        <div className="theme-coming-soon">
          <span className="theme-coming-soon-mark">+</span>
          <span>
            <strong>MORE PROFILES</strong>
            <small>COMING SOON</small>
          </span>
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
          initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ opacity: 0, y: -7, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.985 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="theme-menu-heading">
              <span>VISUAL PROFILE</span>
              <span>{activeTheme.label.toUpperCase()}</span>
            </div>

            <div className="theme-grid">
              {THEME_OPTIONS.map((option, index) => renderOption(option, index))}
            </div>

            <div className="theme-coming-soon">
              <span className="theme-coming-soon-mark">+</span>
              <span>
                <strong>MORE PROFILES</strong>
                <small>COMING SOON</small>
              </span>
              <span className="theme-coming-soon-arrow">→</span>
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

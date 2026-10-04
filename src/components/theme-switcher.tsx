"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const THEME_OPTIONS = [
  { id: "cyber-violet", label: "Cyber Violet", descriptor: "Core Profile", category: "Core", themeColor: "#09080e", swatch: "#966cf2" },
  { id: "thor", label: "Thor", descriptor: "Storm Steel", category: "Marvel", themeColor: "#080b12", swatch: "#46699d" },
  { id: "iron-man", label: "Iron Man", descriptor: "Reactor Red", category: "Marvel", themeColor: "#0a090b", swatch: "#9e3139" },
  { id: "doctor-doom", label: "Doctor Doom", descriptor: "Doom Green", category: "Marvel", themeColor: "#080b0a", swatch: "#3e6950" },
  { id: "black-panther", label: "Black Panther", descriptor: "Vibranium Violet", category: "Marvel", themeColor: "#08080b", swatch: "#694499" },
  { id: "batman", label: "Batman", descriptor: "Shadow Blue", category: "DC", themeColor: "#08090c", swatch: "#3066aa" },
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
  if (themeMeta && selectedTheme) themeMeta.setAttribute("content", selectedTheme.themeColor);
}

function ThemeGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7.2" />
      <circle cx="12" cy="12" r="2.2" className="theme-glyph-core" />
      <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3" />
    </svg>
  );
}

function ThemeSwatch({ color }: { color: string }) {
  return (
    <span className="theme-option-swatch" aria-hidden="true">
      <i style={{ backgroundColor: color }} />
      <i />
      <i />
    </span>
  );
}

function ThemeOption({
  option,
  active,
  onSelect,
}: {
  option: (typeof THEME_OPTIONS)[number];
  active: boolean;
  onSelect: (id: ThemeId) => void;
}) {
  return (
    <button
      type="button"
      className={"theme-option" + (active ? " is-active" : "")}
      onClick={() => onSelect(option.id)}
      aria-pressed={active}
    >
      <ThemeSwatch color={option.swatch} />
      <span className="theme-option-copy">
        <strong>{option.label}</strong>
        <small>{option.descriptor}</small>
      </span>
      <span className="theme-option-tag">{option.category}</span>
      {active ? <span className="theme-selected-mark" aria-label="Selected">✓</span> : null}
    </button>
  );
}

export function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>("cyber-violet");
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const next = isThemeId(stored) ? stored : "cyber-violet";
    setTheme(next);
    applyTheme(next);
  }, []);

  useEffect(() => {
    if (mobile || !open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setOpen(false);
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
    if (mobile) switcherRef.current?.closest("details")?.removeAttribute("open");
  };

  const activeTheme = THEME_OPTIONS.find((option) => option.id === theme) ?? THEME_OPTIONS[0];
  const options = (
    <div className="theme-options-list">
      {THEME_OPTIONS.map((option) => (
        <ThemeOption key={option.id} option={option} active={option.id === theme} onSelect={selectTheme} />
      ))}
    </div>
  );

  if (mobile) {
    return (
      <div ref={switcherRef} className="mobile-theme-switcher" aria-label="Choose visual profile">
        <div className="mobile-theme-heading">
          <span>VISUAL PROFILE</span>
          <strong>{activeTheme.label}</strong>
        </div>
        {options}
      </div>
    );
  }

  return (
    <div className="theme-switcher" ref={switcherRef}>
      <button
        type="button"
        className={"theme-trigger" + (open ? " is-open" : "")}
        onClick={() => setOpen((value) => !value)}
        aria-label={"Choose visual profile. Current: " + activeTheme.label}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <motion.span
          className="theme-trigger-icon"
          animate={open ? { rotate: 45, scale: 1.02 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
          aria-hidden="true"
        >
          <ThemeGlyph />
        </motion.span>
        <span className="theme-trigger-label">{activeTheme.label}</span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="theme-menu"
            role="dialog"
            aria-label="Visual profile selector"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            <div className="theme-menu-heading">
              <div>
                <span>VISUAL PROFILE</span>
                <strong>{activeTheme.label}</strong>
              </div>
              <span className="theme-menu-current-dot" aria-hidden="true" />
            </div>
            {options}
            <div className="theme-menu-footer">
              <span>6 PROFILES</span>
              <span>SAVED LOCALLY</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

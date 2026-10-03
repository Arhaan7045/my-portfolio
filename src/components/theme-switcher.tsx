"use client";

import { useEffect, useState } from "react";

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
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="9" cy="9" r="1.15" className="theme-icon-dot" />
      <circle cx="14.5" cy="8" r="1.15" className="theme-icon-dot" />
      <circle cx="16" cy="13" r="1.15" className="theme-icon-dot" />
      <path d="M7.1 15.2c1.1 1.55 2.78 2.55 4.9 2.8" />
    </svg>
  );
}

export function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>("cyber-violet");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme = isThemeId(storedTheme) ? storedTheme : "cyber-violet";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const selectTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
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
    <details className="theme-switcher">
      <summary aria-label="Choose color theme">
        <span className="theme-icon" aria-hidden="true">
          <ThemeIcon />
        </span>
        <span className="theme-tooltip" role="tooltip">THEME</span>
      </summary>
      <div className="theme-menu">
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
    </details>
  );
}

"use client";

import { useEffect, useState } from "react";

export const THEME_OPTIONS = [
  { id: "cyber-violet", label: "Cyber Violet" },
  { id: "signal-blue", label: "Signal Blue" },
  { id: "mono-carbon", label: "Mono Carbon" },
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

export function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>("cyber-violet");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme = isThemeId(storedTheme) ? storedTheme : "cyber-violet";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  if (mobile) {
    return (
      <div className="mobile-theme-switcher" aria-label="Choose color theme">
        <span className="mobile-theme-label">THEME</span>
        <div className="mobile-theme-options">
          {THEME_OPTIONS.map((option) => (
            <button
              type="button"
              className={option.id === theme ? "theme-option is-active" : "theme-option"}
              key={option.id}
              onClick={() => {
                setTheme(option.id);
                applyTheme(option.id);
              }}
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
        <span>THEME</span>
        <span className="theme-current-swatch" aria-hidden="true" />
      </summary>
      <div className="theme-menu">
        {THEME_OPTIONS.map((option) => (
          <button
            type="button"
            className={option.id === theme ? "theme-option is-active" : "theme-option"}
            key={option.id}
            onClick={() => {
              setTheme(option.id);
              applyTheme(option.id);
            }}
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

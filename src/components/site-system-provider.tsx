"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type SiteSystemContextValue = { systemActive: boolean; activateSystem: () => void };
const SiteSystemContext = createContext<SiteSystemContextValue | null>(null);

export function useSiteSystem() {
  const value = useContext(SiteSystemContext);
  if (!value) throw new Error("useSiteSystem must be used within SiteSystemProvider");
  return value;
}

export function SiteSystemProvider({ children }: { children: React.ReactNode }) {
  const [systemActive, setSystemActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activateSystem = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSystemActive(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => setSystemActive(false), reduced ? 1600 : 4200);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <SiteSystemContext.Provider value={{ systemActive, activateSystem }}>
      <div id="top" className={`site-frame${systemActive ? " system-active" : ""}`}>
        {children}
        {systemActive && <div className="system-status" role="status" aria-live="polite"><span className="system-status-pip" aria-hidden="true" />SYSTEM LIVE</div>}
      </div>
    </SiteSystemContext.Provider>
  );
}

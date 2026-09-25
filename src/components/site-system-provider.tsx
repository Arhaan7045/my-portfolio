"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SystemExperience } from "@/components/system-experience";

type SiteSystemContextValue = {
  systemActive: boolean;
  activateSystem: () => void;
  closeSystem: () => void;
};

const SiteSystemContext = createContext<SiteSystemContextValue | null>(null);

export function useSiteSystem() {
  const value = useContext(SiteSystemContext);
  if (!value) throw new Error("useSiteSystem must be used within SiteSystemProvider");
  return value;
}

export function SiteSystemProvider({ children }: { children: React.ReactNode }) {
  const [systemActive, setSystemActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeSystem = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSystemActive(false);
  }, []);

  const activateSystem = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSystemActive(false);
    window.requestAnimationFrame(() => setSystemActive(true));
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <SiteSystemContext.Provider value={{ systemActive, activateSystem, closeSystem }}>
      <div id="top" className={`site-frame${systemActive ? " system-active" : ""}`}>
        {children}
        <SystemExperience />
      </div>
    </SiteSystemContext.Provider>
  );
}

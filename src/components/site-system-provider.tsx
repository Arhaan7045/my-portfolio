"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { InspectOverlay } from "@/components/inspect-overlay";

export type InspectLayer = "STRUCTURE" | "COMPONENTS" | "FLOW" | "FULL";

type SiteSystemContextValue = {
  systemActive: boolean;
  inspectActive: boolean;
  inspectLayer: InspectLayer;
  activateSystem: () => void;
  toggleInspect: () => void;
  cycleInspectLayer: () => void;
  closeInspect: () => void;
};

const SiteSystemContext = createContext<SiteSystemContextValue | null>(null);

export function useSiteSystem() {
  const value = useContext(SiteSystemContext);
  if (!value) throw new Error("useSiteSystem must be used within SiteSystemProvider");
  return value;
}

const inspectLayers: InspectLayer[] = ["STRUCTURE", "COMPONENTS", "FLOW", "FULL"];

export function SiteSystemProvider({ children }: { children: React.ReactNode }) {
  const [systemActive, setSystemActive] = useState(false);
  const [inspectActive, setInspectActive] = useState(false);
  const [inspectLayer, setInspectLayer] = useState<InspectLayer>("FULL");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activateSystem = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setInspectActive(false);
    setSystemActive(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => setSystemActive(false), reduced ? 1600 : 4200);
  }, []);

  const toggleInspect = useCallback(() => {
    setSystemActive(false);
    setInspectActive((current) => {
      if (!current) setInspectLayer("FULL");
      return !current;
    });
  }, []);

  const cycleInspectLayer = useCallback(() => {
    setSystemActive(false);
    setInspectActive(true);
    setInspectLayer((current) => inspectLayers[(inspectLayers.indexOf(current) + 1) % inspectLayers.length]);
  }, []);

  const closeInspect = useCallback(() => setInspectActive(false), []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <SiteSystemContext.Provider
      value={{
        systemActive,
        inspectActive,
        inspectLayer,
        activateSystem,
        toggleInspect,
        cycleInspectLayer,
        closeInspect,
      }}
    >
      <div
        id="top"
        className={"site-frame" + (systemActive ? " system-active" : "") + (inspectActive ? " inspect-active" : "")}
      >
        {children}
        {systemActive && (
          <div className="system-status" role="status" aria-live="polite">
            <span className="system-status-pip" aria-hidden="true" />
            SYSTEM LIVE
          </div>
        )}
        <InspectOverlay />
      </div>
    </SiteSystemContext.Provider>
  );
}

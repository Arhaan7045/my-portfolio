import { useEffect, useState } from "react";

export function useCyberHardwareInput() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(() => new Set());
  const [activeMouseButtons, setActiveMouseButtons] = useState<Set<number>>(() => new Set());
  const [wheelPulse, setWheelPulse] = useState(false);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      setActiveKeys((current) => {
        if (current.has(event.code)) return current;
        const next = new Set(current);
        next.add(event.code);
        return next;
      });
    };

    const keyUp = (event: KeyboardEvent) => {
      setActiveKeys((current) => {
        if (!current.has(event.code)) return current;
        const next = new Set(current);
        next.delete(event.code);
        return next;
      });
    };

    const clearKeys = () => setActiveKeys(new Set());

    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (event.button !== 0 && event.button !== 2) return;
      setActiveMouseButtons((current) => {
        const next = new Set(current);
        next.add(event.button);
        return next;
      });
    };

    const pointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (event.button !== 0 && event.button !== 2) return;
      setActiveMouseButtons((current) => {
        const next = new Set(current);
        next.delete(event.button);
        return next;
      });
    };

    let wheelTimer: number | null = null;
    const wheel = (event: WheelEvent) => {
      if (event.deltaY === 0 && event.deltaX === 0) return;
      setWheelPulse(true);
      if (wheelTimer !== null) window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => setWheelPulse(false), 130);
    };

    window.addEventListener("keydown", keyDown, true);
    window.addEventListener("keyup", keyUp, true);
    window.addEventListener("blur", clearKeys);
    window.addEventListener("pointerdown", pointerDown, true);
    window.addEventListener("pointerup", pointerUp, true);
    window.addEventListener("pointercancel", pointerUp, true);
    window.addEventListener("wheel", wheel, { passive: true });
    document.addEventListener("visibilitychange", clearKeys);

    return () => {
      window.removeEventListener("keydown", keyDown, true);
      window.removeEventListener("keyup", keyUp, true);
      window.removeEventListener("blur", clearKeys);
      window.removeEventListener("pointerdown", pointerDown, true);
      window.removeEventListener("pointerup", pointerUp, true);
      window.removeEventListener("pointercancel", pointerUp, true);
      window.removeEventListener("wheel", wheel);
      document.removeEventListener("visibilitychange", clearKeys);
      if (wheelTimer !== null) window.clearTimeout(wheelTimer);
    };
  }, []);

  return { activeKeys, activeMouseButtons, wheelPulse };
}

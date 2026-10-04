"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CyberWindow } from "@/components/cyber-window";
import {
  APP_META,
  CASE_CLUES,
  CYBER_DESK_STORAGE_KEY,
  CYBER_DESK_THEMES,
  DEFAULT_VIRTUAL_ENTRIES,
  KEYBOARD_ROWS,
  SECURITY_CHALLENGES,
  currentTime,
  makeVisitorCode,
  type AppId,
  type CyberDeskThemeId,
  type VirtualEntry,
} from "@/components/cyber-desk-config";
import { useCyberHardwareInput } from "@/components/cyber-desk-input";

type NotificationItem = { id: string; message: string; time: string };
type ActivityItem = { id: string; label: string; time: string };
type SavedDeskState = {
  visitorCode?: string;
  theme?: CyberDeskThemeId;
  solved?: boolean;
  labCompletedIds?: string[];
  entries?: unknown;
  files?: unknown;
  activeFile?: string;
  currentFolder?: string;
  recentFiles?: string[];
  activity?: ActivityItem[];
  terminalLines?: string[];
  terminalHistory?: string[];
  cwd?: string;
};
type NewEntryKind = "file" | "folder";

function normaliseEntries(value: unknown): VirtualEntry[] {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_VIRTUAL_ENTRIES;
  return value.map((raw, index) => {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Partial<VirtualEntry> & { name?: unknown; content?: unknown; type?: unknown };
    if (typeof item.name !== "string" || (item.type !== "file" && item.type !== "folder")) return null;
    return {
      id: typeof item.id === "string" ? item.id : "legacy-" + index + "-" + item.name,
      name: item.name,
      type: item.type,
      path: typeof item.path === "string" ? item.path : "/",
      content: typeof item.content === "string" ? item.content : "",
      created: Boolean(item.created),
    };
  }).filter((item): item is VirtualEntry => Boolean(item));
}

function legacyEntries(value: unknown): VirtualEntry[] {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_VIRTUAL_ENTRIES;
  return value.map((raw, index) => {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as { name?: unknown; content?: unknown; type?: unknown };
    if (typeof item.name !== "string" || (item.type !== "file" && item.type !== "folder")) return null;
    return {
      id: "legacy-" + index + "-" + item.name,
      name: item.name,
      type: item.type,
      path: "/",
      content: typeof item.content === "string" ? item.content : "",
    };
  }).filter((item): item is VirtualEntry => Boolean(item));
}

function safeTheme(value: unknown): CyberDeskThemeId {
  return CYBER_DESK_THEMES.some((theme) => theme.id === value)
    ? (value as CyberDeskThemeId)
    : "graphite";
}

function trimHistory(items: string[]) {
  return items.slice(-30);
}

export function CyberDesk() {
  const reducedMotion = useReducedMotion() ?? false;
  const { activeKeys, activeMouseButtons, wheelPulse } = useCyberHardwareInput();

  const [theme, setTheme] = useState<CyberDeskThemeId>("graphite");
  const [visitorCode, setVisitorCode] = useState("------");
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeApp, setActiveApp] = useState<AppId>("home");
  const [openApps, setOpenApps] = useState<AppId[]>(["home"]);
  const [minimizedApps, setMinimizedApps] = useState<AppId[]>([]);
  const [maximizedApps, setMaximizedApps] = useState<AppId[]>([]);

  const [startOpen, setStartOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [search, setSearch] = useState("");
  const [contextMenu, setContextMenu] = useState(false);

  const [powerState, setPowerState] = useState<"on" | "sleep" | "off" | "booting">("on");
  const [shutdownStage, setShutdownStage] = useState<"saving" | "secured" | null>(null);
  const [bootProgress, setBootProgress] = useState(0);
  const [clock, setClock] = useState("--:--");

  const [solved, setSolved] = useState(false);
  const [selectedClue, setSelectedClue] = useState("email");
  const [caseFeedback, setCaseFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);

  const [labIndex, setLabIndex] = useState(0);
  const [labCompletedIds, setLabCompletedIds] = useState<string[]>([]);

  const [entries, setEntries] = useState<VirtualEntry[]>(DEFAULT_VIRTUAL_ENTRIES);
  const [currentFolder, setCurrentFolder] = useState("/");
  const [activeFile, setActiveFile] = useState("file-case-notes");
  const [fileContent, setFileContent] = useState(DEFAULT_VIRTUAL_ENTRIES[5].content);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [newEntryKind, setNewEntryKind] = useState<NewEntryKind>("file");
  const [newEntryName, setNewEntryName] = useState("");

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "ARHAAN OS · SAFE TERMINAL",
    'Type "help" to see supported commands.',
    "SAFE SANDBOX — NOTHING HERE RUNS ON YOUR COMPUTER.",
  ]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [cwd, setCwd] = useState("/");

  const shutdownTimer = useRef<number | null>(null);
  const notificationTimers = useRef<number[]>([]);
  const startSearchRef = useRef<HTMLInputElement>(null);

  const activeTheme = useMemo(
    () => CYBER_DESK_THEMES.find((item) => item.id === theme) ?? CYBER_DESK_THEMES[0],
    [theme],
  );
  const cyberStyle = {
    "--cyber-accent-rgb": activeTheme.accent,
    "--cyber-accent-soft-rgb": activeTheme.accentSoft,
    "--cyber-glow-rgb": activeTheme.glow,
    "--cyber-surface": activeTheme.surface,
    "--cyber-surface-raised": activeTheme.surfaceRaised,
    "--cyber-screen": activeTheme.screen,
  } as CSSProperties & Record<`--${string}`, string>;

  const apps = APP_META;
  const activeMeta = apps.find((app) => app.id === activeApp) ?? apps[0];

  const addActivity = useCallback((label: string) => {
    setActivity((current) => [
      { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), label, time: currentTime() },
      ...current,
    ].slice(0, 8));
  }, []);

  const pushNotification = useCallback((message: string) => {
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      message,
      time: currentTime(),
    };
    setNotifications((current) => [item, ...current].slice(0, 4));
    setNotificationOpen(true);
    const timer = window.setTimeout(() => {
      setNotifications((current) => current.filter((entry) => entry.id !== item.id));
    }, 4200);
    notificationTimers.current.push(timer);
  }, []);

  useEffect(() => {
    setClock(currentTime());
    const timer = window.setInterval(() => setClock(currentTime()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CYBER_DESK_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as SavedDeskState;
        setTheme(safeTheme(data.theme));
        setVisitorCode(typeof data.visitorCode === "string" ? data.visitorCode : makeVisitorCode());
        setSolved(Boolean(data.solved));
        setLabCompletedIds(Array.isArray(data.labCompletedIds) ? data.labCompletedIds.filter((id): id is string => typeof id === "string") : []);
        setEntries(normaliseEntries(data.entries ?? legacyEntries(data.files)));
        setActiveFile(typeof data.activeFile === "string" ? data.activeFile : "file-case-notes");
        setCurrentFolder(typeof data.currentFolder === "string" ? data.currentFolder : "/");
        setRecentFiles(Array.isArray(data.recentFiles) ? data.recentFiles.filter((id): id is string => typeof id === "string") : []);
        setActivity(Array.isArray(data.activity) ? data.activity.filter((item): item is ActivityItem => Boolean(item && typeof item.label === "string" && typeof item.time === "string")).slice(0, 8) : []);
        setTerminalLines(Array.isArray(data.terminalLines) ? data.terminalLines.filter((line): line is string => typeof line === "string").slice(-80) : [
          "ARHAAN OS · SAFE TERMINAL",
          'Type "help" to see supported commands.',
          "SAFE SANDBOX — NOTHING HERE RUNS ON YOUR COMPUTER.",
        ]);
        setTerminalHistory(Array.isArray(data.terminalHistory) ? data.terminalHistory.filter((line): line is string => typeof line === "string").slice(-30) : []);
        setCwd(typeof data.cwd === "string" ? data.cwd : "/");
      } else {
        setVisitorCode(makeVisitorCode());
        addActivity("Opened Home");
      }
    } catch {
      setVisitorCode(makeVisitorCode());
      setEntries(DEFAULT_VIRTUAL_ENTRIES);
    } finally {
      setHydrated(true);
    }
  }, [addActivity]);

  useEffect(() => {
    if (!hydrated) return;
    const selected = entries.find((entry) => entry.id === activeFile && entry.type === "file");
    if (selected) setFileContent(selected.content);
  }, [activeFile, entries, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CYBER_DESK_STORAGE_KEY, JSON.stringify({
        visitorCode,
        theme,
        solved,
        labCompletedIds,
        entries,
        activeFile,
        currentFolder,
        recentFiles,
        activity,
        terminalLines: terminalLines.slice(-80),
        terminalHistory: trimHistory(terminalHistory),
        cwd,
      } satisfies SavedDeskState));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [
    hydrated,
    visitorCode,
    theme,
    solved,
    labCompletedIds,
    entries,
    activeFile,
    currentFolder,
    recentFiles,
    activity,
    terminalLines,
    terminalHistory,
    cwd,
  ]);

  useEffect(() => {
    if (powerState !== "booting") return;
    setBootProgress(0);
    const first = window.setTimeout(() => setBootProgress(1), reducedMotion ? 0 : 180);
    const second = window.setTimeout(() => setBootProgress(2), reducedMotion ? 0 : 420);
    const finish = window.setTimeout(() => {
      setPowerState("on");
      setBootProgress(3);
      addActivity("Booted the workspace");
    }, reducedMotion ? 60 : 820);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
      window.clearTimeout(finish);
    };
  }, [powerState, reducedMotion, addActivity]);

  useEffect(() => {
    return () => {
      notificationTimers.current.forEach((timer) => window.clearTimeout(timer));
      if (shutdownTimer.current !== null) window.clearTimeout(shutdownTimer.current);
    };
  }, []);

  useEffect(() => {
    if (startOpen) window.requestAnimationFrame(() => startSearchRef.current?.focus());
  }, [startOpen]);

  const closeMenus = () => {
    setStartOpen(false);
    setQuickOpen(false);
    setNotificationOpen(false);
    setContextMenu(false);
  };

  const focusApp = (app: AppId, source = "Opened") => {
    if (powerState !== "on") return;
    setOpenApps((current) => current.includes(app) ? current : [...current, app]);
    setMinimizedApps((current) => current.filter((id) => id !== app));
    setActiveApp(app);
    closeMenus();
    if (app !== "home") addActivity(source + " " + (apps.find((item) => item.id === app)?.label ?? "app"));
  };

  const toggleTaskbarApp = (app: AppId) => {
    if (!openApps.includes(app)) {
      focusApp(app);
      return;
    }
    if (minimizedApps.includes(app)) {
      setMinimizedApps((current) => current.filter((id) => id !== app));
      setActiveApp(app);
      return;
    }
    if (activeApp === app) {
      minimizeApp(app);
      return;
    }
    setActiveApp(app);
  };

  const minimizeApp = (app: AppId) => {
    setMinimizedApps((current) => current.includes(app) ? current : [...current, app]);
    setActiveApp("home");
  };

  const closeApp = (app: AppId) => {
    setOpenApps((current) => current.filter((id) => id !== app));
    setMinimizedApps((current) => current.filter((id) => id !== app));
    setMaximizedApps((current) => current.filter((id) => id !== app));
    setActiveApp((current) => current === app ? "home" : current);
  };

  const toggleMaximize = (app: AppId) => {
    setMaximizedApps((current) => current.includes(app)
      ? current.filter((id) => id !== app)
      : [...current, app]);
  };

  const selectTheme = (nextTheme: CyberDeskThemeId) => {
    setTheme(nextTheme);
    const label = CYBER_DESK_THEMES.find((item) => item.id === nextTheme)?.label ?? nextTheme;
    addActivity("Changed appearance to " + label);
    pushNotification("Appearance changed to " + label + ".");
  };

  const markFileRecent = (id: string) => {
    setRecentFiles((current) => [id, ...current.filter((item) => item !== id)].slice(0, 6));
  };

  const saveFile = () => {
    const entry = entries.find((item) => item.id === activeFile && item.type === "file");
    if (!entry) return;
    setEntries((current) => current.map((item) => item.id === activeFile ? { ...item, content: fileContent } : item));
    markFileRecent(activeFile);
    addActivity("Saved " + entry.name);
    pushNotification("File saved on this device.");
  };

  const updateFile = (value: string) => {
    setFileContent(value);
    setEntries((current) => current.map((item) => item.id === activeFile && item.type === "file" ? { ...item, content: value } : item));
  };

  const createEntry = () => {
    const cleanName = newEntryName.trim().replace(/[^a-zA-Z0-9._ -]/g, "-").replace(/\s+/g, "-");
    if (!cleanName) return;
    const name = newEntryKind === "file" && !cleanName.includes(".") ? cleanName + ".txt" : cleanName;
    const exists = entries.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.path === currentFolder);
    if (exists) return;

    const next: VirtualEntry = {
      id: "created-" + Date.now().toString(36),
      name,
      type: newEntryKind,
      path: currentFolder,
      content: "",
      created: true,
    };
    setEntries((current) => [...current, next]);
    if (next.type === "file") {
      setActiveFile(next.id);
      setFileContent("");
      markFileRecent(next.id);
    }
    setNewEntryName("");
    setNewEntryOpen(false);
    addActivity("Created " + next.name);
    pushNotification(next.type === "file" ? "New virtual file created." : "New virtual folder created.");
  };

  const deleteEntry = (entry: VirtualEntry) => {
    if (entry.name === "read-me.txt" && !entry.created) return;
    const prefix = entry.path === "/" ? "/" + entry.name + "/" : entry.path + "/" + entry.name + "/";
    setEntries((current) => current.filter((item) =>
      item.id !== entry.id && !(entry.type === "folder" && item.path.startsWith(prefix))
    ));
    if (entry.id === activeFile) {
      setActiveFile("file-case-notes");
      setFileContent(entries.find((item) => item.id === "file-case-notes")?.content ?? "");
    }
    setRecentFiles((current) => current.filter((id) => id !== entry.id));
    addActivity("Deleted " + entry.name);
    pushNotification("Virtual item deleted.");
  };

  const renameEntry = (entry: VirtualEntry) => {
    const nextName = window.prompt("Rename this virtual " + entry.type, entry.name)?.trim();
    if (!nextName || nextName === entry.name) return;
    const clean = nextName.replace(/[^a-zA-Z0-9._ -]/g, "-").replace(/\s+/g, "-");
    if (!clean || entries.some((item) => item.id !== entry.id && item.path === entry.path && item.name.toLowerCase() === clean.toLowerCase())) return;

    if (entry.type === "folder") {
      const oldPrefix = entry.path === "/" ? "/" + entry.name + "/" : entry.path + "/" + entry.name + "/";
      const newPrefix = entry.path === "/" ? "/" + clean + "/" : entry.path + "/" + clean + "/";
      setEntries((current) => current.map((item) => {
        if (item.id === entry.id) return { ...item, name: clean };
        return item.path.startsWith(oldPrefix) ? { ...item, path: newPrefix + item.path.slice(oldPrefix.length) } : item;
      }));
    } else {
      setEntries((current) => current.map((item) => item.id === entry.id ? { ...item, name: clean } : item));
    }
    addActivity("Renamed " + entry.name);
    pushNotification("Virtual item renamed.");
  };

  const enterFolder = (entry: VirtualEntry) => {
    if (entry.type !== "folder") {
      setActiveFile(entry.id);
      setFileContent(entry.content);
      markFileRecent(entry.id);
      addActivity("Opened " + entry.name);
      return;
    }
    const nextPath = entry.path === "/" ? "/" + entry.name : entry.path + "/" + entry.name;
    setCurrentFolder(nextPath);
    addActivity("Opened folder " + entry.name);
  };

  const goUpFolder = () => {
    if (currentFolder === "/") return;
    const parts = currentFolder.split("/").filter(Boolean);
    parts.pop();
    setCurrentFolder(parts.length ? "/" + parts.join("/") : "/");
  };

  const visibleEntries = entries.filter((entry) => entry.path === currentFolder);
  const selectedEntry = entries.find((entry) => entry.id === activeFile && entry.type === "file");

  const solveCase = (answer: string) => {
    if (answer === "email") {
      setSolved(true);
      setCaseFeedback("");
      addActivity("Completed Mystery Case 001");
      pushNotification("Mystery Case 001 complete — Digital Detective earned.");
    } else {
      setCaseFeedback("Not quite. Start with the earliest clue at 09:08, before the unusual sign-in.");
    }
  };

  const completeLab = (optionId: string) => {
    const challenge = SECURITY_CHALLENGES[labIndex];
    if (optionId !== challenge.answer) {
      pushNotification("Not quite. Review the clue and try again.");
      return;
    }
    if (!labCompletedIds.includes(challenge.id)) {
      setLabCompletedIds((current) => [...current, challenge.id]);
      addActivity("Completed Security Lab " + challenge.label);
      pushNotification("Challenge complete — nice catch.");
    }
  };

  const beginShutdown = () => {
    closeMenus();
    setPowerState("off");
    setShutdownStage("saving");
    addActivity("Started shutdown");
    if (shutdownTimer.current !== null) window.clearTimeout(shutdownTimer.current);
    shutdownTimer.current = window.setTimeout(() => {
      setShutdownStage("secured");
      pushNotification("Workspace secured.");
      shutdownTimer.current = window.setTimeout(() => setShutdownStage(null), 430);
    }, 420);
  };

  const sleep = () => {
    closeMenus();
    setPowerState("sleep");
    addActivity("Put workspace to sleep");
    pushNotification("Workspace paused.");
  };

  const restart = () => {
    closeMenus();
    setPowerState("booting");
    addActivity("Restarted ARHAAN OS");
  };

  const powerOn = () => {
    setPowerState("booting");
    setShutdownStage(null);
  };

  const runCommand = () => {
    const command = terminalInput.trim();
    if (!command) return;
    const [verb, ...rest] = command.split(/\s+/);
    const arg = rest.join(" ");
    const lower = verb.toLowerCase();
    let output: string[] = [];

    setTerminalHistory((current) => trimHistory([...current, command]));

    switch (lower) {
      case "help":
        output = [
          "help             show supported commands",
          "ls               list virtual files and folders",
          "pwd              show this virtual location",
          "cd <folder>      move inside the virtual workspace",
          "cat <file>       read a virtual text file",
          "open <app>       open an ARHAAN OS app",
          "case             open Mystery Cases",
          "about            open About Arhaan",
          "whoami           show the fictional visitor identity",
          "date             show the simulated session time",
          "history          show recent typed commands",
          "clear            clear this screen",
        ];
        break;
      case "ls":
        output = visibleEntries.map((entry) => entry.type === "folder" ? entry.name + "/" : entry.name);
        if (!output.length) output = ["(empty virtual folder)"];
        break;
      case "pwd":
        output = [cwd === "/" ? "/visitor/workspace" : "/visitor/workspace" + cwd];
        break;
      case "cd": {
        if (!arg || arg === "/") {
          setCwd("/");
          setCurrentFolder("/");
          output = ["Moved to /visitor/workspace"];
          break;
        }
        if (arg === "..") {
          const parts = cwd.split("/").filter(Boolean);
          parts.pop();
          const next = parts.length ? "/" + parts.join("/") : "/";
          setCwd(next);
          setCurrentFolder(next);
          output = ["Moved to /visitor/workspace" + next];
          break;
        }
        const folder = visibleEntries.find((entry) => entry.type === "folder" && entry.name.toLowerCase() === arg.toLowerCase());
        if (!folder) output = ["Folder not found. Try ls first."];
        else {
          const next = folder.path === "/" ? "/" + folder.name : folder.path + "/" + folder.name;
          setCwd(next);
          setCurrentFolder(next);
          output = ["Moved to /visitor/workspace" + next];
        }
        break;
      }
      case "cat": {
        const file = entries.find((entry) => entry.type === "file" && entry.path === cwd && entry.name.toLowerCase() === arg.toLowerCase());
        output = file ? file.content.split("\n") : ["Virtual file not found. Try ls first."];
        break;
      }
      case "case":
        focusApp("case", "Opened");
        output = ["Opening Mystery Cases…"];
        break;
      case "about":
        focusApp("about", "Opened");
        output = ["Opening About Arhaan…"];
        break;
      case "whoami":
        output = ["visitor-" + visitorCode.toLowerCase(), "fictional local sandbox session"];
        break;
      case "date":
        output = ["ARHAAN OS session time: " + currentTime()];
        break;
      case "history":
        output = terminalHistory.length ? terminalHistory.slice(-12).map((item, index) => (index + 1) + "  " + item) : ["(no previous commands)"];
        break;
      case "open": {
        const match = apps.find((app) => app.label.toLowerCase() === arg.toLowerCase() || app.id === arg.toLowerCase());
        if (!match) output = ["App not found. Try: case, files, terminal, lab, settings, system, about, projects."];
        else {
          focusApp(match.id, "Opened");
          output = ["Opening " + match.label + "…"];
        }
        break;
      }
      case "clear":
        setTerminalLines([]);
        setTerminalInput("");
        return;
      default:
        output = ["That command is not available in this safe sandbox.", 'Type "help" to see supported commands.'];
    }

    setTerminalLines((current) => [...current, "visitor@arhaan:" + (cwd === "/" ? "~" : cwd) + "$ " + command, ...output].slice(-80));
    setTerminalInput("");
  };

  const onTerminalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand();
  };

  const filteredApps = apps.filter((app) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (app.label + " " + app.hint).toLowerCase().includes(q);
  });

  const filteredFiles = search.trim()
    ? entries.filter((entry) => (entry.name + " " + entry.path).toLowerCase().includes(search.trim().toLowerCase())).slice(0, 8)
    : [];

  const openTaskbarApps = apps.filter((app) => app.id !== "home");
  const hardwareKeyClass = (code: string) => activeKeys.has(code) ? "is-pressed" : "";

  return (
    <div
      className="cyber-workstation cyber-desk-os-root reveal"
      data-cyber-theme={theme}
      style={cyberStyle}
      aria-label="ARHAAN OS fictional interactive workstation"
    >
      <div className="cyber-workstation-halo" aria-hidden="true" />
      <div className="cyber-monitor">
        <div className="cyber-monitor-top-edge">
          <span /><span /><span />
          <small>ARHAAN DISPLAY · 27" VIRTUAL</small>
        </div>

        <div className={"cyber-monitor-screen" + (powerState !== "on" && powerState !== "booting" ? " is-dark" : "")}>
          {shutdownStage ? (
            <motion.div className="cyber-shutdown-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="cyber-boot-mark">A.</div>
              <strong>ARHAAN OS</strong>
              <p>{shutdownStage === "saving" ? "Saving visitor session…" : "Workspace secured."}</p>
              <small>{shutdownStage === "saving" ? "LOCAL STATE · SAFE SANDBOX" : "See you next time."}</small>
            </motion.div>
          ) : powerState === "off" || powerState === "sleep" ? (
            <button type="button" className="cyber-standby" onClick={powerOn} aria-label="Power on Arhaan OS">
              <span className="cyber-standby-power">⏻</span>
              <strong>ARHAAN OS</strong>
              <small>{powerState === "sleep" ? "SESSION PAUSED" : "WORKSPACE SECURED"}</small>
              <em>CLICK TO POWER ON</em>
            </button>
          ) : powerState === "booting" ? (
            <div className="cyber-boot-screen">
              <div className="cyber-boot-mark">A.</div>
              <strong>ARHAAN OS</strong>
              <p>{["Initializing…", "Loading workspace…", "Security modules ready…"][Math.min(bootProgress, 2)]}</p>
              <div className="cyber-boot-track"><i style={{ width: (bootProgress + 1) * 33.33 + "%" }} /></div>
              <small>FICTIONAL LOCAL WORKSPACE</small>
            </div>
          ) : (
            <div className="cyber-os">
              <header className="cyber-os-topbar">
                <button type="button" className="cyber-os-brand" onClick={() => focusApp("home")} aria-label="Open ARHAAN OS home">
                  <span className="cyber-os-brand-mark">A.</span>
                  <span>ARHAAN OS</span>
                </button>
                <div className="cyber-os-status" aria-label="System controls">
                  <button type="button" className="cyber-top-icon-button" onClick={() => setQuickOpen((value) => !value)} aria-expanded={quickOpen} aria-label="Open quick settings" title="Quick settings">☷</button>
                  <button type="button" className="cyber-top-icon-button" onClick={() => setNotificationOpen((value) => !value)} aria-expanded={notificationOpen} aria-label="Open notifications" title="Notifications">◌{notifications.length ? <b>{notifications.length}</b> : null}</button>
                  <time aria-label="Current time">{clock}</time>
                </div>

                {quickOpen ? (
                  <div className="cyber-quick-settings" role="dialog" aria-label="Quick settings">
                    <div className="cyber-quick-heading"><span>QUICK SETTINGS</span><strong>{activeTheme.label.toUpperCase()}</strong></div>
                    <div className="cyber-quick-grid">
                      <button type="button" onClick={() => focusApp("settings")}><span>⚙</span><small>Appearance</small></button>
                      <button type="button" onClick={() => focusApp("system")}><span>◫</span><small>System info</small></button>
                      <button type="button" onClick={() => { setContextMenu(true); setQuickOpen(false); }}><span>↻</span><small>Refresh desktop</small></button>
                    </div>
                    <p>ARHAAN OS is a fictional browser sandbox. Nothing here controls your computer.</p>
                  </div>
                ) : null}

                {notificationOpen ? (
                  <div className="cyber-notification-panel" role="region" aria-label="Notifications">
                    <div className="cyber-quick-heading"><span>NOTIFICATIONS</span><button type="button" onClick={() => setNotifications([])}>CLEAR</button></div>
                    {notifications.length ? notifications.map((item) => (
                      <div className="cyber-notification-item" key={item.id}>
                        <span>●</span><div><strong>{item.message}</strong><small>{item.time}</small></div>
                        <button type="button" onClick={() => setNotifications((current) => current.filter((entry) => entry.id !== item.id))} aria-label="Dismiss notification">×</button>
                      </div>
                    )) : <p className="cyber-empty-message">No new notifications.</p>}
                  </div>
                ) : null}
              </header>

              <main
                className="cyber-os-workspace"
                onContextMenu={(event) => {
                  event.preventDefault();
                  setContextMenu((value) => !value);
                  setStartOpen(false);
                  setQuickOpen(false);
                }}
              >
                <div className="cyber-os-wallpaper" aria-hidden="true">
                  <span className="cyber-wallpaper-orb cyber-wallpaper-orb-a" />
                  <span className="cyber-wallpaper-orb cyber-wallpaper-orb-b" />
                  <span className="cyber-wallpaper-line cyber-wallpaper-line-a" />
                  <span className="cyber-wallpaper-line cyber-wallpaper-line-b" />
                  <span className="cyber-wallpaper-grid" />
                </div>

                <div className="cyber-desktop-icon-grid" aria-label="Desktop applications">
                  {openTaskbarApps.map((app) => (
                    <button
                      type="button"
                      key={app.id}
                      className={activeApp === app.id && !minimizedApps.includes(app.id) ? "cyber-desktop-icon is-active" : "cyber-desktop-icon"}
                      onClick={() => setActiveApp(app.id)}
                      onDoubleClick={() => focusApp(app.id)}
                      aria-label={"Open " + app.label}
                      title={app.hint}
                    >
                      <span className="cyber-desktop-icon-glyph" aria-hidden="true">{app.icon}</span>
                      <small>{app.id === "files" ? "Files" : app.label}</small>
                    </button>
                  ))}
                </div>

                {contextMenu ? (
                  <div className="cyber-context-menu" role="menu" aria-label="Desktop actions">
                    <button type="button" onClick={() => { setContextMenu(false); pushNotification("Desktop refreshed."); addActivity("Refreshed desktop"); }}>Refresh desktop</button>
                    <button type="button" onClick={() => { setContextMenu(false); setNewEntryKind("file"); setNewEntryOpen(true); setActiveApp("files"); setOpenApps((current) => current.includes("files") ? current : [...current, "files"]); }}>New text file</button>
                    <button type="button" onClick={() => { setContextMenu(false); setStartOpen(true); }}>Open Start menu</button>
                  </div>
                ) : null}

                <div className="cyber-window-stack" aria-label="Open ARHAAN OS windows">
                  {activeApp !== "home" && openApps.includes(activeApp) ? (
                    <CyberWindow
                      title={activeMeta.label}
                      icon={activeMeta.icon}
                      active
                      minimized={minimizedApps.includes(activeApp)}
                      maximized={maximizedApps.includes(activeApp)}
                      reducedMotion={reducedMotion}
                      onActivate={() => setActiveApp(activeApp)}
                      onMinimize={() => minimizeApp(activeApp)}
                      onMaximize={() => toggleMaximize(activeApp)}
                      onClose={() => closeApp(activeApp)}
                    >
                      {activeApp === "case" ? (
                        <div className="cyber-case-app">
                          <div className="cyber-app-title-row"><div><span className="cyber-app-kicker">MYSTERY CASES / CASE 001</span><h3>The strange sign-in</h3></div><span className={solved ? "cyber-app-badge is-done" : "cyber-app-badge"}>{solved ? "SOLVED" : "BEGINNER"}</span></div>
                          <p className="cyber-case-intro">Maya's work account was accessed unexpectedly. Inspect the timeline, then decide what most likely started the incident.</p>
                          <div className="cyber-case-layout">
                            <div className="cyber-clue-list">{CASE_CLUES.map((clue) => (
                              <button type="button" key={clue.id} className={selectedClue === clue.id ? "cyber-clue is-selected" : "cyber-clue"} onClick={() => setSelectedClue(clue.id)}>
                                <span className="cyber-clue-time">{clue.time}</span><span><strong>{clue.title}</strong><small>{clue.detail}</small></span><b>{selectedClue === clue.id ? "−" : "+"}</b>
                              </button>
                            ))}</div>
                            <aside className="cyber-clue-inspector"><span className="cyber-app-kicker">WHAT THIS TELLS YOU</span><strong>{CASE_CLUES.find((clue) => clue.id === selectedClue)?.title}</strong><p>{CASE_CLUES.find((clue) => clue.id === selectedClue)?.insight}</p></aside>
                          </div>
                          {!solved ? (
                            <div className="cyber-case-answer">
                              <span className="cyber-app-kicker">WHAT MOST LIKELY STARTED THE INCIDENT?</span>
                              <div className="cyber-case-options">
                                <button type="button" onClick={() => solveCase("email")}><b>A</b> A fake verification email</button>
                                <button type="button" onClick={() => solveCase("update")}><b>B</b> A normal computer update</button>
                                <button type="button" onClick={() => solveCase("wifi")}><b>C</b> A Wi-Fi problem</button>
                              </div>
                              <button type="button" className="cyber-hint-button" onClick={() => setShowHint((value) => !value)}>{showHint ? "HIDE HINT" : "NEED A HINT?"}</button>
                              {showHint ? <p className="cyber-case-hint">Start with the earliest time: 09:08. The first event happened before the unusual sign-in.</p> : null}
                              {caseFeedback ? <p className="cyber-case-hint">{caseFeedback}</p> : null}
                            </div>
                          ) : (
                            <div className="cyber-case-success"><span className="cyber-success-mark">✓</span><div><strong>Achievement unlocked: Digital Detective</strong><p>The fake email was the likely starting point. This fictional case teaches a simple investigation habit: build a timeline and check more than one clue before concluding.</p><button type="button" onClick={() => { setSolved(false); setCaseFeedback(""); addActivity("Replayed Mystery Case 001"); }}>PLAY AGAIN</button></div></div>
                          )}
                          <div className="cyber-window-foot"><span>FICTIONAL TRAINING SCENARIO</span><span>{solved ? "BADGE EARNED · DIGITAL DETECTIVE" : "01 / 01 · BEGINNER"}</span></div>
                        </div>
                      ) : null}

                      {activeApp === "files" ? (
                        <div className="cyber-files-app cyber-files-enhanced">
                          <aside className="cyber-file-tree">
                            <div className="cyber-file-tree-heading"><span>PLACES</span><button type="button" onClick={() => { setNewEntryKind("file"); setNewEntryOpen(true); }} aria-label="Create a virtual file">+</button></div>
                            <button type="button" className={currentFolder === "/" ? "cyber-file-location is-active" : "cyber-file-location"} onClick={() => setCurrentFolder("/")}>⌂ &nbsp; Home</button>
                            {entries.filter((entry) => entry.type === "folder" && entry.path === "/").map((folder) => (
                              <button type="button" className={currentFolder === "/" + folder.name ? "cyber-file-location is-active" : "cyber-file-location"} key={folder.id} onClick={() => setCurrentFolder("/" + folder.name)}>▰ &nbsp; {folder.name}</button>
                            ))}
                            <div className="cyber-file-tree-foot"><span>VIRTUAL STORAGE</span><strong>{entries.filter((entry) => entry.type === "file").length} files · {entries.filter((entry) => entry.type === "folder").length} folders</strong><small>Never touches your real filesystem.</small></div>
                          </aside>

                          <div className="cyber-file-explorer-main">
                            <div className="cyber-file-location-bar"><button type="button" onClick={goUpFolder} disabled={currentFolder === "/"} aria-label="Go up one folder">↑</button><span>virtual://visitor/workspace{currentFolder === "/" ? "" : currentFolder}</span><span className="cyber-file-save-state">{saved ? "SAVED" : "LOCAL"}</span></div>
                            <div className="cyber-file-toolbar">
                              <div><span className="cyber-app-kicker">FILE EXPLORER</span><strong>{currentFolder === "/" ? "Home" : currentFolder.split("/").filter(Boolean).at(-1)}</strong></div>
                              <div className="cyber-file-toolbar-actions"><button type="button" onClick={() => { setNewEntryKind("file"); setNewEntryOpen(true); }}>NEW FILE</button><button type="button" onClick={() => { setNewEntryKind("folder"); setNewEntryOpen(true); }}>NEW FOLDER</button></div>
                            </div>
                            <div className="cyber-file-grid">
                              {visibleEntries.length ? visibleEntries.map((entry) => (
                                <button type="button" key={entry.id} className={(entry.id === activeFile ? "is-active " : "") + (entry.type === "folder" ? "is-folder" : "")} onDoubleClick={() => enterFolder(entry)} onClick={() => {
                                  if (entry.type === "folder") return;
                                  setActiveFile(entry.id); setFileContent(entry.content); markFileRecent(entry.id); addActivity("Opened " + entry.name);
                                }}>
                                  <span>{entry.type === "folder" ? "▰" : "▤"}</span><strong>{entry.name}</strong><small>{entry.type === "folder" ? "Folder" : "Text file"}</small>
                                </button>
                              )) : <p className="cyber-empty-message">This virtual folder is empty.</p>}
                            </div>

                            {selectedEntry && selectedEntry.path === currentFolder ? (
                              <div className="cyber-file-editor">
                                <div className="cyber-file-editor-top"><div><span className="cyber-app-kicker">TEXT DOCUMENT · VIRTUAL</span><strong>{selectedEntry.name}</strong></div><div className="cyber-file-editor-actions"><button type="button" onClick={saveFile}>SAVE</button><button type="button" onClick={() => renameEntry(selectedEntry)}>RENAME</button>{selectedEntry.name !== "read-me.txt" ? <button type="button" onClick={() => deleteEntry(selectedEntry)}>DELETE</button> : null}</div></div>
                                <textarea value={fileContent} onChange={(event) => updateFile(event.target.value)} aria-label={"Edit " + selectedEntry.name} spellCheck />
                                <div className="cyber-file-editor-foot"><span>{fileContent.length} characters</span><span>{saved ? "✓ SAVED ON THIS DEVICE" : "SAVE PENDING"}</span><span>VIRTUAL ONLY</span></div>
                              </div>
                            ) : null}
                          </div>

                          {newEntryOpen ? (
                            <div className="cyber-modal-layer" role="dialog" aria-modal="true" aria-label="Create virtual item">
                              <div className="cyber-mini-modal">
                                <span className="cyber-app-kicker">VIRTUAL STORAGE</span><h3>Create {newEntryKind === "file" ? "a file" : "a folder"}</h3><p>Stored only inside this ARHAAN OS browser sandbox.</p>
                                <input value={newEntryName} onChange={(event) => setNewEntryName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createEntry(); if (event.key === "Escape") setNewEntryOpen(false); }} placeholder={newEntryKind === "file" ? "security-notes.txt" : "Research"} aria-label="New virtual item name" autoFocus />
                                <div className="cyber-mini-modal-actions"><button type="button" onClick={createEntry}>CREATE</button><button type="button" onClick={() => setNewEntryOpen(false)}>CANCEL</button></div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {activeApp === "terminal" ? (
                        <div className="cyber-terminal-app cyber-terminal-enhanced">
                          <div className="cyber-terminal-heading"><div><span className="cyber-app-kicker">SAFE SIMULATED SHELL</span><strong>visitor@arhaan:{cwd === "/" ? "~" : cwd}</strong></div><span>SAFE SANDBOX — NOTHING HERE RUNS ON YOUR COMPUTER.</span></div>
                          <div className="cyber-terminal-output" aria-live="polite">{terminalLines.map((line, index) => <div key={index}>{line}</div>)}</div>
                          <form className="cyber-terminal-input" onSubmit={onTerminalSubmit}><span>visitor@arhaan:{cwd === "/" ? "~" : cwd}$</span><input value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} aria-label="Safe terminal command input" autoComplete="off" spellCheck={false} /></form>
                        </div>
                      ) : null}

                      {activeApp === "lab" ? (
                        <div className="cyber-lab-app cyber-lab-enhanced">
                          <div className="cyber-app-title-row"><div><span className="cyber-app-kicker">SECURITY LAB / QUICK CHALLENGES</span><h3>{SECURITY_CHALLENGES[labIndex].title}</h3></div><span className="cyber-app-badge">{SECURITY_CHALLENGES[labIndex].label} / {SECURITY_CHALLENGES.length}</span></div>
                          <p>{SECURITY_CHALLENGES[labIndex].prompt}</p>
                          <div className="cyber-lab-options">{SECURITY_CHALLENGES[labIndex].options.map((option) => (
                            <button type="button" key={option.id} className={labCompletedIds.includes(SECURITY_CHALLENGES[labIndex].id) && option.id === SECURITY_CHALLENGES[labIndex].answer ? "is-correct" : ""} onClick={() => completeLab(option.id)}><span>{option.id.slice(0, 1).toUpperCase()}</span><strong>{option.label}</strong></button>
                          ))}</div>
                          {labCompletedIds.includes(SECURITY_CHALLENGES[labIndex].id) ? <div className="cyber-lab-feedback"><strong>Challenge complete.</strong><p>{SECURITY_CHALLENGES[labIndex].explanation}</p></div> : <p className="cyber-lab-prompt">Choose the option that best protects the user.</p>}
                          <div className="cyber-lab-footer"><button type="button" onClick={() => setLabIndex((index) => Math.max(0, index - 1))} disabled={labIndex === 0}>← PREVIOUS</button><span>{labCompletedIds.length} / {SECURITY_CHALLENGES.length} COMPLETE</span><button type="button" onClick={() => setLabIndex((index) => Math.min(SECURITY_CHALLENGES.length - 1, index + 1))} disabled={labIndex === SECURITY_CHALLENGES.length - 1}>NEXT →</button></div>
                        </div>
                      ) : null}

                      {activeApp === "about" ? (
                        <div className="cyber-about-app">
                          <div className="cyber-about-profile"><div className="cyber-about-monogram">AS</div><div><span className="cyber-app-kicker">THE PERSON BEHIND THE DESK</span><h3>Arhaan Shaikh</h3><p>Cybersecurity learner and MCA student developing practical skills through web security, VAPT, Linux, networking, and hands-on projects.</p></div></div>
                          <div className="cyber-about-grid"><div><span>FOCUS</span><strong>WEB SECURITY · VAPT</strong></div><div><span>FOUNDATIONS</span><strong>LINUX · NETWORKING</strong></div><div><span>APPROACH</span><strong>LEARN · BUILD · DOCUMENT</strong></div><div><span>CURRENT WORK</span><strong>VAPT INTERNSHIP / PORTFOLIO</strong></div></div>
                          <Link href="/#projects" onClick={() => setActiveApp("home")}>VIEW THE MAIN PORTFOLIO ↗</Link>
                        </div>
                      ) : null}

                      {activeApp === "projects" ? (
                        <div className="cyber-projects-app"><span className="cyber-app-kicker">APPROVED PORTFOLIO PROJECTS</span><h3>Selected work</h3><p>The workstation is fictional. The project link below is the real portfolio case-study page.</p>
                          <Link href="/projects/vapt-internship" onClick={() => setActiveApp("home")}><span className="cyber-project-glyph">01</span><span><strong>VAPT Internship: Web Application Security</strong><small>VAPT · Web Security · Burp Suite · Security Testing</small></span><b>↗</b></Link>
                          <Link href="/#projects" onClick={() => setActiveApp("home")}><span className="cyber-project-glyph">↗</span><span><strong>Explore all portfolio projects</strong><small>Open the main projects section</small></span><b>↗</b></Link>
                        </div>
                      ) : null}

                      {activeApp === "settings" ? (
                        <div className="cyber-settings-app"><div className="cyber-app-title-row"><div><span className="cyber-app-kicker">ARHAAN OS / SETTINGS</span><h3>Appearance</h3></div><span className="cyber-app-badge">{activeTheme.label.toUpperCase()}</span></div><p>Theme selection changes only the ARHAAN OS sandbox. The main portfolio theme remains untouched.</p>
                          <div className="cyber-theme-grid">{CYBER_DESK_THEMES.map((option) => (
                            <button type="button" key={option.id} className={option.id === theme ? "is-selected" : ""} onClick={() => selectTheme(option.id)} aria-pressed={option.id === theme} style={{ "--theme-preview": "rgb(" + option.accent + ")", "--theme-preview-bg": option.screen } as CSSProperties & Record<`--${string}`, string>}>
                              <span className="cyber-theme-swatch" /><strong>{option.label}</strong><small>{option.descriptor}</small>
                            </button>
                          ))}</div>
                          <div className="cyber-settings-panels"><div><span>SAVED PREFERENCE</span><strong>{activeTheme.label}</strong><small>Persisted in this browser sandbox.</small></div><div><span>ABOUT ARHAAN OS</span><strong>Personal fictional workstation</strong><small>A browser-based learning space for exploring security concepts.</small></div><div><span>STORAGE</span><strong>{entries.filter((entry) => entry.type === "file").length} files · {entries.filter((entry) => entry.type === "folder").length} folders</strong><small>Virtual storage only. No real disk access.</small></div><div><span>SAFETY</span><strong>Local sandbox only</strong><small>No real system, filesystem, account or command access.</small></div></div>
                        </div>
                      ) : null}

                      {activeApp === "system" ? (
                        <div className="cyber-system-app"><div className="cyber-app-title-row"><div><span className="cyber-app-kicker">ARHAAN OS / SYSTEM</span><h3>System information</h3></div><span className="cyber-app-badge">FICTIONAL</span></div>
                          <div className="cyber-system-grid"><div><span>OPERATING SYSTEM</span><strong>ARHAAN OS</strong><small>PERSONAL WORKSTATION</small></div><div><span>DISPLAY</span><strong>27" Virtual Display</strong><small>SIMULATED</small></div><div><span>WORKSPACE</span><strong>Virtual Workspace</strong><small>LOCAL SANDBOX</small></div><div><span>VISITOR</span><strong>Visitor {visitorCode}</strong><small>FICTIONAL SESSION ID</small></div><div><span>STORAGE</span><strong>{entries.filter((entry) => entry.type === "file").length} virtual files</strong><small>NO REAL DISK ACCESS</small></div><div><span>STATUS</span><strong>Safe Simulation</strong><small>NOT A REAL OS</small></div></div>
                          <div className="cyber-system-note">System information shown here is intentionally fictional and does not claim anything about the hardware running the portfolio.</div>
                        </div>
                      ) : null}
                    </CyberWindow>
                  ) : null}
                </div>

                {startOpen ? (
                  <div className="cyber-start-menu" role="dialog" aria-label="ARHAAN OS Start menu">
                    <div className="cyber-start-user"><div className="cyber-start-avatar">AS</div><div><strong>Arhaan OS</strong><small>Personal workspace</small></div><span><i /> READY</span></div>
                    <label className="cyber-start-search"><span>⌕</span><input ref={startSearchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search apps, files or actions…" aria-label="Search apps, files or actions" /></label>

                    {search ? (
                      <div className="cyber-search-results">
                        <div className="cyber-start-heading">SEARCH RESULTS</div>
                        {filteredApps.map((app) => <button type="button" key={app.id} onClick={() => focusApp(app.id, "Searched for")}><span>{app.icon}</span><strong>{app.label}</strong><small>{app.hint}</small></button>)}
                        {filteredFiles.length ? <><div className="cyber-start-heading">VIRTUAL FILES</div>{filteredFiles.map((file) => <button type="button" key={file.id} onClick={() => { setCurrentFolder(file.path); if (file.type === "file") { setActiveFile(file.id); setFileContent(file.content); markFileRecent(file.id); } focusApp("files", "Searched for"); }}><span>{file.type === "folder" ? "▰" : "▤"}</span><strong>{file.name}</strong><small>{file.path}</small></button>)}</> : null}
                        <div className="cyber-start-heading">ACTIONS</div>
                        {[["terminal", "Open safe terminal"], ["case", "Open Mystery Case 001"], ["settings", "Open appearance settings"]].filter(([, label]) => label.toLowerCase().includes(search.toLowerCase())).map(([id, label]) => <button type="button" key={id} onClick={() => focusApp(id as AppId, "Searched for")}><span>↗</span><strong>{label}</strong><small>ARHAAN OS action</small></button>)}
                        {!filteredApps.length && !filteredFiles.length ? <p className="cyber-empty-message">No results. Try “terminal”, “case”, “notes” or “settings”.</p> : null}
                      </div>
                    ) : (
                      <>
                        <div className="cyber-start-heading">PINNED APPS <span>{apps.length}</span></div>
                        <div className="cyber-start-apps">{apps.map((app) => <button type="button" key={app.id} onClick={() => focusApp(app.id)}><span>{app.icon}</span><strong>{app.label}</strong><small>{app.hint}</small></button>)}</div>
                        <div className="cyber-start-heading">RECENT</div>
                        <div className="cyber-start-recent">{activity.slice(0, 3).map((item) => <span key={item.id}><small>{item.time}</small>{item.label}</span>)}{!activity.length ? <span>No recent activity</span> : null}</div>
                      </>
                    )}

                    <div className="cyber-start-footer"><span>VISITOR {visitorCode}</span><span>{saved ? "PROGRESS SAVED" : "LOCAL WORKSPACE"}</span><button type="button" onClick={() => setPowerOpen((value) => !value)} aria-expanded={powerOpen}>⏻ POWER</button></div>
                    {powerOpen ? <div className="cyber-power-menu"><button type="button" onClick={sleep}><span>◐</span><strong>Sleep</strong><small>Pause the workspace</small></button><button type="button" onClick={restart}><span>↻</span><strong>Restart</strong><small>Boot ARHAAN OS again</small></button><button type="button" onClick={beginShutdown}><span>⏻</span><strong>Shut down</strong><small>Secure the visitor session</small></button></div> : null}
                  </div>
                ) : null}
              </main>

              <footer className="cyber-taskbar">
                <div className="cyber-taskbar-left">
                  <button type="button" className={startOpen ? "cyber-start-button is-active" : "cyber-start-button"} onClick={() => { setStartOpen((value) => !value); setPowerOpen(false); setQuickOpen(false); setNotificationOpen(false); }} aria-label="Open Start menu" aria-expanded={startOpen}><span>A.</span></button>
                  <button type="button" className="cyber-search-button" onClick={() => { setStartOpen(true); setSearch(""); setPowerOpen(false); }} aria-label="Open search">⌕ <span>Search</span></button>
                </div>
                <div className="cyber-taskbar-pinned" aria-label="Open and pinned applications">{openTaskbarApps.map((app) => <button type="button" key={app.id} className={[activeApp === app.id && !minimizedApps.includes(app.id) ? "is-active" : "", openApps.includes(app.id) ? "is-open" : "", minimizedApps.includes(app.id) ? "is-minimized" : ""].filter(Boolean).join(" ")} onClick={() => toggleTaskbarApp(app.id)} aria-label={app.label} title={app.label}><span>{app.icon}</span></button>)}</div>
                <div className="cyber-taskbar-tray"><button type="button" title="Network connected" aria-label="Network connected">⌁</button><button type="button" title="Sound on" aria-label="Sound enabled">◖</button><button type="button" title="System information" onClick={() => focusApp("system")} aria-label="Open system information">◫</button><button type="button" title="Power" onClick={() => { setStartOpen(true); setPowerOpen(true); }} aria-label="Open power menu">⏻</button><time>{clock}</time></div>
              </footer>
            </div>
          )}
        </div>

        <div className="cyber-monitor-chin"><span>ARHAAN</span><div className={"cyber-monitor-power " + (powerState === "on" ? "is-on" : "")} /><span>DISPLAY / 01</span></div>
      </div>

      <div className="cyber-desk-surface" aria-hidden="true" />

      <div className="cyber-hardware-row">
        <div className="cyber-physical-keyboard" aria-label="Physical keyboard feedback display">
          <div className="cyber-keyboard-topline"><span>ARHAAN / STUDIO</span><span>{activeKeys.size ? activeKeys.size + " KEY" + (activeKeys.size === 1 ? "" : "S") + " DOWN" : "READY"}</span></div>
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div className="cyber-key-row" key={row[0][0]}>
              {row.map(([code, label], keyIndex) => {
                let influence = 0;
                if (activeKeys.has(code)) {
                  influence = 4;
                } else {
                  for (let activeRow = 0; activeRow < KEYBOARD_ROWS.length; activeRow += 1) {
                    for (let activeIndex = 0; activeIndex < KEYBOARD_ROWS[activeRow].length; activeIndex += 1) {
                      if (!activeKeys.has(KEYBOARD_ROWS[activeRow][activeIndex][0])) continue;
                      const distance = Math.abs(rowIndex - activeRow) + Math.abs(keyIndex - activeIndex);
                      if (distance === 1) influence = Math.max(influence, 3);
                      else if (distance === 2) influence = Math.max(influence, 2);
                      else if (distance === 3) influence = Math.max(influence, 1);
                    }
                  }
                }

                const stateClass =
                  influence === 4 ? "is-pressed" :
                  influence === 3 ? "is-energy-near" :
                  influence === 2 ? "is-energy-mid" :
                  influence === 1 ? "is-energy-far" : "";

                return <span key={code} className={stateClass || hardwareKeyClass(code)}>{label}</span>;
              })}
            </div>
          ))}
          <div className="cyber-keyboard-status"><span><i /> REAL KEYBOARD EVENTS</span><span>{activeKeys.has("ShiftLeft") || activeKeys.has("ShiftRight") ? "SHIFT " : ""}{activeKeys.has("ControlLeft") || activeKeys.has("ControlRight") ? "CTRL " : ""}{activeKeys.has("AltLeft") || activeKeys.has("AltRight") ? "ALT" : ""}</span></div>
        </div>

        <div
          className={[
            "cyber-physical-mouse",
            activeMouseButtons.has(0) ? "is-left-pressed" : "",
            activeMouseButtons.has(1) ? "is-middle-pressed" : "",
            activeMouseButtons.has(2) ? "is-right-pressed" : "",
            wheelPulse ? "is-wheel-active" : "",
          ].filter(Boolean).join(" ")}
          aria-label="Physical mouse feedback display"
        >
          <span className="cyber-mouse-zone cyber-mouse-left" aria-hidden="true" />
          <span className="cyber-mouse-zone cyber-mouse-middle" aria-hidden="true">
            <span className="cyber-mouse-wheel" />
          </span>
          <span className="cyber-mouse-zone cyber-mouse-right" aria-hidden="true" />
          <span className="cyber-mouse-scroll-track" aria-hidden="true" />
          <span className="cyber-mouse-light" aria-hidden="true" />
        </div>
      </div>

      <div className="cyber-workstation-caption"><span><i /> SAFE FICTIONAL SANDBOX</span><span>{saved ? "PROGRESS SAVED ON THIS DEVICE" : "SAVING LOCAL SESSION…"}</span><span>{activeTheme.label.toUpperCase()} / VISITOR {visitorCode}</span></div>
    </div>
  );
}

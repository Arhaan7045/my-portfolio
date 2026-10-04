"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type AppId = "home" | "case" | "files" | "terminal" | "lab" | "about" | "projects";
type VirtualFile = { name: string; content: string; type: "file" | "folder" };
type SavedState = { solved?: boolean; files?: VirtualFile[]; notes?: string; visitorCode?: string; labComplete?: boolean };

const STORAGE_KEY = "arhaan-cyberdesk-v4";
const DEFAULT_FILES: VirtualFile[] = [
  { name: "Case Files", content: "", type: "folder" },
  { name: "case-notes.txt", content: "Clues I found:\n\n", type: "file" },
  { name: "ideas.txt", content: "Ideas for my next security project:\n", type: "file" },
  { name: "read-me.txt", content: "Welcome to Arhaan OS.\nEverything here is a safe, fictional sandbox.\n", type: "file" },
];
const CLUES = [
  { id: "email", time: "09:08", title: "Unexpected email", detail: "A message asked Maya to verify her account through a shortened link.", insight: "The email arrived before any unusual account activity." },
  { id: "login", time: "09:12", title: "Unusual sign-in", detail: "A successful sign-in came from a new location after several failed attempts.", insight: "The sign-in happened four minutes after the email." },
  { id: "file", time: "09:16", title: "Confidential file opened", detail: "The account opened a private folder a few minutes later.", insight: "This happened after the unusual sign-in." },
];
const APP_META: { id: AppId; label: string; icon: string; hint: string }[] = [
  { id: "home", label: "Home", icon: "⌂", hint: "Your desktop" },
  { id: "case", label: "Mystery Cases", icon: "?", hint: "Solve a short mystery" },
  { id: "files", label: "My Files", icon: "▤", hint: "Write and save a note" },
  { id: "terminal", label: "Terminal", icon: ">_", hint: "Try safe commands" },
  { id: "lab", label: "Security Lab", icon: "◈", hint: "Spot a suspicious link" },
  { id: "about", label: "About Arhaan", icon: "AS", hint: "Meet the builder" },
  { id: "projects", label: "Projects", icon: "▦", hint: "Explore selected work" },
];

function makeVisitorCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
function currentTime() {
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

export function CyberDesk() {
  const reducedMotion = useReducedMotion();
  const [activeApp, setActiveApp] = useState<AppId>("home");
  const [openApps, setOpenApps] = useState<AppId[]>(["home"]);
  const [startOpen, setStartOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);
  const [powerState, setPowerState] = useState<"on" | "sleep" | "off" | "booting">("on");
  const [clock, setClock] = useState("--:--");
  const [visitorCode, setVisitorCode] = useState("------");
  const [solved, setSolved] = useState(false);
  const [labComplete, setLabComplete] = useState(false);
  const [selectedClue, setSelectedClue] = useState("email");
  const [caseFeedback, setCaseFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [files, setFiles] = useState<VirtualFile[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("case-notes.txt");
  const [fileContent, setFileContent] = useState(DEFAULT_FILES[1].content);
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>(["ARHAAN OS · SAFE TERMINAL", 'Type "help" to see what you can do.']);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [contextMenu, setContextMenu] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const fileCount = files.filter((file) => file.type === "file").length;

  useEffect(() => {
    setClock(currentTime());
    const timer = window.setInterval(() => setClock(currentTime()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as SavedState;
        setSolved(Boolean(data.solved));
        setLabComplete(Boolean(data.labComplete));
        if (Array.isArray(data.files) && data.files.length) setFiles(data.files);
        if (typeof data.visitorCode === "string") setVisitorCode(data.visitorCode);
      } else {
        setVisitorCode(makeVisitorCode());
      }
    } catch {
      setVisitorCode(makeVisitorCode());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ solved, labComplete, files, visitorCode } satisfies SavedState));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [hydrated, solved, labComplete, files, visitorCode]);

  useEffect(() => {
    const selected = files.find((file) => file.name === activeFile && file.type === "file");
    if (selected) setFileContent(selected.content);
  }, [activeFile, files]);

  useEffect(() => {
    if (powerState !== "booting") return;
    setBootProgress(0);
    const first = window.setTimeout(() => setBootProgress(1), 180);
    const second = window.setTimeout(() => setBootProgress(2), 440);
    const finish = window.setTimeout(() => { setPowerState("on"); setBootProgress(3); }, reducedMotion ? 20 : 820);
    return () => { window.clearTimeout(first); window.clearTimeout(second); window.clearTimeout(finish); };
  }, [powerState, reducedMotion]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (desktopRef.current && !desktopRef.current.contains(event.target as Node)) {
        setStartOpen(false);
        setPowerOpen(false);
        setContextMenu(false);
      }
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, []);

  const openApp = (app: AppId) => {
    if (powerState !== "on") return;
    setActiveApp(app);
    setOpenApps((current) => current.includes(app) ? current : [...current, app]);
    setStartOpen(false);
    setPowerOpen(false);
    setContextMenu(false);
  };
  const closeApp = (app: AppId) => {
    setOpenApps((current) => {
      const next = current.filter((item) => item !== app);
      if (activeApp === app) setActiveApp(next[next.length - 1] ?? "home");
      return next;
    });
  };
  const updateFile = (value: string) => {
    setFileContent(value);
    setFiles((current) => current.map((file) => file.name === activeFile ? { ...file, content: value } : file));
  };
  const createFile = () => {
    const name = newFileName.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
    if (!name) return;
    const finalName = name.includes(".") ? name : name + ".txt";
    if (files.some((file) => file.name === finalName)) return;
    setFiles((current) => [...current, { name: finalName, content: "", type: "file" }]);
    setActiveFile(finalName);
    setFileContent("");
    setNewFileName("");
    setNewFileOpen(false);
  };
  const runCommand = () => {
    const command = terminalInput.trim();
    if (!command) return;
    const [verb, ...rest] = command.split(/\s+/);
    const arg = rest.join(" ");
    let output: string[];
    switch (verb.toLowerCase()) {
      case "help": output = ["help             show this guide", "ls               list virtual files", "pwd              show sandbox location", "cat <file>       read a text file", "open <app>       open an app", "case             open Mystery Case", "about            open Arhaan's profile", "clear            clear this screen"]; break;
      case "ls": output = files.map((file) => file.type === "folder" ? file.name + "/" : file.name); break;
      case "pwd": output = ["/visitor/workspace"]; break;
      case "cat": { const file = files.find((item) => item.name === arg && item.type === "file"); output = file ? file.content.split("\n") : ["File not found. Try ls to see available files."]; break; }
      case "case": openApp("case"); output = ["Opening Mystery Cases…"]; break;
      case "about": openApp("about"); output = ["Opening About Arhaan…"]; break;
      case "open": { const app = APP_META.find((item) => item.label.toLowerCase() === arg.toLowerCase() || item.id === arg.toLowerCase()); if (app) { openApp(app.id); output = ["Opening " + app.label + "…"]; } else output = ["App not found. Try: case, files, terminal, lab, about, projects."]; break; }
      case "clear": setTerminalLines([]); setTerminalInput(""); return;
      default: output = ['That command is not available in this safe sandbox.', 'Type "help" to see supported commands.'];
    }
    setTerminalLines((current) => [...current, "visitor@arhaan:~$ " + command, ...output]);
    setTerminalInput("");
  };
  const solveCase = (answer: string) => {
    if (answer === "email") { setSolved(true); setCaseFeedback(""); }
    else setCaseFeedback("Not quite. Look at the times. Which clue happened first, before the unusual sign-in?");
  };
  const shutdown = (state: "sleep" | "off") => {
    setPowerOpen(false);
    setStartOpen(false);
    setPowerState(state);
  };
  const apps = useMemo(() => APP_META, []);

  return (
    <div className="cyber-workstation reveal" aria-label="Interactive Arhaan OS workstation" ref={desktopRef}>
      <div className="cyber-workstation-halo" aria-hidden="true" />
      <div className="cyber-monitor">
        <div className="cyber-monitor-top-edge"><span /><span /><span /><small>ARHAAN DISPLAY · 27"</small></div>
        <div className={"cyber-monitor-screen" + (powerState !== "on" && powerState !== "booting" ? " is-dark" : "")}>
          <AnimatePresence mode="wait">
            {powerState === "off" || powerState === "sleep" ? (
              <motion.button key="standby" type="button" className="cyber-standby" onClick={() => setPowerState("booting")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Power on Arhaan OS">
                <span className="cyber-standby-power">⏻</span><strong>ARHAAN OS</strong><small>{powerState === "sleep" ? "SESSION PAUSED" : "WORKSPACE SECURED"}</small><em>CLICK TO POWER ON</em>
              </motion.button>
            ) : powerState === "booting" ? (
              <motion.div key="boot" className="cyber-boot-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="cyber-boot-mark">A.</div><strong>ARHAAN OS</strong>
                <p>{["initializing display…", "loading workspace…", "security modules ready…"][Math.min(bootProgress, 2)]}</p>
                <div className="cyber-boot-track"><i style={{ width: (bootProgress + 1) * 33.33 + "%" }} /></div>
              </motion.div>
            ) : (
              <motion.div key="desktop" className="cyber-os" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
                <header className="cyber-os-topbar">
                  <button type="button" className="cyber-os-brand" onClick={() => openApp("home")} aria-label="Open desktop home"><span className="cyber-os-brand-mark">A.</span><span>ARHAAN OS <b>PERSONAL DESK</b></span></button>
                  <div className="cyber-os-top-links"><span>LOCAL WORKSPACE</span><span>SECURITY READY</span></div>
                  <div className="cyber-os-status"><i /> <span>READY</span><span>{clock}</span></div>
                </header>
                <main className="cyber-os-workspace" onContextMenu={(event) => { event.preventDefault(); setContextMenu(true); }}>
                  <div className="cyber-os-wallpaper" aria-hidden="true"><span className="cyber-wallpaper-orb cyber-wallpaper-orb-a" /><span className="cyber-wallpaper-orb cyber-wallpaper-orb-b" /><span className="cyber-wallpaper-line cyber-wallpaper-line-a" /><span className="cyber-wallpaper-line cyber-wallpaper-line-b" /></div>
                  <div className="cyber-desktop-shortcuts">
                    {apps.filter((app) => app.id !== "home").map((app) => (
                      <button key={app.id} type="button" className={activeApp === app.id ? "cyber-desktop-shortcut is-active" : "cyber-desktop-shortcut"} onDoubleClick={() => openApp(app.id)} onClick={() => setActiveApp(app.id)} aria-label={"Select " + app.label}>
                        <span>{app.icon}</span><small>{app.label}</small>
                      </button>
                    ))}
                  </div>
                  <div className="cyber-desktop-welcome">
                    <span className="cyber-app-kicker">YOUR PERSONAL WORKSPACE</span>
                    <h2>Welcome to<br />Arhaan OS.</h2>
                    <p>A little computer you can explore. No technical knowledge needed.</p>
                    <div className="cyber-welcome-actions"><button type="button" onClick={() => openApp("case")}><span className="cyber-welcome-icon">?</span><span><small>START HERE</small><strong>Solve a mystery</strong><em>{solved ? "Case completed ✓" : "A 2-minute challenge"} →</em></span></button><button type="button" onClick={() => openApp("files")}><span className="cyber-welcome-icon">▤</span><span><small>MAKE SOMETHING</small><strong>Create a note</strong><em>Your files stay on this device →</em></span></button></div>
                    <div className="cyber-welcome-meta"><span><i /> PRIVATE SANDBOX</span><span>{solved ? "1 CASE SOLVED" : "1 CASE READY"}</span><span>VISITOR {visitorCode}</span></div>
                  </div>
                  <AnimatePresence>
                    {contextMenu ? <motion.div className="cyber-context-menu" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><button onClick={() => { setContextMenu(false); openApp("home"); }}>Refresh desktop</button><button onClick={() => { setContextMenu(false); setNewFileOpen(true); openApp("files"); }}>New text file</button><button onClick={() => { setContextMenu(false); setStartOpen(true); }}>Open Start menu</button></motion.div> : null}
                  </AnimatePresence>
                  <AnimatePresence>
                    {activeApp !== "home" && openApps.includes(activeApp) ? (
                      <motion.section key={activeApp} className={"cyber-app-window cyber-app-window-" + activeApp} initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} aria-label={apps.find((app) => app.id === activeApp)?.label}>
                        <div className="cyber-window-header"><div className="cyber-window-app-icon">{apps.find((app) => app.id === activeApp)?.icon}</div><strong>{apps.find((app) => app.id === activeApp)?.label}</strong><div className="cyber-window-controls"><button type="button" onClick={() => setActiveApp("home")} aria-label="Minimize window">−</button><button type="button" onClick={() => setActiveApp("home")} aria-label="Hide window">□</button><button type="button" onClick={() => closeApp(activeApp)} aria-label="Close window">×</button></div></div>
                        {activeApp === "case" ? <div className="cyber-window-body cyber-case-app">
                          <div className="cyber-app-title-row"><div><span className="cyber-app-kicker">MYSTERY CASES / CASE 001</span><h3>The strange sign-in</h3></div><span className={solved ? "cyber-app-badge is-done" : "cyber-app-badge"}>{solved ? "SOLVED" : "BEGINNER"}</span></div>
                          <p className="cyber-case-intro">Maya's work account was accessed unexpectedly. Inspect the clues, then work out what most likely started it.</p>
                          <div className="cyber-case-layout"><div className="cyber-clue-list">{CLUES.map((clue) => <button type="button" key={clue.id} className={selectedClue === clue.id ? "cyber-clue is-selected" : "cyber-clue"} onClick={() => setSelectedClue(clue.id)}><span className="cyber-clue-time">{clue.time}</span><span><strong>{clue.title}</strong><small>{clue.detail}</small></span><b>{selectedClue === clue.id ? "−" : "+"}</b></button>)}</div><aside className="cyber-clue-inspector"><span className="cyber-app-kicker">WHAT THIS TELLS YOU</span><strong>{CLUES.find((clue) => clue.id === selectedClue)?.title}</strong><p>{CLUES.find((clue) => clue.id === selectedClue)?.insight}</p></aside></div>
                          {!solved ? <div className="cyber-case-answer"><span className="cyber-app-kicker">WHAT MOST LIKELY STARTED IT?</span><div className="cyber-case-options"><button onClick={() => solveCase("email")}><b>A</b> A fake account-verification email</button><button onClick={() => solveCase("update")}><b>B</b> A normal computer update</button><button onClick={() => solveCase("wifi")}><b>C</b> A Wi-Fi problem</button></div><button type="button" className="cyber-hint-button" onClick={() => setShowHint((value) => !value)}>{showHint ? "HIDE HINT" : "NEED A HINT?"}</button>{showHint ? <p className="cyber-case-hint">Start with the earliest time: 09:08. The first event can help explain the ones that followed.</p> : null}{caseFeedback ? <p className="cyber-case-hint">{caseFeedback}</p> : null}</div> : <div className="cyber-case-success"><span className="cyber-success-mark">✓</span><div><strong>You're a Digital Detective.</strong><p>The fake email was the likely starting point. This is often called phishing: a message designed to trick someone into sharing access. Real investigations check more than one source before reaching a conclusion.</p><button onClick={() => { setSolved(false); setCaseFeedback(""); }}>PLAY AGAIN</button></div></div>}
                          <div className="cyber-window-foot"><span>FICTIONAL TRAINING SCENARIO</span><span>{solved ? "BADGE EARNED · DIGITAL DETECTIVE" : "01 / 01 · BEGINNER"}</span></div>
                        </div> : null}
                        {activeApp === "files" ? <div className="cyber-window-body cyber-files-app"><aside className="cyber-file-tree"><div className="cyber-file-tree-heading"><span>PLACES</span><button onClick={() => setNewFileOpen(true)} aria-label="Create a file">+</button></div><span className="cyber-file-location">⌂ &nbsp; Home</span><span className="cyber-file-location">▰ &nbsp; Documents</span><span className="cyber-file-location">↓ &nbsp; Downloads</span><div className="cyber-file-items">{files.map((file) => <button type="button" key={file.name} className={file.name === activeFile ? "is-active" : ""} onClick={() => { if (file.type === "file") setActiveFile(file.name); }}><span>{file.type === "folder" ? "▰" : "▤"}</span>{file.name}</button>)}</div></aside><div className="cyber-file-editor"><div className="cyber-file-editor-top"><div><span className="cyber-app-kicker">TEXT DOCUMENT · LOCAL</span><strong>{activeFile}</strong></div><div><button type="button" onClick={() => setNewFileOpen(true)}>NEW FILE +</button>{files.some((file) => file.name === activeFile && file.type === "file") ? <button type="button" onClick={() => { if (activeFile !== "read-me.txt") { setFiles((current) => current.filter((file) => file.name !== activeFile)); setActiveFile("case-notes.txt"); } }}>DELETE</button> : null}</div></div>{files.some((file) => file.name === activeFile && file.type === "file") ? <textarea value={fileContent} onChange={(event) => updateFile(event.target.value)} aria-label={"Edit " + activeFile} placeholder="Write a thought, clue, or note…" /> : <div className="cyber-folder-empty">Choose a text file to open it, or create a new one.</div>}<div className="cyber-file-editor-foot"><span>{fileContent.length} characters</span><span>{saved ? "✓ SAVED ON THIS DEVICE" : "STORAGE UNAVAILABLE"}</span></div>{newFileOpen ? <div className="cyber-new-file"><input value={newFileName} onChange={(event) => setNewFileName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createFile(); if (event.key === "Escape") setNewFileOpen(false); }} placeholder="my-note.txt" aria-label="New file name" autoFocus /><button onClick={createFile}>CREATE</button><button onClick={() => setNewFileOpen(false)}>CANCEL</button></div> : null}</div></div> : null}
                        {activeApp === "terminal" ? <div className="cyber-window-body cyber-terminal-app"><div className="cyber-terminal-heading"><div><span className="cyber-app-kicker">LOCAL SHELL</span><strong>visitor@arhaan:~</strong></div><span>SAFE SANDBOX · NO REAL COMMANDS</span></div><div className="cyber-terminal-output" aria-live="polite">{terminalLines.map((line, index) => <div key={index}>{line}</div>)}</div><form className="cyber-terminal-input" onSubmit={(event) => { event.preventDefault(); runCommand(); }}><span>visitor@arhaan:~$</span><input value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} aria-label="Safe terminal command input" autoComplete="off" spellCheck={false} /></form></div> : null}
                        {activeApp === "lab" ? <div className="cyber-window-body cyber-lab-app"><span className="cyber-app-kicker">SECURITY LAB · 20 SECOND CHALLENGE</span><h3>Spot the suspicious link.</h3><p>A message says your parcel is waiting. Which part should make you pause?</p><div className="cyber-message-preview"><span>FROM: Delivery Updates</span><strong>Your parcel is on hold.</strong><p>Please confirm your address to arrange delivery.</p><div className="cyber-fake-url">https://<button onClick={() => setLabComplete(true)} className={labComplete ? "is-found" : ""}>deliveries-check-verify.example</button>/track</div></div>{labComplete ? <div className="cyber-lab-feedback"><strong>Good catch.</strong><p>Unexpected links that pressure you to act deserve a closer look. Check the sender and visit the official website yourself instead of trusting a message link.</p><button onClick={() => setLabComplete(false)}>TRY AGAIN</button></div> : <p className="cyber-lab-prompt">Click the unusual-looking website address above.</p>}</div> : null}
                        {activeApp === "about" ? <div className="cyber-window-body cyber-about-app"><div className="cyber-about-profile"><div className="cyber-about-monogram">AS</div><div><span className="cyber-app-kicker">THE PERSON BEHIND THE DESK</span><h3>Arhaan Shaikh</h3><p>Cybersecurity learner and MCA student building practical skills through web security, VAPT, Linux, networking, and hands-on projects.</p></div></div><div className="cyber-about-grid"><div><span>FOCUS</span><strong>WEB SECURITY · VAPT</strong></div><div><span>FOUNDATIONS</span><strong>LINUX · NETWORKING</strong></div><div><span>APPROACH</span><strong>LEARN · BUILD · DOCUMENT</strong></div><a href="#projects"><span>PORTFOLIO</span><strong>VIEW MY WORK ↗</strong></a></div></div> : null}
                        {activeApp === "projects" ? <div className="cyber-window-body cyber-projects-app"><span className="cyber-app-kicker">SELECTED WORK</span><h3>Things I'm building.</h3><p>Explore real projects from the portfolio. The computer itself is a safe simulation; these links take you to portfolio pages.</p><a href="#projects" onClick={() => setActiveApp("home")}><span className="cyber-project-glyph">01</span><span><strong>Cybersecurity Portfolio</strong><small>Learning notes, labs, and hands-on work</small></span><b>↗</b></a><a href="#projects" onClick={() => setActiveApp("home")}><span className="cyber-project-glyph">02</span><span><strong>VAPT Internship Journey</strong><small>Web application testing and documentation</small></span><b>↗</b></a><a href="#projects" onClick={() => setActiveApp("home")}><span className="cyber-project-glyph">03</span><span><strong>Explore all projects</strong><small>Open the project section of this portfolio</small></span><b>↗</b></a></div> : null}
                      </motion.section>
                    ) : null}
                  </AnimatePresence>
                  <AnimatePresence>
                     {startOpen ? (
                       <motion.div
                         className="cyber-start-menu"
                         initial={{ opacity: 0, y: 10, scale: 0.98 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 6, scale: 0.98 }}
                         transition={{ duration: reducedMotion ? 0 : 0.16 }}
                       >
                         <div className="cyber-start-user">
                           <div className="cyber-start-avatar">AS</div>
                           <div><strong>Arhaan OS</strong><small>Personal workspace</small></div>
                           <span><i /> READY</span>
                         </div>
                         <label className="cyber-start-search">
                           <span>⌕</span>
                           <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find an app or task…" aria-label="Search apps" />
                         </label>
                         <div className="cyber-start-heading">PINNED APPS <span>{apps.filter((app) => (app.label + " " + app.hint).toLowerCase().includes(search.toLowerCase())).length}</span></div>
                         <div className="cyber-start-apps">
                           {apps.filter((app) => (app.label + " " + app.hint).toLowerCase().includes(search.toLowerCase())).map((app) => (
                             <button type="button" key={app.id} onClick={() => openApp(app.id)}>
                               <span>{app.icon}</span><strong>{app.label}</strong>
                             </button>
                           ))}
                         </div>
                         <div className="cyber-start-footer">
                           <span>VISITOR {visitorCode}</span>
                           <button type="button" onClick={() => setPowerOpen((value) => !value)}>⏻ Power</button>
                         </div>
                         {powerOpen ? (
                           <div className="cyber-power-menu">
                             <button onClick={() => shutdown("sleep")}><span>◐</span><strong>Sleep</strong><small>Pause the workspace</small></button>
                             <button onClick={() => setPowerState("booting")}><span>↻</span><strong>Restart</strong><small>Reload the desktop</small></button>
                             <button onClick={() => shutdown("off")}><span>⏻</span><strong>Shut down</strong><small>Secure this session</small></button>
                           </div>
                         ) : null}
                       </motion.div>
                     ) : null}
                  </AnimatePresence>
                </main>
                <footer className="cyber-taskbar">
                  <div className="cyber-taskbar-left"><button type="button" className={startOpen ? "cyber-start-button is-active" : "cyber-start-button"} onClick={() => { setStartOpen((value) => !value); setPowerOpen(false); }} aria-label="Open Start menu" aria-expanded={startOpen}><span>A.</span></button><button type="button" className="cyber-search-button" onClick={() => { setStartOpen(true); setSearch(""); }} aria-label="Search apps">⌕ <span>Search</span></button></div>
                  <div className="cyber-taskbar-pinned">{apps.filter((app) => app.id !== "home").map((app) => <button type="button" key={app.id} className={activeApp === app.id && openApps.includes(app.id) ? "is-active" : ""} onClick={() => activeApp === app.id ? setActiveApp("home") : openApp(app.id)} aria-label={app.label} title={app.label}><span>{app.icon}</span></button>)}</div>
                  <div className="cyber-taskbar-tray"><span title="Network connected">⌁</span><span title="Sound on">◖</span><span title="Power status">▰</span><time>{clock}</time></div>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="cyber-monitor-chin"><span>ARHAAN</span><div className={"cyber-monitor-power " + (powerState === "on" ? "is-on" : "")} /><span>DISPLAY / 01</span></div>
      </div>
      <div className="cyber-monitor-neck" aria-hidden="true"><span /></div>
      <div className="cyber-monitor-base" aria-hidden="true" />
      <div className="cyber-desk-surface" aria-hidden="true" />
      <div className="cyber-hardware-row">
        <div className="cyber-physical-keyboard" aria-label="Decorative physical keyboard">
          <div className="cyber-keyboard-topline"><span>ARHAAN / STUDIO</span><span>MECHANICAL · 75%</span></div>
          {["ESC  1  2  3  4  5  6  7  8  9  0  −  =  ⌫","TAB  Q  W  E  R  T  Y  U  I  O  P  [  ]","CAPS  A  S  D  F  G  H  J  K  L  ;  ↵","SHIFT  Z  X  C  V  B  N  M  ,  .  /  SHIFT"].map((line, row) => <div className="cyber-key-row" key={line}>{line.split(/\s+/).map((key, index) => <span key={key + index} className={(key === "⌫" || key === "SHIFT" || key === "TAB" || key === "CAPS" || key === "↵") ? "is-wide" : ""}>{key}</span>)}</div>)}
          <div className="cyber-key-row cyber-key-row-bottom"><span>CTRL</span><span>⌘</span><span>ALT</span><span className="is-space" /><span>ALT</span><span>⌘</span><span>←</span><span>↓</span><span>→</span></div>
        </div>
        <div className="cyber-physical-mouse" aria-label="Decorative physical mouse"><span className="cyber-mouse-seam" /><span className="cyber-mouse-wheel" /><span className="cyber-mouse-light" /></div>
        <div className="cyber-tower" aria-hidden="true"><span className="cyber-tower-mark">A.</span><i /><i /><i /><small>STUDIO / 01</small></div>
      </div>
      <div className="cyber-workstation-caption"><span><i /> SAFE INTERACTIVE SANDBOX</span><span>{saved ? "PROGRESS SAVED ON THIS DEVICE" : "LOCAL WORKSPACE"}</span><span>PROFILE {visitorCode}</span></div>
    </div>
  );
}

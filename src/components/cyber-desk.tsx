"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type AppId = "case" | "files" | "terminal" | "about";
type VirtualFile = { name: string; content: string; type: "folder" | "file" };

const STORAGE_KEY = "arhaan-cyberdesk-v3";

const DEFAULT_FILES: VirtualFile[] = [
  { name: "case-files", content: "", type: "folder" },
  { name: "case-notes.txt", content: "Clues I found:\n\n", type: "file" },
  { name: "ideas.txt", content: "", type: "file" },
];

const CLUES = [
  {
    id: "email",
    time: "09:08",
    title: "The unexpected email",
    detail: "Maya was asked to verify her account through a shortened link.",
    clue: "The message arrived before anything else happened.",
  },
  {
    id: "login",
    time: "09:12",
    title: "The strange sign-in",
    detail: "A successful sign-in came from a new location after failed attempts.",
    clue: "The sign-in happened four minutes after the email.",
  },
  {
    id: "file",
    time: "09:16",
    title: "The file access",
    detail: "The same account opened a confidential folder.",
    clue: "This happened after the unusual sign-in.",
  },
];

function createVisitorCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function CyberDesk() {
  const reducedMotion = useReducedMotion();
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [clock, setClock] = useState("--:--");
  const [caseSolved, setCaseSolved] = useState(false);
  const [selectedClue, setSelectedClue] = useState("email");
  const [caseFeedback, setCaseFeedback] = useState("");
  const [files, setFiles] = useState<VirtualFile[]>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("case-notes.txt");
  const [fileContent, setFileContent] = useState(DEFAULT_FILES[1].content);
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "CYBER DESK / SAFE TERMINAL",
    'Type "help" to explore.',
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [visitorCode, setVisitorCode] = useState("------");
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    setClock(formatTime(new Date()));
    const timer = window.setInterval(() => setClock(formatTime(new Date())), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          caseSolved?: boolean;
          files?: VirtualFile[];
          activeFile?: string;
          visitorCode?: string;
        };
        setCaseSolved(Boolean(data.caseSolved));
        if (Array.isArray(data.files) && data.files.length > 0) setFiles(data.files);
        if (data.activeFile === "ideas.txt" || data.activeFile === "case-notes.txt") setActiveFile(data.activeFile);
        if (typeof data.visitorCode === "string") setVisitorCode(data.visitorCode);
      } else {
        setVisitorCode(createVisitorCode());
      }
    } catch {
      setVisitorCode(createVisitorCode());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const current = files.find((file) => file.name === activeFile);
    if (current?.type === "file") setFileContent(current.content);
  }, [hydrated, files, activeFile]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ caseSolved, files, activeFile, visitorCode }),
      );
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [hydrated, caseSolved, files, activeFile, visitorCode]);

  const openApp = (app: AppId) => {
    setActiveApp(app);
    setInfoOpen(false);
    if (app === "files") {
      const firstFile = files.find((file) => file.type === "file");
      if (firstFile) {
        setActiveFile(firstFile.name);
        setFileContent(firstFile.content);
      }
    }
  };

  const closeApp = () => setActiveApp(null);

  const updateCurrentFile = (content: string) => {
    setFileContent(content);
    setFiles((current) =>
      current.map((file) => (file.name === activeFile ? { ...file, content } : file)),
    );
  };

  const createFile = () => {
    const cleaned = newFileName.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
    if (!cleaned) return;
    const finalName = cleaned.includes(".") ? cleaned : `${cleaned}.txt`;
    if (files.some((file) => file.name === finalName)) return;

    setFiles((current) => [...current, { name: finalName, content: "", type: "file" }]);
    setActiveFile(finalName);
    setFileContent("");
    setNewFileName("");
    setNewFileOpen(false);
  };

  const answerCase = (answer: string) => {
    if (answer === "email") {
      setCaseSolved(true);
      setCaseFeedback("");
    } else if (answer === "update") {
      setCaseFeedback("Not quite. Check the clue times: what happened before the sign-in?");
    } else {
      setCaseFeedback("Try again. The unusual sign-in is a result of something earlier.");
    }
  };

  const runTerminalCommand = () => {
    const command = terminalInput.trim();
    if (!command) return;
    const normalized = command.toLowerCase();
    let output: string[];

    if (normalized === "help") {
      output = [
        "help       show commands",
        "ls         list your virtual files",
        "pwd        show the sandbox path",
        "case       open Mystery Case 01",
        "about      open Arhaan's profile",
        "clear      clear the terminal",
      ];
    } else if (normalized === "ls") {
      output = files.map((file) => (file.type === "folder" ? `${file.name}/` : file.name));
    } else if (normalized === "pwd") {
      output = ["/home/visitor/cyber-desk"];
    } else if (normalized === "case") {
      openApp("case");
      output = ["Opening Mystery Case 01…"];
    } else if (normalized === "about") {
      openApp("about");
      output = ["Opening About Arhaan…"];
    } else if (normalized === "clear") {
      setTerminalLines([]);
      setTerminalInput("");
      return;
    } else {
      output = [`Unknown command: ${command}`, 'Try "help" to see what works here.'];
    }

    setTerminalLines((current) => [...current, `visitor@desk:~$ ${command}`, ...output]);
    setTerminalInput("");
  };

  const fileCount = files.filter((file) => file.type === "file").length;
  const apps = useMemo(
    () => [
      { id: "case" as AppId, label: "Mystery Case", meta: caseSolved ? "SOLVED" : "CASE 01", icon: "?", tone: "case" },
      { id: "files" as AppId, label: "My Files", meta: `${fileCount} FILES`, icon: "▣", tone: "files" },
      { id: "terminal" as AppId, label: "Terminal", meta: "SAFE MODE", icon: ">_", tone: "terminal" },
      { id: "about" as AppId, label: "About Arhaan", meta: "PROFILE", icon: "AS", tone: "about" },
    ],
    [caseSolved, fileCount],
  );

  return (
    <div className="cyber-desk reveal" aria-label="Interactive Cyber Desk">
      <div className="cyber-os">
        <header className="cyber-os-topbar">
          <button type="button" className="cyber-os-brand" onClick={() => setActiveApp(null)}>
            <span className="cyber-os-brand-mark">A.</span>
            <span>ARHAAN OS <b>/ CYBER DESK</b></span>
          </button>

          <div className="cyber-os-menubar" aria-hidden="true">
            <span>WORKSPACE</span>
            <span>SECURITY</span>
            <span>PERSONAL</span>
          </div>

          <div className="cyber-os-status">
            <span className="cyber-os-status-ready"><i /> READY</span>
            <span>{clock}</span>
            <button type="button" onClick={() => setInfoOpen((current) => !current)} aria-label="Open desk information">i</button>
          </div>

          <AnimatePresence>
            {infoOpen ? (
              <motion.div
                className="cyber-info-popover"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <span className="cyber-app-kicker">VISITOR SESSION</span>
                <strong>{visitorCode}</strong>
                <p>Your desk is local to this browser. Progress is saved automatically.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </header>

        <main className="cyber-os-workspace">
          <div className="cyber-os-wallpaper" aria-hidden="true">
            <span className="cyber-wallpaper-orb cyber-wallpaper-orb-a" />
            <span className="cyber-wallpaper-orb cyber-wallpaper-orb-b" />
            <span className="cyber-wallpaper-line cyber-wallpaper-line-a" />
            <span className="cyber-wallpaper-line cyber-wallpaper-line-b" />
          </div>

          <section className="cyber-home-panel" aria-label="Cyber Desk home">
            <div className="cyber-home-heading">
              <div>
                <span className="cyber-app-kicker">PERSONAL WORKSTATION</span>
                <h2>Welcome to the desk.</h2>
                <p>Explore a small digital world built around Arhaan&apos;s cybersecurity journey.</p>
              </div>
              <div className="cyber-home-status">
                <span><i /> SESSION ACTIVE</span>
                <small>VISITOR {visitorCode}</small>
              </div>
            </div>

            <div className="cyber-home-grid">
              <button type="button" className="cyber-home-feature" onClick={() => openApp("case")}>
                <span className="cyber-home-feature-kicker">START HERE · 01</span>
                <span className="cyber-home-feature-icon">?</span>
                <strong>{caseSolved ? "Case solved. Try it again." : "Can you solve the mystery?"}</strong>
                <p>Find the clue that started a suspicious account takeover.</p>
                <span className="cyber-home-feature-action">{caseSolved ? "PLAY AGAIN" : "OPEN CASE"} <b>→</b></span>
              </button>

              <div className="cyber-home-side">
                <button type="button" onClick={() => openApp("files")} className="cyber-home-mini">
                  <span className="cyber-home-mini-icon">▣</span>
                  <span><strong>Make a file</strong><small>Create a note and keep it here.</small></span>
                  <b>→</b>
                </button>
                <button type="button" onClick={() => openApp("about")} className="cyber-home-mini">
                  <span className="cyber-home-mini-icon">AS</span>
                  <span><strong>Meet Arhaan</strong><small>See what I&apos;m learning and building.</small></span>
                  <b>→</b>
                </button>
              </div>
            </div>

            <div className="cyber-home-progress">
              <span><b>01</b> MISSION</span>
              <div><i className={caseSolved ? "is-complete" : ""} /></div>
              <span>{caseSolved ? "COMPLETE" : "READY TO TRY"}</span>
            </div>
          </section>

          <div className="cyber-desktop-launchers">
            {apps.map((app) => (
              <motion.button
                type="button"
                key={app.id}
                className={activeApp === app.id ? "is-active" : ""}
                onClick={() => openApp(app.id)}
                whileTap={{ scale: 0.97 }}
              >
                <span className={`cyber-launcher-icon cyber-launcher-${app.tone}`}>{app.icon}</span>
                <strong>{app.label}</strong>
                <small>{app.meta}</small>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeApp ? (
              <motion.section
                key={activeApp}
                className="cyber-app-window"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 10, scale: reducedMotion ? 1 : 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 7, scale: reducedMotion ? 1 : 0.99 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <WindowHeader title={apps.find((app) => app.id === activeApp)?.label ?? "App"} onClose={closeApp} />

                {activeApp === "case" ? (
                  <div className="cyber-window-body cyber-case-app">
                    <div className="cyber-app-title-row">
                      <div>
                        <span className="cyber-app-kicker">BEGINNER INVESTIGATION · CASE 001</span>
                        <h3>The strange sign-in</h3>
                      </div>
                      <span className={caseSolved ? "cyber-app-badge is-done" : "cyber-app-badge"}>{caseSolved ? "SOLVED" : "OPEN"}</span>
                    </div>

                    <p className="cyber-case-intro">Someone accessed Maya&apos;s work account. Read the clues in time order, inspect what stands out, then decide what most likely started the incident.</p>

                    <div className="cyber-case-layout">
                      <div className="cyber-clue-list">
                        {CLUES.map((clue) => (
                          <button type="button" key={clue.id} className={selectedClue === clue.id ? "cyber-clue is-selected" : "cyber-clue"} onClick={() => setSelectedClue(clue.id)}>
                            <span className="cyber-clue-time">{clue.time}</span>
                            <span><strong>{clue.title}</strong><small>{clue.detail}</small></span>
                            <b>{selectedClue === clue.id ? "−" : "+"}</b>
                          </button>
                        ))}
                      </div>
                      <aside className="cyber-clue-inspector">
                        <span className="cyber-app-kicker">INSPECTING CLUE</span>
                        <strong>{CLUES.find((clue) => clue.id === selectedClue)?.title}</strong>
                        <p>{CLUES.find((clue) => clue.id === selectedClue)?.clue}</p>
                        <span className="cyber-inspector-time">{CLUES.find((clue) => clue.id === selectedClue)?.time}</span>
                      </aside>
                    </div>

                    {!caseSolved ? (
                      <div className="cyber-case-answer">
                        <span className="cyber-app-kicker">WHAT MOST LIKELY STARTED IT?</span>
                        <div className="cyber-case-options">
                          <button type="button" onClick={() => answerCase("email")}><span>A</span> Fake account-verification email</button>
                          <button type="button" onClick={() => answerCase("update")}><span>B</span> A routine software update</button>
                          <button type="button" onClick={() => answerCase("wifi")}><span>C</span> A Wi-Fi problem</button>
                        </div>
                        {caseFeedback ? <p className="cyber-case-hint">{caseFeedback}</p> : null}
                      </div>
                    ) : (
                      <div className="cyber-case-success">
                        <span className="cyber-success-mark">✓</span>
                        <div>
                          <strong>Case solved.</strong>
                          <p>The fake email was the likely starting point. Real investigations use multiple sources of evidence before reaching a conclusion.</p>
                          <button type="button" onClick={() => { setCaseSolved(false); setCaseFeedback(""); }}>RESET CASE</button>
                        </div>
                      </div>
                    )}

                    <div className="cyber-window-foot"><span>FICTIONAL TRAINING SCENARIO</span><span>{caseSolved ? "01 / 01 COMPLETE" : "01 / 01 · BEGINNER"}</span></div>
                  </div>
                ) : null}

                {activeApp === "files" ? (
                  <div className="cyber-window-body cyber-files-app">
                    <aside className="cyber-file-tree">
                      <div className="cyber-file-tree-heading"><span>HOME</span><button type="button" onClick={() => setNewFileOpen(true)} aria-label="Create a new file">+</button></div>
                      <button type="button" className="cyber-file-folder is-selected"><span>⌂</span> visitor</button>
                      <div className="cyber-file-items">
                        {files.map((file) => (
                          <button type="button" key={file.name} className={file.name === activeFile ? "is-active" : ""} onClick={() => { if (file.type === "file") { setActiveFile(file.name); setFileContent(file.content); } }}>
                            <span>{file.type === "folder" ? "▰" : "▤"}</span>{file.name}
                          </button>
                        ))}
                      </div>
                    </aside>
                    <div className="cyber-file-editor">
                      <div className="cyber-file-editor-top">
                        <div><span className="cyber-app-kicker">TEXT DOCUMENT</span><strong>{activeFile}</strong></div>
                        <button type="button" onClick={() => setNewFileOpen(true)}>NEW FILE</button>
                      </div>
                      <textarea value={fileContent} onChange={(event) => updateCurrentFile(event.target.value)} aria-label={`Edit ${activeFile}`} placeholder="Write a thought, clue, or note…" />
                      <div className="cyber-file-editor-foot"><span>{fileContent.length} characters</span><span>{saved ? "✓ AUTO-SAVED" : "STORAGE UNAVAILABLE"}</span></div>
                      {newFileOpen ? (
                        <div className="cyber-new-file">
                          <input value={newFileName} onChange={(event) => setNewFileName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createFile(); }} placeholder="filename" aria-label="New file name" autoFocus />
                          <button type="button" onClick={createFile}>CREATE</button>
                          <button type="button" onClick={() => { setNewFileOpen(false); setNewFileName(""); }}>CANCEL</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {activeApp === "terminal" ? (
                  <div className="cyber-window-body cyber-terminal-app">
                    <div className="cyber-terminal-heading"><div><span className="cyber-app-kicker">LOCAL SHELL</span><strong>visitor@cyber-desk</strong></div><span>SAFE SANDBOX</span></div>
                    <div className="cyber-terminal-output" aria-live="polite">{terminalLines.map((line, index) => <div key={index}>{line}</div>)}</div>
                    <div className="cyber-terminal-input"><span>visitor@desk:~$</span><input value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runTerminalCommand(); }} aria-label="Safe terminal command input" autoComplete="off" spellCheck={false} /></div>
                  </div>
                ) : null}

                {activeApp === "about" ? (
                  <div className="cyber-window-body cyber-about-app">
                    <div className="cyber-about-profile">
                      <div className="cyber-about-monogram">AS</div>
                      <div><span className="cyber-app-kicker">CYBERSECURITY LEARNER</span><h3>Arhaan Shaikh</h3><p>Building practical skills through web security, VAPT, Linux, networking, and hands-on projects.</p></div>
                    </div>
                    <div className="cyber-about-grid">
                      <div><span>FOCUS</span><strong>WEB SECURITY · VAPT</strong></div>
                      <div><span>LABS</span><strong>LINUX · NETWORKING</strong></div>
                      <div><span>APPROACH</span><strong>LEARN · BUILD · DOCUMENT</strong></div>
                      <a href="#projects"><span>WORK</span><strong>VIEW PROJECTS ↗</strong></a>
                    </div>
                  </div>
                ) : null}
              </motion.section>
            ) : null}
          </AnimatePresence>

          <nav className="cyber-os-dock" aria-label="Cyber Desk apps">
            <button type="button" className={activeApp === null ? "is-active cyber-dock-home" : "cyber-dock-home"} onClick={() => setActiveApp(null)} aria-label="Desktop home">
              A.
            </button>
            {apps.map((app) => (
              <button type="button" key={app.id} className={activeApp === app.id ? "is-active" : ""} onClick={() => openApp(app.id)} aria-label={app.label} title={app.label}>
                <span>{app.icon}</span>
                {activeApp === app.id ? <i /> : null}
              </button>
            ))}
          </nav>
        </main>

        <footer className="cyber-os-footer">
          <span><i /> LOCAL SANDBOX</span>
          <span>{saved ? "PROGRESS SAVED ON THIS DEVICE" : "READY TO EXPLORE"}</span>
          <span>PROFILE {visitorCode}</span>
        </footer>
      </div>
    </div>
  );
}

function WindowHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="cyber-window-header">
      <div className="cyber-window-dots" aria-hidden="true"><i /><i /><i /></div>
      <span>{title}</span>
      <button type="button" className="cyber-window-close" onClick={onClose} aria-label={`Close ${title}`}>×</button>
    </div>
  );
}

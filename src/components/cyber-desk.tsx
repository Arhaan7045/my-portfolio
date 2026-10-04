"use client";

import { useEffect, useState } from "react";

type AppMode = "explore" | "case" | "files";
type Evidence = { id: string; time: string; title: string; detail: string };

const evidence: Evidence[] = [
  { id: "login", time: "09:12", title: "Unusual sign-in", detail: "A sign-in succeeded from a new location shortly after several failed attempts." },
  { id: "email", time: "09:08", title: "Unexpected email", detail: "A message asked the employee to verify their account using a shortened link." },
  { id: "file", time: "09:16", title: "File accessed", detail: "The same account opened a confidential folder minutes after the unusual sign-in." },
];

const STORAGE_KEY = "arhaan-cyberdesk-progress-v1";

export function CyberDesk() {
  const [mode, setMode] = useState<AppMode>("explore");
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState("email");
  const [notes, setNotes] = useState<Record<string, string>>({ "case-notes.txt": "", "ideas.txt": "" });
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [activeFile, setActiveFile] = useState("case-notes.txt");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { solved?: boolean; notes?: Record<string, string>; activeFile?: string };
        setSolved(Boolean(data.solved));
        if (data.notes && typeof data.notes === "object") setNotes({ "case-notes.txt": data.notes["case-notes.txt"] ?? "", "ideas.txt": data.notes["ideas.txt"] ?? "" });
        setActiveFile(data.activeFile === "ideas.txt" ? "ideas.txt" : "case-notes.txt");
      }
    } catch {
      // The desk remains usable if storage is unavailable.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ solved, notes, activeFile }));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [hydrated, solved, notes, activeFile]);

  const chooseMode = (nextMode: AppMode) => setMode(nextMode);

  return (
    <div className="cyber-desk reveal" aria-label="Interactive Cyber Desk">
      <div className="cyber-desk-topbar">
        <div className="cyber-window-controls" aria-hidden="true"><i /><i /><i /></div>
        <div className="cyber-desk-brand"><span className="cyber-brand-mark">A.</span><span>ARHAAN <b>/ CYBER DESK</b></span></div>
        <span className="cyber-desk-live"><i /> {saved ? "SAVED LOCALLY" : "SESSION READY"}</span>
      </div>

      <div className="cyber-desk-welcome">
        <div>
          <span className="cyber-micro-label">YOUR INTERACTIVE WORKSPACE</span>
          <h2>{mode === "case" ? "A small mystery." : mode === "files" ? "Make yourself at home." : "Curiosity looks good on you."}</h2>
          <p>{mode === "case" ? "Follow the clues. No technical knowledge needed." : mode === "files" ? "Write a note. It will be here when you return on this browser." : "Explore a tiny digital world. Open a case, make a note, or just look around."}</p>
        </div>
        <span className="cyber-desk-avatar" aria-hidden="true">AS</span>
      </div>

      <div className="cyber-desk-tabs" role="tablist" aria-label="Cyber Desk sections">
        <button type="button" role="tab" aria-selected={mode === "explore"} className={mode === "explore" ? "is-active" : ""} onClick={() => chooseMode("explore")}><span>⌂</span> Explore</button>
        <button type="button" role="tab" aria-selected={mode === "case"} className={mode === "case" ? "is-active" : ""} onClick={() => chooseMode("case")}><span>◎</span> Mystery case</button>
        <button type="button" role="tab" aria-selected={mode === "files"} className={mode === "files" ? "is-active" : ""} onClick={() => chooseMode("files")}><span>▤</span> My notes</button>
      </div>

      {mode === "explore" ? (
        <div className="cyber-desk-explore">
          <button type="button" className="cyber-app-tile cyber-app-featured" onClick={() => chooseMode("case")}>
            <span className="cyber-app-icon">?</span><span className="cyber-app-copy"><strong>Mystery Case 01</strong><small>Can you spot what went wrong?</small></span><span className="cyber-app-arrow">↗</span>
          </button>
          <button type="button" className="cyber-app-tile" onClick={() => chooseMode("files")}>
            <span className="cyber-app-icon">✎</span><span className="cyber-app-copy"><strong>My notes</strong><small>Save a thought or a clue</small></span><span className="cyber-app-arrow">↗</span>
          </button>
          <a className="cyber-app-tile" href="#projects">
            <span className="cyber-app-icon">↗</span><span className="cyber-app-copy"><strong>Arhaan&apos;s work</strong><small>Projects, learning &amp; experiments</small></span><span className="cyber-app-arrow">↗</span>
          </a>
          <div className="cyber-desk-tip"><span className="cyber-tip-spark">✦</span><span><strong>NEW HERE?</strong> Start with Mystery Case 01. It takes about a minute.</span></div>
        </div>
      ) : null}

      {mode === "case" ? (
        <div className="cyber-case">
          <div className="cyber-case-heading"><span className="cyber-case-number">CASE 001 / THE STRANGE SIGN-IN</span><span className={solved ? "cyber-case-status is-solved" : "cyber-case-status"}>{solved ? "SOLVED ✓" : "OPEN CASE"}</span></div>
          <p className="cyber-case-story">Someone accessed Maya&apos;s work account this morning. Read the three clues and decide what most likely started the incident.</p>
          <div className="cyber-evidence-list">
            {evidence.map((item) => (
              <button type="button" key={item.id} className={selectedEvidence === item.id ? "cyber-evidence is-selected" : "cyber-evidence"} onClick={() => setSelectedEvidence(item.id)}>
                <span className="cyber-evidence-time">{item.time}</span><span className="cyber-evidence-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><span className="cyber-evidence-chevron">{selectedEvidence === item.id ? "−" : "+"}</span>
              </button>
            ))}
          </div>
          {!solved ? (
            <div className="cyber-case-answer">
              <span className="cyber-micro-label">WHAT DO YOU THINK STARTED IT?</span>
              <div className="cyber-answer-options">
                <button type="button" onClick={() => { setSolved(true); setHint(false); }}><span>A</span> A convincing fake email</button>
                <button type="button" onClick={() => setHint(true)}><span>B</span> A computer update</button>
              </div>
              {hint ? <p className="cyber-case-feedback">Hint: the unexpected email appeared before the sign-in. What might happen if someone follows its link?</p> : null}
            </div>
          ) : (
            <div className="cyber-case-success"><span className="cyber-success-icon">✓</span><div><strong>Nice detective work.</strong><p>The phishing email was the likely starting point. A fake sign-in page could have captured Maya&apos;s password. Real investigations use more evidence before reaching a final conclusion.</p><button type="button" onClick={() => { setSolved(false); setHint(false); }}>PLAY AGAIN ↗</button></div></div>
          )}
          <div className="cyber-case-foot"><span>FICTIONAL TRAINING SCENARIO</span><span>{solved ? "01 / 01 COMPLETE" : "01 / 01"} · BEGINNER</span></div>
        </div>
      ) : null}

      {mode === "files" ? (
        <div className="cyber-notes">
          <div className="cyber-file-sidebar"><span className="cyber-micro-label">YOUR FILES</span><button type="button" className={activeFile === "case-notes.txt" ? "is-active" : ""} onClick={() => setActiveFile("case-notes.txt")}>▤ case-notes.txt</button><button type="button" className={activeFile === "ideas.txt" ? "is-active" : ""} onClick={() => setActiveFile("ideas.txt")}>▤ ideas.txt</button></div>
          <label className="cyber-note-editor"><span><b>{activeFile}</b><small>Plain text · saved in this browser</small></span><textarea value={notes[activeFile] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [activeFile]: event.target.value }))} placeholder="Write a thought, a clue, or a reminder..." rows={5} aria-label="Your saved note" /><span className="cyber-note-foot"><span>{(notes[activeFile] ?? "").length} characters</span><span>{saved ? "✓ Auto-saved" : "Storage unavailable"}</span></span></label>
        </div>
      ) : null}

      <div className="cyber-desk-bottom"><span><i /> PRIVATE SANDBOX · NOTHING RUNS ON A REAL SYSTEM</span><span>MADE BY ARHAAN <b>↗</b></span></div>
    </div>
  );
}

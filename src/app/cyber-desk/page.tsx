import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { CyberDesk } from "@/components/cyber-desk";

export const metadata: Metadata = {
  title: "Cyber Desk | Arhaan Shaikh",
  description:
    "Explore a realistic fictional ARHAAN OS workstation built around Arhaan Shaikh's cybersecurity learning journey.",
};

export default function CyberDeskPage() {
  return (
    <div className="site-frame cyber-desk-page">
      <div id="page-top" aria-hidden="true" />
      <SiteHeader />

      <main id="main-content">
        <section className="cyber-desk-intro shell" aria-labelledby="cyber-desk-title">
          <div className="cyber-desk-intro-top">
            <Link className="cyber-desk-back" href="/">
              <span aria-hidden="true">←</span> BACK TO PORTFOLIO
            </Link>
            <span className="cyber-desk-page-status"><i /> INTERACTIVE WORKSPACE</span>
          </div>

          <div className="cyber-desk-intro-copy">
            <p className="eyebrow">CYBER DESK / ARHAAN OS</p>
            <h1 id="cyber-desk-title">Explore the computer.</h1>
            <p>
              A fictional personal workstation for exploring my cybersecurity journey.
              Open apps, solve a case, create virtual notes, learn from quick security challenges,
              and explore safely.
            </p>
          </div>
        </section>

        <section className="cyber-desk-stage" aria-label="Interactive Arhaan OS workstation">
          <div className="shell">
            <CyberDesk />
          </div>
        </section>

        <section className="cyber-desk-instructions shell" aria-labelledby="cyber-instructions-title">
          <div className="cyber-instructions-heading">
            <p className="eyebrow">HOW TO EXPLORE</p>
            <h2 id="cyber-instructions-title">Start here.</h2>
            <p>
              Everything inside the monitor is a fictional browser sandbox. Nothing here changes
              your real computer.
            </p>
          </div>
          <div className="cyber-instructions-grid">
            <div><span>01</span><strong>Open Start</strong><p>Use Start to launch apps, search, or open power controls.</p></div>
            <div><span>02</span><strong>Solve a Mystery</strong><p>Open Mystery Cases and work through Case 001.</p></div>
            <div><span>03</span><strong>Use File Explorer</strong><p>Create, rename, edit, and delete virtual notes and folders.</p></div>
            <div><span>04</span><strong>Try the Terminal</strong><p>Use only the supported safe commands shown by <code>help</code>.</p></div>
            <div><span>05</span><strong>Visit Security Lab</strong><p>Complete short 10–30 second cybersecurity challenges.</p></div>
            <div><span>06</span><strong>Change Appearance</strong><p>Settings offers seven ARHAAN OS themes without changing the main portfolio.</p></div>
            <div><span>07</span><strong>Watch the Hardware React</strong><p>Real keyboard, mouse-button, and wheel events are reflected on the desk.</p></div>
            <div><span>08</span><strong>Your Progress Saves</strong><p>Case progress, lab progress, virtual files, settings, and recent activity stay on this device.</p></div>
          </div>
          <div className="cyber-instructions-safety">
            <strong>SAFE FICTIONAL SANDBOX</strong>
            <span>Nothing here changes your real computer.</span>
          </div>
        </section>
      </main>

      <footer className="footer shell">
        <div className="footer-quote">
          <span>“Learn. Build. Secure. Repeat.”</span>
          <small>ARHAAN SHAIKH / CYBER DESK</small>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Arhaan</span>
          <div className="footer-links">
            <a href="https://github.com/Arhaan7045" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/arhaanshaikh1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:arhaan.s7045@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

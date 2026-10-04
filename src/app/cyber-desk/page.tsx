import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { CyberDesk } from "@/components/cyber-desk";

export const metadata: Metadata = {
  title: "Cyber Desk | Arhaan Shaikh",
  description:
    "Explore an interactive fictional desktop workstation built around Arhaan Shaikh's cybersecurity journey.",
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
            <p className="eyebrow">CYBER DESK</p>
            <h1 id="cyber-desk-title">Explore the computer.</h1>
            <p>
              A small fictional workstation built around my cybersecurity journey.
              Open an app, solve a mystery, or simply look around.
            </p>
          </div>
        </section>

        <section className="cyber-desk-stage" aria-label="Interactive Arhaan OS workstation">
          <div className="shell">
            <CyberDesk />
          </div>
        </section>

        <section className="cyber-desk-guide shell" aria-label="How to explore the Cyber Desk">
          <div>
            <span>START HERE</span>
            <strong>Open Mystery Cases</strong>
            <p>Try the beginner investigation and see if you can spot what happened first.</p>
          </div>
          <div>
            <span>EXPLORE</span>
            <strong>Open Files or Terminal</strong>
            <p>Make a note, create a virtual file, or try a few safe commands.</p>
          </div>
          <div>
            <span>YOUR SESSION</span>
            <strong>Progress is saved</strong>
            <p>Your workspace progress is saved on this device for your next visit.</p>
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

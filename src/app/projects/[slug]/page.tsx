import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "VAPT Internship — Web Application Security Assessment | Arhaan Shaikh",
  description:
    "Case study documenting Arhaan Shaikh's VAPT internship work in web application security, including assessment workflow, tools, validated findings, evidence, and remediation guidance.",
};

const workflow = [
  ["01", "Reconnaissance"],
  ["02", "Security Testing"],
  ["03", "Vulnerability Analysis"],
  ["04", "Documentation"],
] as const;

const focus = ["Burp Suite", "Web Application Security", "VAPT"] as const;

export default function VaptInternshipCaseStudy() {
  return (
    <div className="site-frame">
      <div id="page-top" aria-hidden="true" />
      <SiteHeader />

      <main id="main-content" className="case-study-main">
        <div className="case-study-shell">
          <Link className="case-study-back" href="/#projects">
            <span aria-hidden="true">←</span> Back to projects
          </Link>

          <header className="case-study-hero">
            <div className="case-study-kicker">
              <span>PROJECT / 01 · VAPT INTERNSHIP</span>
              <strong>IN PROGRESS</strong>
            </div>

            <h1 className="case-study-title">
              Web Application
              <br />
              Security Assessment.
            </h1>

            <p className="case-study-intro">
              A practical web application security assessment project developed
              during my VAPT internship, covering reconnaissance, testing,
              vulnerability analysis, and security documentation.
            </p>

            <div className="case-study-meta" aria-label="Project tags">
              <span>VAPT</span>
              <span>WEB APPLICATION SECURITY</span>
              <span>BURP SUITE</span>
            </div>
          </header>

          <div className="case-study-grid">
            <section className="case-study-panel">
              <div className="case-study-section-head">
                <span>01 / Assessment workflow</span>
                <span>Current project</span>
              </div>
              <div className="case-study-panel-body">
                <h2>From reconnaissance to documented security findings.</h2>
                <p>
                  The project is being documented around a practical assessment
                  workflow. The case study will grow as validated testing
                  results, evidence, risk context, and remediation guidance are
                  completed.
                </p>
              </div>

              <div className="case-study-flow">
                {workflow.map(([number, label]) => (
                  <div className="case-study-flow-item" key={number}>
                    <span>{number}</span>
                    <h3>{label}</h3>
                  </div>
                ))}
              </div>
            </section>

            <aside className="case-study-panel case-study-status">
              <div>
                <div className="case-study-section-head">
                  <span>Status</span>
                  <span>01</span>
                </div>
                <div className="case-study-panel-body">
                  <span className="case-study-label">PROJECT STATE</span>
                  <strong>Documentation in progress.</strong>
                  <p>
                    Findings and evidence will be added only after they are
                    validated during the assessment.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <section className="case-study-panel case-study-evidence">
            <div className="case-study-section-head">
              <span>02 / Working focus</span>
              <span>Current focus</span>
            </div>
            <div className="case-study-panel-body">
              <h2>What I am working with during the assessment.</h2>
              <div className="case-study-tool-list">
                {focus.map((tool) => (
                  <span className="case-study-tool" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="case-study-panel case-study-evidence">
            <div className="case-study-section-head">
              <span>03 / Findings & evidence</span>
              <span>Awaiting validation</span>
            </div>
            <div className="case-study-evidence-card">
              <span className="case-study-evidence-mark" aria-hidden="true">+</span>
              <div>
                <h3>Findings will be documented as they are validated.</h3>
                <p>
                  This section will be updated with validated findings, supporting
                  evidence, risk context, and remediation guidance as the
                  assessment progresses. Nothing is added here until it has
                  been verified.
                </p>
              </div>
            </div>
          </section>

          <div className="case-study-next">
            <span>Project documentation</span>
            <Link href="/#projects">Return to the project archive ↗</Link>
          </div>
        </div>
      </main>

      <footer className="footer shell">
        <div className="footer-quote">
          <span>“Learn. Build. Secure. Repeat.”</span>
          <small>ARHAAN SHAIKH / VAPT CASE STUDY</small>
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

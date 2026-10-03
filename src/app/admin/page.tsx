import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await requireAdmin();

  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? "Admin";

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <Link href="/" className="admin-auth-wordmark" aria-label="Back to portfolio">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>Arhaan Shaikh</span>
          </Link>

          <div className="admin-topbar-meta">
            <span>PRIVATE / ADMIN</span>
            <ThemeSwitcher />
            <form action="/auth/signout" method="post">
              <button type="submit">SIGN OUT ↗</button>
            </form>
          </div>
        </header>

        <section className="admin-dashboard-intro">
          <div className="admin-dashboard-copy">
            <div className="admin-dashboard-eyebrow">
              <span className="admin-status-dot" aria-hidden="true" />
              <span>CONTROL ROOM</span>
              <span>PRIVATE ACCESS</span>
            </div>
            <h1>Manage the portfolio<span>.</span></h1>
            <p>
              Manage the projects, experience, skills, certifications, and learning areas shown on your public portfolio.
            </p>
          </div>

          <aside className="admin-session-card">
            <div className="admin-session-topline">
              <span>SESSION</span>
              <span>VERIFIED</span>
            </div>
            <div className="admin-session-identity">
              <span className="admin-session-mark" aria-hidden="true">◈</span>
              <div>
                <span>AUTHENTICATED AS</span>
                <strong>{email}</strong>
              </div>
            </div>
            <div className="admin-session-footer">
              <span>ADMIN ACCESS</span>
              <span>DATABASE LIVE</span>
            </div>
          </aside>
        </section>

        <div className="admin-module-header">
          <div>
            <span>CONTENT MODULES</span>
            <strong>Portfolio control surface</strong>
          </div>
          <span>04 MODULES</span>
        </div>

        <section className="admin-module-grid" aria-label="Admin modules">
          <article className="admin-module-card admin-module-card-active">
            <span>01</span>
            <h2>Projects</h2>
            <p>Case studies, project status, descriptions, tags, and publishing.</p>
            <Link className="admin-module-action" href="/admin/projects">
              OPEN MODULE <span aria-hidden="true">↗</span>
            </Link>
          </article>

          <article className="admin-module-card admin-module-card-active">
            <span>02</span>
            <h2>Experience</h2>
            <p>Roles, organizations, descriptions, ordering, and visibility.</p>
            <Link className="admin-module-action" href="/admin/experience">
              OPEN MODULE <span aria-hidden="true">↗</span>
            </Link>
          </article>

          <article className="admin-module-card admin-module-card-active">
            <span>03</span>
            <h2>Skills & learning</h2>
            <p>Skill groups, learning areas, and their public visibility.</p>
            <Link className="admin-module-action" href="/admin/skills">
              OPEN MODULE <span aria-hidden="true">↗</span>
            </Link>
          </article>

          <article className="admin-module-card admin-module-card-active">
            <span>04</span>
            <h2>Certifications</h2>
            <p>Credentials and virtual experiences managed from one place.</p>
            <Link className="admin-module-action" href="/admin/certifications">
              OPEN MODULE <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </section>

        <footer className="admin-dashboard-footer">
          <span>DATABASE CONNECTED</span>
          <Link href="/">VIEW PUBLIC PORTFOLIO ↗</Link>
        </footer>
      </div>
    </main>
  );
}

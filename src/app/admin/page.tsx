import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? "Admin";

  return (
    <main className="admin-page admin-dashboard-page">
      <div className="admin-shell admin-dashboard-shell">
        <header className="admin-topbar admin-dashboard-topbar">
          <Link href="/" className="admin-auth-wordmark" aria-label="Back to portfolio">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>Arhaan Shaikh</span>
          </Link>

          <div className="admin-topbar-meta">
            <span><i className="admin-status-dot" aria-hidden="true" /> PRIVATE WORKSPACE</span>
            <Link className="admin-view-site" href="/">View public site ↗</Link>
            <form action="/auth/signout" method="post">
              <button type="submit">SIGN OUT ↗</button>
            </form>
          </div>
        </header>

        <section className="admin-dashboard-welcome">
          <div className="admin-dashboard-welcome-copy">
            <span className="admin-dashboard-eyebrow">PORTFOLIO MANAGEMENT / OVERVIEW</span>
            <h1>Your work,<br /><em>under control.</em></h1>
            <p>Manage the projects, experience, skills, and credentials shown on your portfolio from one place.</p>
          </div>
          <aside className="admin-dashboard-identity">
            <span className="admin-dashboard-eyebrow">SIGNED IN AS</span>
            <strong>{email}</strong>
            <div><i className="admin-status-dot" aria-hidden="true" /> Admin access verified</div>
          </aside>
        </section>

        <section className="admin-dashboard-overview" aria-label="Workspace overview">
          <div className="admin-overview-label">
            <span className="admin-dashboard-eyebrow">WORKSPACE OVERVIEW</span>
            <span>01 — 04</span>
          </div>
          <div className="admin-overview-metrics">
            <article><span>CONTENT AREAS</span><strong>04</strong><small>Manage your portfolio content</small></article>
            <article><span>DATABASE</span><strong className="admin-metric-word"><i className="admin-status-dot" aria-hidden="true" /> Connected</strong><small>Supabase connection active</small></article>
            <article><span>ACCESS</span><strong className="admin-metric-word">Verified</strong><small>Private admin session</small></article>
          </div>
        </section>

        <section className="admin-dashboard-modules" aria-label="Content management">
          <div className="admin-dashboard-section-heading">
            <div><span className="admin-dashboard-eyebrow">CONTENT MANAGEMENT</span><h2>Choose a workspace</h2></div>
            <p>Changes here are managed separately by content type.</p>
          </div>

          <div className="admin-module-grid">
            <article className="admin-module-card admin-module-card-active">
              <div className="admin-module-card-top"><span>01 / BUILD</span><span className="admin-module-symbol" aria-hidden="true">↗</span></div>
              <h3>Projects</h3>
              <p>Maintain case studies, descriptions, tags, status, and publishing visibility.</p>
              <Link className="admin-module-action" href="/admin/projects"><span>Manage projects</span><b aria-hidden="true">→</b></Link>
            </article>

            <article className="admin-module-card admin-module-card-active">
              <div className="admin-module-card-top"><span>02 / EXPERIENCE</span><span className="admin-module-symbol" aria-hidden="true">↗</span></div>
              <h3>Experience</h3>
              <p>Update roles, organizations, descriptions, display order, and visibility.</p>
              <Link className="admin-module-action" href="/admin/experience"><span>Manage experience</span><b aria-hidden="true">→</b></Link>
            </article>

            <article className="admin-module-card admin-module-card-active">
              <div className="admin-module-card-top"><span>03 / CAPABILITIES</span><span className="admin-module-symbol" aria-hidden="true">↗</span></div>
              <h3>Skills &amp; learning</h3>
              <p>Organize skill groups and learning areas, and control what appears publicly.</p>
              <Link className="admin-module-action" href="/admin/skills"><span>Manage skills &amp; learning</span><b aria-hidden="true">→</b></Link>
            </article>

            <article className="admin-module-card admin-module-card-active">
              <div className="admin-module-card-top"><span>04 / CREDENTIALS</span><span className="admin-module-symbol" aria-hidden="true">↗</span></div>
              <h3>Certifications</h3>
              <p>Keep formal credentials and virtual experience records organized in one place.</p>
              <Link className="admin-module-action" href="/admin/certifications"><span>Manage certifications</span><b aria-hidden="true">→</b></Link>
            </article>
          </div>
        </section>

        <footer className="admin-dashboard-footer admin-dashboard-bottom">
          <span>ARHAAN SHAIKH <b> / </b> ADMIN WORKSPACE</span>
          <span>PRIVATE SESSION <i className="admin-status-dot" aria-hidden="true" /></span>
        </footer>
      </div>
    </main>
  );
}

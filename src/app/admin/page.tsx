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
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <a href="/" className="admin-auth-wordmark" aria-label="Back to portfolio">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>Arhaan Shaikh</span>
          </a>

          <div className="admin-topbar-meta">
            <span>PRIVATE / ADMIN</span>
            <form action="/auth/signout" method="post">
              <button type="submit">SIGN OUT ↗</button>
            </form>
          </div>
        </header>

        <section className="admin-dashboard-intro">
          <div>
            <span className="admin-auth-label">Control room</span>
            <h1>Manage the portfolio.</h1>
            <p>
              Your private workspace is connected. Content management modules
              will be added here before the public site is migrated to Supabase.
            </p>
          </div>

          <div className="admin-session-card">
            <span>AUTHENTICATED AS</span>
            <strong>{email}</strong>
            <small>ADMIN ACCESS VERIFIED</small>
          </div>
        </section>

        <section className="admin-module-grid" aria-label="Admin modules">
          <article className="admin-module-card admin-module-card-active">
            <span>01</span>
            <h2>Projects</h2>
            <p>Case studies, project status, descriptions, tags, and publishing.</p>
            <Link className="admin-module-action" href="/admin/projects">
              MANAGE PROJECTS ↗
            </Link>
          </article>

          <article className="admin-module-card admin-module-card-active">
            <span>02</span>
            <h2>Experience</h2>
            <p>Roles, organizations, descriptions, ordering, and visibility.</p>
            <Link className="admin-module-action" href="/admin/experience">
              MANAGE EXPERIENCE ↗
            </Link>
          </article>

          <article className="admin-module-card">
            <span>03</span>
            <h2>Skills & learning</h2>
            <p>Skill groups, learning areas, and their public visibility.</p>
            <strong>COMING NEXT</strong>
          </article>

          <article className="admin-module-card">
            <span>04</span>
            <h2>Certifications</h2>
            <p>Credentials and virtual experiences managed from one place.</p>
            <strong>COMING NEXT</strong>
          </article>
        </section>

        <footer className="admin-dashboard-footer">
          <span>DATABASE CONNECTED</span>
          <a href="/">VIEW PUBLIC PORTFOLIO ↗</a>
        </footer>
      </div>
    </main>
  );
}

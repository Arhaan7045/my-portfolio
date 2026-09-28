import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectsManager } from "@/components/projects-manager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
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

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, category, status, description, details, tags, sort_order, is_published, created_at, updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <header className="admin-topbar">
            <Link href="/admin" className="admin-auth-wordmark" aria-label="Back to admin dashboard">
              <span className="wordmark-mark" aria-hidden="true" />
              <span>Arhaan Shaikh</span>
            </Link>
            <div className="admin-topbar-meta">
              <span>PRIVATE / ADMIN</span>
              <form action="/auth/signout" method="post">
                <button type="submit">SIGN OUT ↗</button>
              </form>
            </div>
          </header>

          <section className="admin-error-panel" role="alert">
            <span className="admin-auth-label">Database error</span>
            <h1>Projects could not be loaded.</h1>
            <p>{error.message}</p>
            <Link className="admin-secondary-action" href="/admin">
              ← Back to dashboard
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <Link href="/admin" className="admin-auth-wordmark" aria-label="Back to admin dashboard">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>Arhaan Shaikh</span>
          </Link>

          <div className="admin-topbar-meta">
            <span>PRIVATE / ADMIN / PROJECTS</span>
            <form action="/auth/signout" method="post">
              <button type="submit">SIGN OUT ↗</button>
            </form>
          </div>
        </header>

        <section className="admin-content-heading">
          <div>
            <Link className="admin-back-link" href="/admin">
              ← Control room
            </Link>
            <span className="admin-auth-label">01 / Projects</span>
            <h1>Manage projects.</h1>
            <p>
              Create and maintain the project records that will eventually power
              the public portfolio. Public pages still use the existing TypeScript
              data source.
            </p>
          </div>

          <div className="admin-count-card">
            <span>PROJECT RECORDS</span>
            <strong>{projects?.length ?? 0}</strong>
            <small>SUPABASE / RLS PROTECTED</small>
          </div>
        </section>

        <ProjectsManager projects={projects ?? []} />

        <footer className="admin-dashboard-footer admin-content-footer">
          <Link href="/admin">← BACK TO CONTROL ROOM</Link>
          <Link href="/">VIEW PUBLIC PORTFOLIO ↗</Link>
        </footer>
      </div>
    </main>
  );
}

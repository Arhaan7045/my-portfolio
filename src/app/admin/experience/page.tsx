import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { ExperienceManager } from "@/components/experience-manager";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const supabase = await requireAdmin();

  const { data: experience, error } = await supabase
    .from("experience")
    .select(
      "id, period, title, organization, description, sort_order, is_published, created_at, updated_at",
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
              <ThemeSwitcher />
              <form action="/auth/signout" method="post">
                <button type="submit">SIGN OUT ↗</button>
              </form>
            </div>
          </header>

          <section className="admin-error-panel" role="alert">
            <span className="admin-auth-label">Database error</span>
            <h1>Experience could not be loaded.</h1>
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
            <span>PRIVATE / ADMIN / EXPERIENCE</span>
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
            <span className="admin-auth-label">02 / Experience</span>
            <h1>Manage experience.</h1>
            <p>
              Maintain the roles, organizations, descriptions, ordering, and
              publishing state used by the portfolio experience section.
            </p>
          </div>

          <div className="admin-count-card">
            <span>EXPERIENCE RECORDS</span>
            <strong>{experience?.length ?? 0}</strong>
            <small>SUPABASE / RLS PROTECTED</small>
          </div>
        </section>

        <ExperienceManager experience={experience ?? []} />

        <footer className="admin-dashboard-footer admin-content-footer">
          <Link href="/admin">← BACK TO CONTROL ROOM</Link>
          <Link href="/">VIEW PUBLIC PORTFOLIO ↗</Link>
        </footer>
      </div>
    </main>
  );
}

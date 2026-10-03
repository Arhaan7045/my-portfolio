import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { SkillsManager } from "@/components/skills-manager";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const supabase = await requireAdmin();

  const [{ data: skillGroups, error: skillError }, { data: learningAreas, error: learningError }] =
    await Promise.all([
      supabase
        .from("skill_groups")
        .select("id, title, skills, sort_order, is_published, created_at, updated_at")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("learning_areas")
        .select("id, title, description, sort_order, is_published, created_at, updated_at")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  const error = skillError ?? learningError;

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <header className="admin-topbar">
            <Link href="/admin" className="admin-auth-wordmark">
              <span className="wordmark-mark" aria-hidden="true" />
              <span>Arhaan Shaikh</span>
            </Link>
            <div className="admin-topbar-meta">
              <span>PRIVATE / ADMIN</span>
              <ThemeSwitcher />
              <form action="/auth/signout" method="post"><button type="submit">SIGN OUT ↗</button></form>
            </div>
          </header>
          <section className="admin-error-panel" role="alert">
            <span className="admin-auth-label">Database error</span>
            <h1>Skills & learning could not be loaded.</h1>
            <p>{error.message}</p>
            <Link className="admin-secondary-action" href="/admin">← Back to dashboard</Link>
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
            <span>PRIVATE / ADMIN / SKILLS</span>
            <form action="/auth/signout" method="post"><button type="submit">SIGN OUT ↗</button></form>
          </div>
        </header>

        <section className="admin-content-heading">
          <div>
            <Link className="admin-back-link" href="/admin">← Control room</Link>
            <span className="admin-auth-label">03 / Skills & learning</span>
            <h1>Manage skills & learning.</h1>
            <p>Maintain skill groups and learning areas independently from the public site while the CMS is being built.</p>
          </div>
          <div className="admin-count-card">
            <span>CONTENT RECORDS</span>
            <strong>{(skillGroups?.length ?? 0) + (learningAreas?.length ?? 0)}</strong>
            <small>SKILLS + LEARNING / RLS PROTECTED</small>
          </div>
        </section>

        <SkillsManager skillGroups={skillGroups ?? []} learningAreas={learningAreas ?? []} />

        <footer className="admin-dashboard-footer admin-content-footer">
          <Link href="/admin">← BACK TO CONTROL ROOM</Link>
          <Link href="/">VIEW PUBLIC PORTFOLIO ↗</Link>
        </footer>
      </div>
    </main>
  );
}

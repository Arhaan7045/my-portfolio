import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CertificationsManager } from "@/components/certifications-manager";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (!admin) redirect("/admin/login");

  const { data: certifications, error } = await supabase
    .from("certifications")
    .select("id, title, issuer, description, certificate_url, type, sort_order, is_published, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return <main className="admin-page"><div className="admin-shell">
      <header className="admin-topbar"><Link href="/admin" className="admin-auth-wordmark"><span className="wordmark-mark" aria-hidden="true"/><span>Arhaan Shaikh</span></Link><div className="admin-topbar-meta"><span>PRIVATE / ADMIN</span><form action="/auth/signout" method="post"><button type="submit">SIGN OUT ↗</button></form></div></header>
      <section className="admin-error-panel" role="alert"><span className="admin-auth-label">Database error</span><h1>Certifications could not be loaded.</h1><p>{error.message}</p><Link className="admin-secondary-action" href="/admin">← Back to dashboard</Link></section>
    </div></main>;
  }

  return <main className="admin-page"><div className="admin-shell">
    <header className="admin-topbar"><Link href="/admin" className="admin-auth-wordmark"><span className="wordmark-mark" aria-hidden="true"/><span>Arhaan Shaikh</span></Link><div className="admin-topbar-meta"><span>PRIVATE / ADMIN / CERTIFICATIONS</span><form action="/auth/signout" method="post"><button type="submit">SIGN OUT ↗</button></form></div></header>
    <section className="admin-content-heading"><div><Link className="admin-back-link" href="/admin">← Control room</Link><span className="admin-auth-label">04 / Certifications</span><h1>Manage certifications.</h1><p>Manage formal credentials and virtual experiences from one private content library.</p></div><div className="admin-count-card"><span>CREDENTIAL RECORDS</span><strong>{certifications?.length ?? 0}</strong><small>SUPABASE / RLS PROTECTED</small></div></section>
    <CertificationsManager certifications={certifications ?? []}/>
    <footer className="admin-dashboard-footer admin-content-footer"><Link href="/admin">← BACK TO CONTROL ROOM</Link><Link href="/">VIEW PUBLIC PORTFOLIO ↗</Link></footer>
  </div></main>;
}

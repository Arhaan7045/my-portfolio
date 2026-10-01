import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin-login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (claimsData?.claims?.sub) {
    const { data: admin } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", claimsData.claims.sub)
      .maybeSingle();

    if (admin) {
      redirect("/admin");
    }
  }

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-shell">
        <div className="admin-auth-brand">
          <Link href="/" className="admin-auth-wordmark" aria-label="Back to portfolio">
            <span className="wordmark-mark" aria-hidden="true" />
            <span>Arhaan Shaikh</span>
          </Link>
          <span className="admin-auth-code">PRIVATE / ADMIN</span>
        </div>

        <section className="admin-auth-card" aria-labelledby="admin-login-title">
          <div className="admin-auth-kicker">
            <span>CONTROL ROOM</span>
            <span>01 / 01</span>
          </div>

          <div className="admin-auth-heading">
            <span className="admin-auth-label">Private access</span>
            <h1 id="admin-login-title">Welcome back.</h1>
            <p>
              Sign in to manage the content that appears across your portfolio.
            </p>
          </div>

          <AdminLoginForm />

          <div className="admin-auth-footer">
            <Link href="/">← Back to portfolio</Link>
            <span>AUTHENTICATED ACCESS ONLY</span>
          </div>
        </section>
      </div>
    </main>
  );
}

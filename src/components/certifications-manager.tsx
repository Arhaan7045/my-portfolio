"use client";

import { useState, type FormEvent } from "react";
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog";
import { createCertification, deleteCertification, toggleCertificationPublished, updateCertification } from "@/app/admin/certifications/actions";

type Certification = { id: string; title: string; issuer: string; description: string; certificate_url: string | null; type: string; sort_order: number; is_published: boolean; created_at: string; updated_at: string };
type Form = { title: string; issuer: string; description: string; certificateUrl: string; type: string; sortOrder: string; isPublished: boolean };
const empty: Form = { title: "", issuer: "", description: "", certificateUrl: "", type: "formal", sortOrder: "1", isPublished: true };
const date = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function CertificationsManager({ certifications }: { certifications: Certification[] }) {
  const [open, setOpen] = useState(certifications.length === 0);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Certification | null>(null);

  const reset = () => {
    setEditing(null);
    setForm(empty);
    setOpen(false);
    setError("");
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editing) await updateCertification(editing, form);
      else await createCertification(form);
      reset();
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function requestDelete(item: Certification) {
    setPendingDelete(item);
  }

  async function deleteConfirmed() {
    if (!pendingDelete) return;
    setBusy(true);
    setError("");
    try {
      await deleteCertification(pendingDelete.id);
      setPendingDelete(null);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function toggle(item: Certification) {
    setBusy(true);
    setError("");
    try {
      await toggleCertificationPublished(item.id, !item.is_published);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <section className="admin-projects-section" aria-label="Certification management">
      <div className="admin-projects-toolbar">
        <div><span className="admin-auth-label">Credential library</span><p>Formal certificates and virtual experiences use the same database with a type field.</p></div>
        <button className="admin-primary-action" type="button" onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}>+ ADD CREDENTIAL</button>
      </div>
      {error ? <p className="admin-login-error" role="alert">{error}</p> : null}

      {open ? (
        <form className="admin-project-form" onSubmit={submit}>
          <div className="admin-project-form-head">
            <div><span className="admin-auth-label">{editing ? "Edit credential" : "New credential"}</span><h2>{editing ? "Update credential." : "Add a credential."}</h2></div>
            <button className="admin-ghost-action" type="button" onClick={reset} disabled={busy}>CANCEL</button>
          </div>
          <div className="admin-form-grid">
            <label><span>Title</span><input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Google Cybersecurity Professional Certificate" required /></label>
            <label><span>Issuer / platform</span><input value={form.issuer} onChange={event => setForm({ ...form, issuer: event.target.value })} placeholder="Google / Coursera" required /></label>
            <label><span>Type</span><select value={form.type} onChange={event => setForm({ ...form, type: event.target.value })}><option value="formal">Formal certification</option><option value="virtual">Virtual experience</option></select></label>
            <label><span>Sort order</span><input type="number" min={1} value={form.sortOrder} onChange={event => setForm({ ...form, sortOrder: event.target.value })} /></label>
            <label className="admin-form-wide"><span>Description</span><textarea rows={6} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="What was completed and what it covered..." /></label>
            <label className="admin-form-wide"><span>Certificate URL (optional)</span><input type="url" value={form.certificateUrl} onChange={event => setForm({ ...form, certificateUrl: event.target.value })} placeholder="https://..." /><small className="admin-field-help">Paste a shareable certificate link or a URL to the certificate file. It will appear as a View certificate link on your public portfolio.</small></label>
          </div>
          <label className="admin-checkbox-row"><input type="checkbox" checked={form.isPublished} onChange={event => setForm({ ...form, isPublished: event.target.checked })} /><span><strong>Published</strong><small>Visible to the public after migration.</small></span></label>
          <div className="admin-project-form-actions"><button className="admin-primary-action" disabled={busy}>{busy ? "SAVING..." : editing ? "SAVE CHANGES ↗" : "CREATE CREDENTIAL ↗"}</button></div>
        </form>
      ) : null}

      {certifications.length === 0 ? (
        <div className="admin-empty-state"><span>NO CREDENTIAL RECORDS</span><h2>Your credential library is empty.</h2><p>Add certifications and virtual experiences here.</p><button className="admin-primary-action" type="button" onClick={() => setOpen(true)}>+ ADD FIRST CREDENTIAL</button></div>
      ) : (
        <div className="admin-project-list">
          {certifications.map((item, index) => (
            <article className="admin-project-card" key={item.id}>
              <div className="admin-project-index"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.is_published ? "PUBLISHED" : "DRAFT"}</small></div>
              <div className="admin-project-main">
                <div className="admin-project-card-head"><div><span>{item.type.toUpperCase()}</span><h2>{item.title}</h2></div><strong>{item.issuer}</strong></div>
                <p>{item.description || "No description added yet."}</p>
                {item.certificate_url ? <a className="admin-credential-view-link" href={item.certificate_url} target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a> : null}
                <div className="admin-project-meta"><span>ORDER {Math.max(1, item.sort_order)}</span><span>UPDATED {date(item.updated_at)}</span></div>
              </div>
              <div className="admin-project-actions">
                <button className="admin-ghost-action" type="button" onClick={() => { setEditing(item.id); setForm({ title: item.title, issuer: item.issuer, description: item.description, certificateUrl: item.certificate_url ?? "", type: item.type, sortOrder: String(Math.max(1, item.sort_order)), isPublished: item.is_published }); setOpen(true); }} disabled={busy}>EDIT</button>
                <button className="admin-ghost-action" type="button" onClick={() => toggle(item)} disabled={busy}>{item.is_published ? "UNPUBLISH" : "PUBLISH"}</button>
                <button className="admin-danger-action" type="button" onClick={() => requestDelete(item)} disabled={busy}>DELETE</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete “${pendingDelete.title}”?` : "Delete credential?"}
        description="This will permanently remove this credential and close its position in the credential order. This action cannot be undone."
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={deleteConfirmed}
      />
    </section>
  );
}

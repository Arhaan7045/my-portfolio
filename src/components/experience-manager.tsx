"use client";

import { useState, type FormEvent } from "react";
import {
  createExperience,
  deleteExperience,
  toggleExperiencePublished,
  updateExperience,
} from "@/app/admin/experience/actions";

type Experience = {
  id: string;
  period: string;
  title: string;
  organization: string;
  description: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type ExperienceFormState = {
  period: string;
  title: string;
  organization: string;
  description: string;
  sortOrder: string;
  isPublished: boolean;
};

const emptyForm: ExperienceFormState = {
  period: "",
  title: "",
  organization: "",
  description: "",
  sortOrder: "0",
  isPublished: true,
};

function toForm(item: Experience): ExperienceFormState {
  return {
    period: item.period,
    title: item.title,
    organization: item.organization,
    description: item.description,
    sortOrder: String(item.sort_order),
    isPublished: item.is_published,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ExperienceManager({ experience }: { experience: Experience[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(experience.length === 0);
  const [form, setForm] = useState<ExperienceFormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(false);
    setError("");
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(item: Experience) {
    setEditingId(item.id);
    setForm(toForm(item));
    setError("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateField<K extends keyof ExperienceFormState>(
    key: K,
    value: ExperienceFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (editingId) {
        await updateExperience(editingId, form);
      } else {
        await createExperience(form);
      }

      resetForm();
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: Experience) {
    if (!window.confirm(`Delete “${item.title}” at ${item.organization}? This cannot be undone.`)) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      await deleteExperience(item.id);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function handleToggle(item: Experience) {
    setBusy(true);
    setError("");

    try {
      await toggleExperiencePublished(item.id, !item.is_published);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <section className="admin-projects-section" aria-label="Experience management">
      <div className="admin-projects-toolbar">
        <div>
          <span className="admin-auth-label">Experience library</span>
          <p>
            Manage roles independently from the public site while the CMS is
            being built.
          </p>
        </div>

        <button className="admin-primary-action" type="button" onClick={openCreate}>
          + ADD EXPERIENCE
        </button>
      </div>

      {error ? (
        <p className="admin-login-error" role="alert">
          {error}
        </p>
      ) : null}

      {formOpen ? (
        <form className="admin-project-form" onSubmit={handleSubmit}>
          <div className="admin-project-form-head">
            <div>
              <span className="admin-auth-label">
                {editingId ? "Edit experience" : "New experience"}
              </span>
              <h2>{editingId ? "Update experience." : "Add experience."}</h2>
            </div>
            <button
              className="admin-ghost-action"
              type="button"
              onClick={resetForm}
              disabled={busy}
            >
              CANCEL
            </button>
          </div>

          <div className="admin-form-grid">
            <label>
              <span>Period</span>
              <input
                value={form.period}
                onChange={(event) => updateField("period", event.target.value)}
                placeholder="Current / Sep 2026 — Present"
                required
              />
            </label>

            <label>
              <span>Role / title</span>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="VAPT Intern"
                required
              />
            </label>

            <label>
              <span>Organization</span>
              <input
                value={form.organization}
                onChange={(event) =>
                  updateField("organization", event.target.value)
                }
                placeholder="AeroTrace Forensics"
                required
              />
            </label>

            <label>
              <span>Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) => updateField("sortOrder", event.target.value)}
              />
            </label>

            <label className="admin-form-wide">
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={6}
                placeholder="Describe the role, responsibilities, and relevant experience..."
              />
            </label>
          </div>

          <label className="admin-checkbox-row">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                updateField("isPublished", event.target.checked)
              }
            />
            <span>
              <strong>Published</strong>
              <small>Published records can be read by public visitors once the public site is migrated.</small>
            </span>
          </label>

          <div className="admin-project-form-actions">
            <button className="admin-primary-action" type="submit" disabled={busy}>
              {busy ? "SAVING..." : editingId ? "SAVE CHANGES ↗" : "CREATE EXPERIENCE ↗"}
            </button>
          </div>
        </form>
      ) : null}

      {experience.length === 0 ? (
        <div className="admin-empty-state">
          <span>NO EXPERIENCE RECORDS</span>
          <h2>Your experience library is empty.</h2>
          <p>
            Add your first role here. It will be stored in Supabase but will not
            change the public portfolio yet.
          </p>
          <button className="admin-primary-action" type="button" onClick={openCreate}>
            + ADD FIRST EXPERIENCE
          </button>
        </div>
      ) : (
        <div className="admin-project-list">
          {experience.map((item, index) => (
            <article className="admin-project-card" key={item.id}>
              <div className="admin-project-index">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{item.is_published ? "PUBLISHED" : "DRAFT"}</small>
              </div>

              <div className="admin-project-main">
                <div className="admin-project-card-head">
                  <div>
                    <span>{item.period}</span>
                    <h2>{item.title}</h2>
                  </div>
                  <strong>{item.organization}</strong>
                </div>

                <p>{item.description || "No description added yet."}</p>

                <div className="admin-project-meta">
                  <span>ORDER {item.sort_order}</span>
                  <span>UPDATED {formatDate(item.updated_at)}</span>
                </div>
              </div>

              <div className="admin-project-actions">
                <button
                  className="admin-ghost-action"
                  type="button"
                  onClick={() => openEdit(item)}
                  disabled={busy}
                >
                  EDIT
                </button>
                <button
                  className="admin-ghost-action"
                  type="button"
                  onClick={() => handleToggle(item)}
                  disabled={busy}
                >
                  {item.is_published ? "UNPUBLISH" : "PUBLISH"}
                </button>
                <button
                  className="admin-danger-action"
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={busy}
                >
                  DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

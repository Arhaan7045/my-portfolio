"use client";

import { useState, type FormEvent } from "react";
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog";
import {
  createProject,
  deleteProject,
  toggleProjectPublished,
  updateProject,
} from "@/app/admin/projects/actions";

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  description: string;
  details: string;
  tags: string[] | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type ProjectFormState = {
  slug: string;
  title: string;
  category: string;
  status: string;
  description: string;
  details: string;
  tags: string;
  sortOrder: string;
  isPublished: boolean;
};

const emptyForm: ProjectFormState = {
  slug: "",
  title: "",
  category: "",
  status: "IN PROGRESS",
  description: "",
  details: "",
  tags: "",
  sortOrder: "1",
  isPublished: true,
};

function toForm(project: Project): ProjectFormState {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    status: project.status,
    description: project.description,
    details: project.details,
    tags: (project.tags ?? []).join(", "),
    sortOrder: String(Math.max(1, project.sort_order)),
    isPublished: project.is_published,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(projects.length === 0);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

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
    setMessage("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm(toForm(project));
    setError("");
    setMessage("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateField<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await updateProject(editingId, form);
        setMessage("Project updated successfully.");
      } else {
        await createProject(form);
        setMessage("Project created successfully.");
      }

      resetForm();
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function requestDelete(project: Project) {
    setPendingDelete(project);
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    setBusy(true);
    setError("");
    try {
      await deleteProject(pendingDelete.id);
      setPendingDelete(null);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function handleToggle(project: Project) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await toggleProjectPublished(project.id, !project.is_published);
      setMessage(
        project.is_published
          ? "Project unpublished."
          : "Project published.",
      );
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <section className="admin-projects-section" aria-label="Project management">
      <div className="admin-projects-toolbar">
        <div>
          <span className="admin-auth-label">Project library</span>
          <p>
            Manage records independently from the public site while the CMS is
            being built.
          </p>
        </div>

        <button className="admin-primary-action" type="button" onClick={openCreate}>
          + ADD PROJECT
        </button>
      </div>

      {message ? (
        <p className="admin-success-message" role="status">
          {message}
        </p>
      ) : null}

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
                {editingId ? "Edit project" : "New project"}
              </span>
              <h2>{editingId ? "Update project." : "Add a project."}</h2>
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
              <span>Title</span>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Project title"
                required
              />
            </label>

            <label>
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="project-slug"
                required
              />
            </label>

            <label>
              <span>Category</span>
              <input
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="VAPT / Internship Project"
                required
              />
            </label>

            <label>
              <span>Status</span>
              <input
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                placeholder="IN PROGRESS"
              />
            </label>

            <label className="admin-form-wide">
              <span>Short description</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={4}
                placeholder="Short project description..."
              />
            </label>

            <label className="admin-form-wide">
              <span>Documentation / project notes</span>
              <textarea
                value={form.details}
                onChange={(event) => updateField("details", event.target.value)}
                rows={6}
                placeholder="Overview, methodology, findings, evidence, remediation, or current project notes..."
              />
            </label>

            <label>
              <span>Tags</span>
              <input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="VAPT, WEB SECURITY, BURP SUITE"
              />
              <small>Separate tags with commas.</small>
            </label>

            <label>
              <span>Sort order</span>
              <input
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(event) => updateField("sortOrder", event.target.value)}
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
              {busy ? "SAVING..." : editingId ? "SAVE CHANGES ↗" : "CREATE PROJECT ↗"}
            </button>
          </div>
        </form>
      ) : null}

      {projects.length === 0 ? (
        <div className="admin-empty-state">
          <span>NO PROJECT RECORDS</span>
          <h2>Your project library is empty.</h2>
          <p>
            Add your first project here. It will be stored in Supabase but will
            not change the public portfolio yet.
          </p>
          <button className="admin-primary-action" type="button" onClick={openCreate}>
            + ADD FIRST PROJECT
          </button>
        </div>
      ) : (
        <div className="admin-project-list">
          {projects.map((project, index) => (
            <article className="admin-project-card" key={project.id}>
              <div className="admin-project-index">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{project.is_published ? "PUBLISHED" : "DRAFT"}</small>
              </div>

              <div className="admin-project-main">
                <div className="admin-project-card-head">
                  <div>
                    <span>{project.category}</span>
                    <h2>{project.title}</h2>
                  </div>
                  <strong>{project.status}</strong>
                </div>

                <p>{project.description || "No description added yet."}</p>

                <div className="admin-project-meta">
                  <span>/{project.slug}</span>
                  <span>ORDER {project.sort_order}</span>
                  <span>UPDATED {formatDate(project.updated_at)}</span>
                </div>

                {project.tags?.length ? (
                  <div className="admin-project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="admin-project-actions">
                <button
                  className="admin-ghost-action"
                  type="button"
                  onClick={() => openEdit(project)}
                  disabled={busy}
                >
                  EDIT
                </button>
                <button
                  className="admin-ghost-action"
                  type="button"
                  onClick={() => handleToggle(project)}
                  disabled={busy}
                >
                  {project.is_published ? "UNPUBLISH" : "PUBLISH"}
                </button>
                <button
                  className="admin-danger-action"
                  type="button"
                  onClick={() => requestDelete(project)}
                  disabled={busy}
                >
                  DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <AdminConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete “${pendingDelete.title}”?` : "Delete project?"}
        description="This will permanently remove the project and close its position in the project order. This action cannot be undone."
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  );
}

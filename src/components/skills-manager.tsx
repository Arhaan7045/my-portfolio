"use client";

import { useState, type FormEvent } from "react";
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog";
import {
  createLearningArea,
  createSkillGroup,
  deleteLearningArea,
  deleteSkillGroup,
  toggleLearningAreaPublished,
  toggleSkillGroupPublished,
  updateLearningArea,
  updateSkillGroup,
} from "@/app/admin/skills/actions";

type SkillGroup = { id: string; title: string; skills: string[]; sort_order: number; is_published: boolean; created_at: string; updated_at: string };
type LearningArea = { id: string; title: string; description: string; sort_order: number; is_published: boolean; created_at: string; updated_at: string };
type SkillForm = { title: string; skills: string; sortOrder: string; isPublished: boolean };
type LearningForm = { title: string; description: string; sortOrder: string; isPublished: boolean };

const emptySkill: SkillForm = { title: "", skills: "", sortOrder: "1", isPublished: true };
const emptyLearning: LearningForm = { title: "", description: "", sortOrder: "1", isPublished: true };

function date(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function SkillsManager({
  skillGroups,
  learningAreas,
}: {
  skillGroups: SkillGroup[];
  learningAreas: LearningArea[];
}) {
  const [skillFormOpen, setSkillFormOpen] = useState(skillGroups.length === 0);
  const [learningFormOpen, setLearningFormOpen] = useState(learningAreas.length === 0);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingLearning, setEditingLearning] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [learningForm, setLearningForm] = useState(emptyLearning);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "skill" | "learning"; item: SkillGroup | LearningArea } | null
  >(null);

  const resetSkill = () => {
    setEditingSkill(null);
    setSkillForm(emptySkill);
    setSkillFormOpen(false);
  };

  const resetLearning = () => {
    setEditingLearning(null);
    setLearningForm(emptyLearning);
    setLearningFormOpen(false);
  };

  async function submitSkill(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingSkill) await updateSkillGroup(editingSkill, skillForm);
      else await createSkillGroup(skillForm);
      resetSkill();
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function submitLearning(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingLearning) await updateLearningArea(editingLearning, learningForm);
      else await createLearningArea(learningForm);
      resetLearning();
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function requestDeleteSkill(item: SkillGroup) {
    setPendingDelete({ kind: "skill", item });
  }

  function requestDeleteLearning(item: LearningArea) {
    setPendingDelete({ kind: "learning", item });
  }

  async function deleteConfirmed() {
    if (!pendingDelete) return;
    setBusy(true);
    setError("");
    try {
      if (pendingDelete.kind === "skill") await deleteSkillGroup(pendingDelete.item.id);
      else await deleteLearningArea(pendingDelete.item.id);
      setPendingDelete(null);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function toggleSkill(item: SkillGroup) {
    setBusy(true);
    setError("");
    try {
      await toggleSkillGroupPublished(item.id, !item.is_published);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function toggleLearning(item: LearningArea) {
    setBusy(true);
    setError("");
    try {
      await toggleLearningAreaPublished(item.id, !item.is_published);
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <section className="admin-projects-section" aria-label="Skills and learning management">
      {error ? <p className="admin-login-error" role="alert">{error}</p> : null}

      <div className="admin-projects-toolbar">
        <div>
          <span className="admin-auth-label">Skill groups</span>
          <p>Group the technical skills shown on the portfolio.</p>
        </div>
        <button className="admin-primary-action" type="button" onClick={() => {
          setSkillForm(emptySkill);
          setEditingSkill(null);
          setSkillFormOpen(true);
        }}>+ ADD SKILL GROUP</button>
      </div>

      {skillFormOpen ? (
        <form className="admin-project-form" onSubmit={submitSkill}>
          <div className="admin-project-form-head">
            <div>
              <span className="admin-auth-label">{editingSkill ? "Edit skill group" : "New skill group"}</span>
              <h2>{editingSkill ? "Update skill group." : "Add a skill group."}</h2>
            </div>
            <button className="admin-ghost-action" type="button" onClick={resetSkill} disabled={busy}>CANCEL</button>
          </div>
          <div className="admin-form-grid">
            <label>
              <span>Group title</span>
              <input value={skillForm.title} onChange={event => setSkillForm({ ...skillForm, title: event.target.value })} placeholder="Cybersecurity" required />
            </label>
            <label>
              <span>Sort order</span>
              <input type="number" min={1} value={skillForm.sortOrder} onChange={event => setSkillForm({ ...skillForm, sortOrder: event.target.value })} />
            </label>
            <label className="admin-form-wide">
              <span>Skills</span>
              <input value={skillForm.skills} onChange={event => setSkillForm({ ...skillForm, skills: event.target.value })} placeholder="VAPT, OWASP, Web Application Security" />
              <small>Separate skills with commas.</small>
            </label>
          </div>
          <label className="admin-checkbox-row">
            <input type="checkbox" checked={skillForm.isPublished} onChange={event => setSkillForm({ ...skillForm, isPublished: event.target.checked })} />
            <span><strong>Published</strong><small>Visible to the public after migration.</small></span>
          </label>
          <div className="admin-project-form-actions">
            <button className="admin-primary-action" disabled={busy}>{busy ? "SAVING..." : editingSkill ? "SAVE CHANGES ↗" : "CREATE SKILL GROUP ↗"}</button>
          </div>
        </form>
      ) : null}

      {skillGroups.length === 0 ? (
        <div className="admin-empty-state">
          <span>NO SKILL GROUPS</span><h2>Your skill library is empty.</h2><p>Add your first skill group here.</p>
          <button className="admin-primary-action" type="button" onClick={() => setSkillFormOpen(true)}>+ ADD FIRST SKILL GROUP</button>
        </div>
      ) : (
        <div className="admin-project-list">
          {skillGroups.map((item, index) => (
            <article className="admin-project-card" key={item.id}>
              <div className="admin-project-index"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.is_published ? "PUBLISHED" : "DRAFT"}</small></div>
              <div className="admin-project-main">
                <div className="admin-project-card-head"><div><span>SKILL GROUP</span><h2>{item.title}</h2></div><strong>ORDER {Math.max(1, item.sort_order)}</strong></div>
                <div className="admin-project-tags">{item.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
                <div className="admin-project-meta"><span>UPDATED {date(item.updated_at)}</span></div>
              </div>
              <div className="admin-project-actions">
                <button className="admin-ghost-action" type="button" onClick={() => {
                  setEditingSkill(item.id);
                  setSkillForm({ title: item.title, skills: item.skills.join(", "), sortOrder: String(Math.max(1, item.sort_order)), isPublished: item.is_published });
                  setSkillFormOpen(true);
                }} disabled={busy}>EDIT</button>
                <button className="admin-ghost-action" type="button" onClick={() => toggleSkill(item)} disabled={busy}>{item.is_published ? "UNPUBLISH" : "PUBLISH"}</button>
                <button className="admin-danger-action" type="button" onClick={() => requestDeleteSkill(item)} disabled={busy}>DELETE</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="admin-projects-toolbar" style={{ marginTop: "3rem" }}>
        <div><span className="admin-auth-label">Learning areas</span><p>Track the cybersecurity subjects currently being developed.</p></div>
        <button className="admin-primary-action" type="button" onClick={() => {
          setLearningForm(emptyLearning);
          setEditingLearning(null);
          setLearningFormOpen(true);
        }}>+ ADD LEARNING AREA</button>
      </div>

      {learningFormOpen ? (
        <form className="admin-project-form" onSubmit={submitLearning}>
          <div className="admin-project-form-head">
            <div><span className="admin-auth-label">{editingLearning ? "Edit learning area" : "New learning area"}</span><h2>{editingLearning ? "Update learning area." : "Add a learning area."}</h2></div>
            <button className="admin-ghost-action" type="button" onClick={resetLearning} disabled={busy}>CANCEL</button>
          </div>
          <div className="admin-form-grid">
            <label><span>Title</span><input value={learningForm.title} onChange={event => setLearningForm({ ...learningForm, title: event.target.value })} placeholder="Web Application Security" required /></label>
            <label><span>Sort order</span><input type="number" min={1} value={learningForm.sortOrder} onChange={event => setLearningForm({ ...learningForm, sortOrder: event.target.value })} /></label>
            <label className="admin-form-wide"><span>Description</span><textarea rows={5} value={learningForm.description} onChange={event => setLearningForm({ ...learningForm, description: event.target.value })} placeholder="What you are currently learning..." /></label>
          </div>
          <label className="admin-checkbox-row"><input type="checkbox" checked={learningForm.isPublished} onChange={event => setLearningForm({ ...learningForm, isPublished: event.target.checked })} /><span><strong>Published</strong><small>Visible to the public after migration.</small></span></label>
          <div className="admin-project-form-actions"><button className="admin-primary-action" disabled={busy}>{busy ? "SAVING..." : editingLearning ? "SAVE CHANGES ↗" : "CREATE LEARNING AREA ↗"}</button></div>
        </form>
      ) : null}

      {learningAreas.length === 0 ? (
        <div className="admin-empty-state">
          <span>NO LEARNING AREAS</span><h2>Your learning library is empty.</h2><p>Add your first learning area here.</p>
          <button className="admin-primary-action" type="button" onClick={() => setLearningFormOpen(true)}>+ ADD FIRST LEARNING AREA</button>
        </div>
      ) : (
        <div className="admin-project-list">
          {learningAreas.map((item, index) => (
            <article className="admin-project-card" key={item.id}>
              <div className="admin-project-index"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.is_published ? "PUBLISHED" : "DRAFT"}</small></div>
              <div className="admin-project-main">
                <div className="admin-project-card-head"><div><span>LEARNING AREA</span><h2>{item.title}</h2></div><strong>ORDER {Math.max(1, item.sort_order)}</strong></div>
                <p>{item.description || "No description added yet."}</p>
                <div className="admin-project-meta"><span>UPDATED {date(item.updated_at)}</span></div>
              </div>
              <div className="admin-project-actions">
                <button className="admin-ghost-action" type="button" onClick={() => {
                  setEditingLearning(item.id);
                  setLearningForm({ title: item.title, description: item.description, sortOrder: String(Math.max(1, item.sort_order)), isPublished: item.is_published });
                  setLearningFormOpen(true);
                }} disabled={busy}>EDIT</button>
                <button className="admin-ghost-action" type="button" onClick={() => toggleLearning(item)} disabled={busy}>{item.is_published ? "UNPUBLISH" : "PUBLISH"}</button>
                <button className="admin-danger-action" type="button" onClick={() => requestDeleteLearning(item)} disabled={busy}>DELETE</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete “${pendingDelete.item.title}”?` : "Delete record?"}
        description={pendingDelete ? `This will permanently remove the ${pendingDelete.kind === "skill" ? "skill group" : "learning area"} and close its position in that order. This action cannot be undone.` : ""}
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={deleteConfirmed}
      />
    </section>
  );
}

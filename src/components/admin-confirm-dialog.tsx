"use client";

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "DELETE",
  busy = false,
  onCancel,
  onConfirm,
}: AdminConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="admin-confirm-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="admin-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="admin-confirm-kicker">DESTRUCTIVE ACTION</span>
        <h2 id="admin-confirm-title">{title}</h2>
        <p id="admin-confirm-description">{description}</p>
        <div className="admin-confirm-actions">
          <button className="admin-ghost-action" type="button" onClick={onCancel} disabled={busy}>
            CANCEL
          </button>
          <button className="admin-danger-action" type="button" onClick={onConfirm} disabled={busy}>
            {busy ? "DELETING..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

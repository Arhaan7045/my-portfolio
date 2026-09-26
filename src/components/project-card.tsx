"use client";

import { useState } from "react";

type Project = {
  title: string;
  category: string;
  status: string;
  description: string;
  details: string;
  tags: readonly string[];
};

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = `project-details-${index}`;

  return (
    <article className={`project-card reveal${open ? " project-card-open" : ""}`}>
      <div className="project-card-summary">
        <div className="project-card-meta">
          <span>0{index + 1}</span>
          <span>{project.status}</span>
        </div>

        <div className="project-card-heading">
          <div>
            <p className="project-card-category">{project.category}</p>
            <h3>{project.title}</h3>
          </div>

          <button
            type="button"
            className="project-card-toggle"
            onPointerUp={(event) => {
              if (event.pointerType === "touch") {
                event.preventDefault();
                setOpen((value) => !value);
              }
            }}
            onClick={(event) => {
              if (event.detail !== 0) {
                setOpen((value) => !value);
              }
            }}
            aria-expanded={open}
            aria-controls={detailsId}
            aria-label={open ? "Close project notes" : "Open project notes"}
          >
            <span aria-hidden="true">{open ? "×" : "+"}</span>
          </button>
        </div>

        <p className="project-card-description">{project.description}</p>

        <div className="project-card-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div
        id={detailsId}
        className={`project-card-details-shell${open ? " project-card-details-shell-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="project-card-details">
          <span>PROJECT NOTES</span>
          <p>{project.details}</p>
          <span className="project-card-detail-status">
            DOCUMENTATION IN PROGRESS
          </span>
        </div>
      </div>
    </article>
  );
}

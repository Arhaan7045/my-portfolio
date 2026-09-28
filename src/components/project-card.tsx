"use client";

import Link from "next/link";

export type Project = {
  title: string;
  category: string;
  status: string;
  slug: string;
  description: string;
  details: string;
  tags: readonly string[];
};

type ProjectCardProps = {
  project: Project;
  index: number;
  isOpen: boolean;
  isDesktop: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

export function ProjectCard({
  project,
  index,
  isOpen,
  isDesktop,
  onOpen,
  onClose,
  onToggle,
}: ProjectCardProps) {
  return (
    <article
      className={`project-card reveal${isOpen ? " is-open" : ""}`}
      onMouseEnter={isDesktop ? onOpen : undefined}
      onMouseLeave={isDesktop ? onClose : undefined}
    >
      <button
        type="button"
        className="project-card-summary"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="project-card-meta">
          <span>0{index + 1}</span>
          <span>{project.status}</span>
        </span>

        <span className="project-card-heading">
          <span>
            <span className="project-card-category">{project.category}</span>
            <span className="project-card-title">{project.title}</span>
          </span>

          <span className="project-card-toggle" aria-hidden="true">
            <span>+</span>
          </span>
        </span>

        <span className="project-card-description">{project.description}</span>

        <span className="project-card-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
      </button>

      <div className="project-card-details-shell" aria-hidden={!isOpen}>
        <div className="project-card-details">
          <span>PROJECT DOCUMENTATION</span>
          <p>{project.details}</p>
          <Link className="project-card-case-study" href={`/projects/${project.slug}`}>
            VIEW CASE STUDY <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

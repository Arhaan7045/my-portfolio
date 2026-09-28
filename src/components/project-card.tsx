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
    <details
      className="project-card reveal"
      open={isOpen}
      onMouseEnter={isDesktop ? onOpen : undefined}
      onMouseLeave={isDesktop ? onClose : undefined}
    >
      <summary
        className="project-card-summary"
        onClick={(event) => {
          event.preventDefault();
          onToggle();
        }}
      >
        <div className="project-card-meta">
          <span>0{index + 1}</span>
          <span>{project.status}</span>
        </div>

        <div className="project-card-heading">
          <div>
            <p className="project-card-category">{project.category}</p>
            <h3>{project.title}</h3>
          </div>

          <span className="project-card-toggle" aria-hidden="true">
            <span>+</span>
          </span>
        </div>

        <p className="project-card-description">{project.description}</p>

        <div className="project-card-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </summary>

      <div className="project-card-details-shell">
        <div className="project-card-details">
          <span>PROJECT DOCUMENTATION</span>
          <p>{project.details}</p>
          <Link className="project-card-case-study" href={`/projects/${project.slug}`}>
            VIEW CASE STUDY <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </details>
  );
}

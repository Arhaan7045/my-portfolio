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
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const displayTitle = project.title.replaceAll("—", ":").replaceAll("–", ":");

  return (
    <article className="project-card">
      <div className="project-card-topline">
        <span className="project-card-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-card-category">{project.category}</span>
        <span className="project-card-status"><i aria-hidden="true" />{project.status}</span>
      </div>

      <div className="project-card-main">
        <div className="project-card-copy">
          <h3 className="project-card-title">{displayTitle}</h3>
          <p className="project-card-description">{project.description}</p>
        </div>
        <Link className="project-card-open" href={`/projects/${project.slug}`} aria-label={`Read the ${displayTitle} case study`}>
          <span>View project</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {project.tags.length > 0 && (
        <ul className="project-card-tags" aria-label="Project tools and topics">
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      )}

    </article>
  );
}

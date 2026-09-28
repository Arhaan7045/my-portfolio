"use client";

import Link from "next/link";
import { motion } from "motion/react";

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

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectCard({ project, index }: ProjectCardProps) {
  const detailsId = `project-documentation-${index}`;

  return (
    <motion.div
      layout
      className="project-card-motion"
      transition={{ layout: { duration: 0.45, ease } }}
    >
      <details className="project-card">
        <summary className="project-card-summary">
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

          <span className="project-card-description">
            {project.description}
          </span>

          <span className="project-card-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        </summary>

        <div
          id={detailsId}
          className="project-card-details-shell"
        >
          <div className="project-card-details">
            <span>PROJECT DOCUMENTATION</span>
            <p>{project.details}</p>
            <Link
              className="project-card-case-study"
              href={`/projects/${project.slug}`}
            >
              VIEW CASE STUDY <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </details>
    </motion.div>
  );
}

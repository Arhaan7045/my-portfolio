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
  isOpen: boolean;
  onToggle: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectCard({
  project,
  index,
  isOpen,
  onToggle,
}: ProjectCardProps) {
  const detailsId = `project-documentation-${index}`;

  return (
    <motion.article
      layout
      className={`project-card${isOpen ? " is-open" : ""}`}
      transition={{ layout: { duration: 0.45, ease } }}
    >
      <button
        type="button"
        className="project-card-summary"
        aria-expanded={isOpen}
        aria-controls={detailsId}
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
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.28, ease }}
            >
              +
            </motion.span>
          </span>
        </span>

        <span className="project-card-description">{project.description}</span>

        <span className="project-card-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
      </button>

      <motion.div
        id={detailsId}
        className="project-card-details-shell"
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.42, ease },
          opacity: { duration: isOpen ? 0.24 : 0.16, ease },
        }}
        aria-hidden={!isOpen}
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
      </motion.div>
    </motion.article>
  );
}

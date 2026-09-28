"use client";

import { useState } from "react";
import { ProjectCard, type Project } from "@/components/project-card";

type ProjectsGridProps = {
  projects: Project[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={index}
          isOpen={openIndex === index}
          onToggle={(open) =>
            setOpenIndex(open ? index : null)
          }
        />
      ))}
    </div>
  );
}

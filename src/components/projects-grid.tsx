"use client";

import { useEffect, useState } from "react";
import { ProjectCard, type Project } from "@/components/project-card";

type ProjectsGridProps = {
  projects: Project[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) setOpenIndex(null);
  }, [isDesktop]);

  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={index}
          isOpen={openIndex === index}
          isDesktop={isDesktop}
          onOpen={() => setOpenIndex(index)}
          onClose={() => setOpenIndex(null)}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

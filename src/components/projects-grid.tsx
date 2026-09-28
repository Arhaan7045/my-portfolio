import { ProjectCard, type Project } from "@/components/project-card";

type ProjectsGridProps = {
  projects: Project[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={index}
        />
      ))}
    </div>
  );
}

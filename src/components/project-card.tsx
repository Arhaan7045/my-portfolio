"use client";

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
  const detailsId = `project-details-${index}`;

  return (
    <details className="project-card reveal">
      <summary className="project-card-summary">
        <div className="project-card-meta">
          <span>0{index + 1}</span>
          <span>{project.status}</span>
        </div>

        <div className="project-card-heading">
          <div>
            <p className="project-card-category">{project.category}</p>
            <h3>{project.title}</h3>
          </div>

          <span
            className="project-card-toggle"
            aria-hidden="true"
          >
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

      <div
        id={detailsId}
        className="project-card-details-shell"
      >
        <div className="project-card-details">
          <span>PROJECT NOTES</span>
          <p>{project.details}</p>
          <span className="project-card-detail-status">
            DOCUMENTATION IN PROGRESS
          </span>
        </div>
      </div>
    </details>
  );
}

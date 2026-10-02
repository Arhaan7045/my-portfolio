import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createPublicClient } from "@/lib/supabase/public";

type Project = {
  slug: string;
  title: string;
  category: string;
  status: string;
  description: string;
  details: string;
  tags: string[] | null;
};

function documentationParagraphs(details: string) {
  return details
    .split(/\n\s*\n|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

async function getProject(slug: string) {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("projects")
    .select("slug, title, category, status, description, details, tags")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Project;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project not found | Arhaan Shaikh",
    };
  }

  return {
    title: `${project.title} | Arhaan Shaikh`,
    description: project.description || `Project case study for ${project.title}.`,
  };
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const tags = project.tags ?? [];

  return (
    <div className="site-frame">
      <div id="page-top" aria-hidden="true" />
      <SiteHeader />

      <main id="main-content" className="case-study-main">
        <div className="case-study-shell">
          <Link className="case-study-back" href="/#projects">
            <span aria-hidden="true">←</span> All projects
          </Link>

          <header className="case-study-hero">
            <div className="case-study-kicker">
              <span>{project.category}</span>
              <strong><span className="case-study-status-dot" aria-hidden="true" />{project.status}</strong>
            </div>
            <h1 className="case-study-title">{project.title.replaceAll("—", ":").replaceAll("–", ":")}</h1>
            <p className="case-study-intro">{project.description}</p>
            {tags.length > 0 ? (
              <div className="case-study-meta" aria-label="Project topics">
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
          </header>

          <div className="case-study-content">
            <section className="case-study-document-panel">
              <div className="case-study-section-head">
                <span>PROJECT NOTES</span>
                <span>{String(documentationParagraphs(project.details).length).padStart(2, "0")} ENTRIES</span>
              </div>
              <div className="case-study-panel-body">
                <h2>What I’ve worked on</h2>
                {documentationParagraphs(project.details).length > 0 ? (
                  <div className="case-study-documentation">
                    {documentationParagraphs(project.details).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p>Project notes will be added as I make progress.</p>
                )}
              </div>
            </section>

            <aside className="case-study-sidebar">
              <p className="case-study-sidebar-label">AT A GLANCE</p>
              <div className="case-study-sidebar-item">
                <span>Category</span>
                <strong>{project.category}</strong>
              </div>
              <div className="case-study-sidebar-item">
                <span>Status</span>
                <strong>{project.status}</strong>
              </div>
              <div className="case-study-sidebar-item">
                <span>Topics</span>
                <strong>{tags.length ? String(tags.length).padStart(2, "0") : "Not added yet"}</strong>
              </div>
              <p className="case-study-sidebar-note">I’ll update this page as the project develops.</p>
            </aside>
          </div>

          <div className="case-study-next">
            <span>MORE PROJECTS</span>
            <Link href="/#projects">Back to all projects <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </main>

      <footer className="footer shell">
        <div className="footer-quote">
          <span>Keep learning. Keep building.</span>
          <small>ARHAAN SHAIKH / PROJECT NOTES</small>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Arhaan</span>
          <div className="footer-links">
            <a href="https://github.com/Arhaan7045" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/arhaanshaikh1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:arhaan.s7045@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
            <span aria-hidden="true">←</span> Back to projects
          </Link>

          <header className="case-study-hero">
            <div className="case-study-kicker">
              <span>{project.category}</span>
              <strong>{project.status}</strong>
            </div>

            <h1 className="case-study-title">{project.title}</h1>

            <p className="case-study-intro">{project.description}</p>

            {tags.length > 0 ? (
              <div className="case-study-meta" aria-label="Project tags">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}
          </header>

          <div className="case-study-grid">
            <section className="case-study-panel">
              <div className="case-study-section-head">
                <span>01 / Project overview</span>
                <span>Current project</span>
              </div>
              <div className="case-study-panel-body">
                <h2>Project documentation.</h2>
                <p>
                  {project.details ||
                    "Detailed project documentation will be added as the work progresses."}
                </p>
              </div>
            </section>

            <aside className="case-study-panel case-study-status">
              <div>
                <div className="case-study-section-head">
                  <span>Status</span>
                  <span>01</span>
                </div>
                <div className="case-study-panel-body">
                  <span className="case-study-label">PROJECT STATE</span>
                  <strong>{project.status}</strong>
                  <p>
                    This case study is powered by the portfolio CMS and reflects
                    the currently published project record.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <section className="case-study-panel case-study-evidence">
            <div className="case-study-section-head">
              <span>02 / Project focus</span>
              <span>{tags.length ? `${tags.length} tags` : "No tags yet"}</span>
            </div>
            <div className="case-study-panel-body">
              <h2>Areas covered by this project.</h2>
              {tags.length > 0 ? (
                <div className="case-study-tool-list">
                  {tags.map((tag) => (
                    <span className="case-study-tool" key={tag}>{tag}</span>
                  ))}
                </div>
              ) : (
                <p>Add tags from the Projects CMS to show the project focus here.</p>
              )}
            </div>
          </section>

          <section className="case-study-panel case-study-evidence">
            <div className="case-study-section-head">
              <span>03 / Documentation</span>
              <span>CMS managed</span>
            </div>
            <div className="case-study-evidence-card">
              <span className="case-study-evidence-mark" aria-hidden="true">+</span>
              <div>
                <h3>Keep the case study tied to the actual project.</h3>
                <p>
                  Update the project description, details, status, and tags from
                  the private Projects CMS. Only published projects are available
                  on the public site.
                </p>
              </div>
            </div>
          </section>

          <div className="case-study-next">
            <span>Project documentation</span>
            <Link href="/#projects">Return to the project archive ↗</Link>
          </div>
        </div>
      </main>

      <footer className="footer shell">
        <div className="footer-quote">
          <span>“Learn. Build. Secure. Repeat.”</span>
          <small>ARHAAN SHAIKH / PROJECT CASE STUDY</small>
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

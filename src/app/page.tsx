import { SectionHeading } from "@/components/section-heading";
import { ProjectsGrid } from "@/components/projects-grid";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { CredentialsShowcase } from "@/components/credentials-showcase";
import { ExperienceShowcase } from "@/components/experience-showcase";
import { LearningShowcase } from "@/components/learning-showcase";
import { createPublicClient } from "@/lib/supabase/public";
import {
  contactLinks,
} from "@/data/portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createPublicClient();

  const [
    { data: projects },
    { data: experience },
    { data: skillGroups },
    { data: certifications },
    { data: learningAreas },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("title, category, status, slug, description, details, tags, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("experience")
      .select("period, title, organization, description, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("skill_groups")
      .select("title, skills, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("certifications")
      .select("title, issuer, description, type, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("learning_areas")
      .select("title, description, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const publicSkillGroups = (skillGroups ?? []) as { title: string; skills: string[] }[];

  const publicProjects = (projects ?? []).map((project) => ({
    ...project,
    tags: project.tags ?? [],
  }));

  const formalCertifications = (certifications ?? []).filter(
    (certification) => certification.type === "formal",
  );
  const virtualExperiences = (certifications ?? [])
    .filter((certification) => certification.type === "virtual")
    .map((certification) => ({
      title: certification.title,
      platform: certification.issuer,
      description: certification.description,
    }));
  return (
    <div className="site-frame">
      <div id="page-top" aria-hidden="true" />
      <SiteHeader />
      <main id="main-content">
        {/* Hero */}
        <HeroSection />

        {/* About */}
        <section className="section shell" id="about">
          <div className="about-layout">
            <div className="about-profile reveal" aria-label="Arhaan Shaikh profile">
              <div className="about-profile-top">
                <span>ABOUT / 01</span>
                <span>PROFILE</span>
              </div>
              <div className="about-monogram" aria-hidden="true">AS</div>
              <div className="about-profile-bottom">
                <strong>MCA STUDENT</strong>
                <span>CYBERSECURITY</span>
              </div>
            </div>
            <div className="about-content">
              <SectionHeading
                eyebrow="ABOUT"
                title="Curious by nature. Security-minded by design."
              />
              <p className="body-copy reveal">
                I&apos;m an MCA student focused on understanding how technology works—and how to make it more secure. I turn learning into practice through labs, projects, and guided security work.
              </p>
              <p className="body-copy reveal">
                I&apos;m developing my foundations in web application security, VAPT, Linux, networking, and security operations. My approach is practical: understand the system, test thoughtfully, document what matters, and learn from every finding.
              </p>
              <p className="body-copy reveal">
                This portfolio is my working record of that process: the skills I’m building, the projects I’m exploring, and the progress I’m making toward a career in cybersecurity.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section shell" id="skills">
          <SectionHeading
            eyebrow="Technical Toolkit"
            title="The foundations behind the work."
          />
          <div className="skills-grid">
            {publicSkillGroups.map((group, index) => (
              <article
                className="skill-group skill-group-premium reveal"
                key={group.title}
              >
                <div className="skill-card-top">
                  <span className="skill-index">0{index + 1}</span>
                  <span className="skill-count">{group.skills.length} AREAS</span>
                </div>
                <div className="skill-card-heading">
                  <h3>{group.title}</h3>
                  <span className="skill-card-arrow" aria-hidden="true">↗</span>
                </div>
                <ul>
                  {group.skills.map((skill, skillIndex) => (
                    <li key={skill + "-" + skillIndex}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="section shell" id="projects">
          <SectionHeading
            eyebrow="Selected Work"
            title="Turning curiosity into hands-on practice."
            description="Explore practical projects, security exercises, and documented experiments—built to strengthen my skills one challenge at a time."
          />
          <ProjectsGrid projects={publicProjects} />
        </section>

        {/* Experience */}
        <ExperienceShowcase items={(experience ?? []).map((item) => ({
          period: item.period,
          title: item.title,
          organization: item.organization,
          description: item.description,
        }))} />

        {/* Certifications */}
        <section className="section shell" id="certifications">
          <SectionHeading
            eyebrow="Certifications & Simulations"
            title="Learning with structure. Practising with purpose."
          />
          <CredentialsShowcase
            formalCertifications={formalCertifications.map((certification) => ({
              title: certification.title,
              issuer: certification.issuer,
              description: certification.description,
            }))}
            virtualExperiences={virtualExperiences.map((item) => ({
              title: item.title,
              issuer: item.platform,
              description: item.description,
            }))}
          />
        </section>

        {/* Currently Learning */}
        <LearningShowcase
          areas={(learningAreas ?? []).map((area) => ({
            title: area.title,
            description: area.description,
          }))}
        />

        {/* Contact */}
        <section className="contact-section" id="contact">
          <div className="shell contact-layout contact-layout-premium">
            <div className="contact-intro">
              <p className="eyebrow">GET IN TOUCH</p>
              <h2>Good work starts with a conversation.</h2>
              <p>
                Open to entry-level cybersecurity opportunities, meaningful collaboration, and conversations with people who enjoy solving problems and securing systems. Reach out and let’s connect.
              </p>
              <span className="contact-note">OPEN TO LEARNING · BUILDING · COLLABORATING</span>
            </div>
            <address className="contact-links contact-links-premium">
              <a className="contact-link-github" href="https://github.com/Arhaan7045" target="_blank" rel="noopener noreferrer">
                <span>GITHUB</span><strong>@Arhaan7045</strong><b>↗</b>
              </a>
              <a className="contact-link-linkedin" href="https://www.linkedin.com/in/arhaanshaikh1/" target="_blank" rel="noopener noreferrer">
                <span>LINKEDIN</span><strong>Connect with me</strong><b>↗</b>
              </a>
              <a className="contact-link-email" href="mailto:arhaan.s7045@gmail.com">
                <span>EMAIL</span><strong>arhaan.s7045@gmail.com</strong><b>↗</b>
              </a>
              {(() => {
                const phone = contactLinks.find((link) => link.label === "Phone");
                if (!phone) return null;
                const whatsappNumber = phone.value.replace(/\D/g, "");
                return (
                  <a
                    className="contact-link-whatsapp"
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>WHATSAPP</span><strong>{phone.value}</strong><b>↗</b>
                  </a>
                );
              })()}
            </address>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer shell">
        <div className="footer-quote">
          <span>&ldquo;Stay curious. Test thoughtfully. Build securely.&rdquo;</span>
          <small>ARHAAN SHAIKH / CYBERSECURITY</small>
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

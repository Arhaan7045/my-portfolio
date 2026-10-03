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
      .select("title, issuer, description, certificate_url, type, sort_order")
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
      certificateUrl: certification.certificate_url,
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
                <strong>PRACTICAL LEARNING</strong>
                <span>CYBERSECURITY</span>
              </div>
            </div>
            <div className="about-content">
              <SectionHeading
                eyebrow="ABOUT"
                title="A practical approach to cybersecurity."
              />
              <p className="body-copy reveal">
                I learn cybersecurity by working through practical labs, testing tools, and turning what I discover into projects and clear documentation.
              </p>
              <p className="body-copy reveal">
                My current focus is web application security and VAPT, supported by a growing foundation in Linux, networking, and security operations. I’m building the skills to identify weaknesses, understand their impact, and communicate findings clearly.
              </p>
              <p className="body-copy reveal">
                Here, you can explore my projects, hands-on experience, certifications, and the areas I’m studying next.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section shell" id="skills">
          <SectionHeading
            eyebrow="Skills"
            title="What I’m learning and practising."
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
            eyebrow="Projects"
            title="Projects and hands-on work."
            description="A look at the security work I’ve practised, the tools I’ve used, and what I’ve learned along the way."
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
            eyebrow="Credentials"
            title="Courses and practical experience."
          />
          <CredentialsShowcase
            formalCertifications={formalCertifications.map((certification) => ({
              title: certification.title,
              issuer: certification.issuer,
              description: certification.description,
              certificateUrl: certification.certificate_url,
            }))}
            virtualExperiences={virtualExperiences.map((item) => ({
              title: item.title,
              issuer: item.platform,
              description: item.description,
              certificateUrl: item.certificateUrl,
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
              <h2>Let&apos;s connect.</h2>
              <p>
                Open to entry-level cybersecurity opportunities, internships, collaborations, and conversations about security.
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
          <span>&ldquo;Learn. Build. Secure. Repeat.&rdquo;</span>
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

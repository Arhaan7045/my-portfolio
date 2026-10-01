import { SectionHeading } from "@/components/section-heading";
import { ProjectsGrid } from "@/components/projects-grid";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { CredentialsShowcase } from "@/components/credentials-showcase";
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
                title="Learning cybersecurity by building and doing."
              />
              <p className="body-copy reveal">
                I&apos;m building my cybersecurity skills through hands-on
                learning, practical labs, projects, and real-world experience.
              </p>
              <p className="body-copy reveal">
                My current focus includes web application security, VAPT, Linux,
                networking, and security operations. I&apos;m interested in
                understanding how systems work, how they can be secured, and how
                security issues can be identified in practice.
              </p>
              <p className="body-copy reveal">
                This portfolio documents that journey — what I&apos;m learning,
                what I&apos;m building, and the experience I&apos;m gaining
                along the way.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section shell" id="skills">
          <SectionHeading
            eyebrow="Skills"
            title="Skills, organized by practice area."
          />
          <div className="skills-grid">
            {(skillGroups ?? []).map((group, index) => (
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
            eyebrow="Projects & Practice"
            title="Work I'm building along the way."
            description="A growing collection of hands-on security work, practice projects, and documented learning."
          />
          <ProjectsGrid projects={publicProjects} />
        </section>

        {/* Experience */}
        <section className="section shell experience-field-section" id="experience">
          <div className="experience-field-intro">
            <div>
              <p className="eyebrow">Experience / Field record</p>
              <h2>Where learning meets <span>real-world practice.</span></h2>
            </div>
            <p className="experience-field-note">
              A record of the roles, responsibilities, and hands-on exposure shaping my cybersecurity journey.
            </p>
          </div>
          <div className="experience-field-list">
            {(experience ?? []).map((item, index) => (
              <article className={`experience-field-entry ${index === 0 ? "experience-field-entry-featured" : ""}`} key={item.period + "-" + item.title}>
                <div className="experience-field-rail">
                  <span className="experience-field-number">0{index + 1}</span>
                  <span className="experience-field-line" aria-hidden="true" />
                </div>
                <div className="experience-field-date">{item.period}</div>
                <div className="experience-field-content">
                  <div className="experience-field-heading">
                    <div>
                      <p className="experience-field-type">{index === 0 ? "LATEST EXPERIENCE" : "EXPERIENCE"}</p>
                      <h3>{item.title}</h3>
                      <p className="experience-field-organization">{item.organization}</p>
                    </div>
                    <span className="experience-field-arrow" aria-hidden="true">↗</span>
                  </div>
                  <p className="experience-field-description">{item.description}</p>
                </div>
              </article>
            ))}
            {(!experience || experience.length === 0) && (
              <p className="experience-field-empty">Experience entries will appear here as they are published.</p>
            )}
          </div>
        </section>

        {/* Certifications */}
        <section className="section shell" id="certifications">
          <SectionHeading
            eyebrow="Credentials"
            title="Proof of structured learning and practical exposure."
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
        <section className="section shell learning-console-section" id="learning">
          <div className="learning-console-heading">
            <p className="eyebrow">Currently learning / Field notes 02</p>
            <h2>Building the mindset to <span>think like a defender.</span></h2>
          </div>
          <div className="learning-console-layout">
            <aside className="learning-console-aside">
              <div className="learning-console-orbit" aria-hidden="true">
                <span className="learning-console-orbit-ring learning-console-orbit-ring-one" />
                <span className="learning-console-orbit-ring learning-console-orbit-ring-two" />
                <span className="learning-console-orbit-core"><span>AS</span></span>
                <span className="learning-console-orbit-dot learning-console-orbit-dot-one" />
                <span className="learning-console-orbit-dot learning-console-orbit-dot-two" />
              </div>
              <p className="learning-console-kicker">THE LEARNING LOOP</p>
              <h3>Study.<br />Practice.<br /><span>Understand.</span></h3>
              <p className="learning-console-summary">
                A living record of the concepts I’m exploring and the foundations I’m strengthening on my cybersecurity path.
              </p>
              <div className="learning-console-status"><span /> OPEN KNOWLEDGE BASE <b>{String((learningAreas ?? []).length).padStart(2, "0")} TOPICS</b></div>
            </aside>
            <div className="learning-console-list" aria-label="Current learning topics">
              {(learningAreas ?? []).map((area, index) => (
                <article className="learning-console-row" key={area.title + "-" + index}>
                  <span className="learning-console-row-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="learning-console-row-copy">
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </div>
                  <span className="learning-console-row-mark" aria-hidden="true">↗</span>
                </article>
              ))}
              {(!learningAreas || learningAreas.length === 0) && (
                <p className="learning-console-empty">Learning topics will appear here as they are published.</p>
              )}
              <div className="learning-console-list-foot"><span /> PROGRESS IS BUILT ONE CONCEPT AT A TIME</div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="contact-section" id="contact">
          <div className="shell contact-layout contact-layout-premium">
            <div className="contact-intro">
              <p className="eyebrow">GET IN TOUCH</p>
              <h2>Let&apos;s connect.</h2>
              <p>
                Whether it&apos;s a cybersecurity opportunity, collaboration,
                project, or just a conversation about the field, you can reach me here.
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

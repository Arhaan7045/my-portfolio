import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { SiteSystemProvider } from "@/components/site-system-provider";
import {
  certifications,
  contactLinks,
  experience,
  learningAreas,
  projects,
  skillGroups,
  virtualExperiences,
} from "@/data/portfolio";

export default function Home() {
  return (
    <SiteSystemProvider>
      <SiteHeader />
      <main>
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
            {skillGroups.map((group, index) => (
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
          <div className="projects-grid">
            {projects.map((project, index) => (
              <details className="project-card reveal" key={project.title}>
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
                    <span className="project-card-arrow" aria-hidden="true">+</span>
                  </div>
                  <p className="project-card-description">{project.description}</p>
                  <div className="project-card-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </summary>
                <div className="project-card-details">
                  <span>PROJECT NOTES</span>
                  <p>{project.details}</p>
                  <span className="project-card-detail-status">DOCUMENTATION IN PROGRESS</span>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="section shell" id="experience">
          <SectionHeading
            eyebrow="Experience"
            title="Learning, contribution, and professional context."
          />
          <div className="experience-list">
            {experience.map((item, index) => (
              <article className="experience-entry reveal" key={item.period + "-" + item.title}>
                <div className="experience-index">0{index + 1}</div>
                <div className="experience-period">{item.period}</div>
                <div className="experience-main">
                  <div className="experience-heading">
                    <div>
                      <h3>{item.title}</h3>
                      <p className="experience-organization">{item.organization}</p>
                    </div>
                    <span className="experience-arrow" aria-hidden="true">↗</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="section shell" id="certifications">
          <SectionHeading
            eyebrow="Credentials"
            title="Proof of structured learning and practical exposure."
          />
          <div className="credentials-archive reveal">
            <div className="credential-primary-card">
              {certifications.map((certification, index) => (
                <div key={certification.title + "-" + index}>
                  <div className="credential-meta">
                    <span>FORMAL CREDENTIAL</span>
                    <span>{certification.issuer}</span>
                  </div>
                  <div className="credential-body">
                    <span className="credential-mark" aria-hidden="true">✦</span>
                    <div>
                      <h3>{certification.title}</h3>
                      <p>{certification.description}</p>
                    </div>
                  </div>
                  <div className="credential-footer">
                    <span>COMPLETED</span>
                    <span>9 COURSES</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="virtual-experience-card">
              <div className="credentials-archive-divider">
                <span>VIRTUAL EXPERIENCE</span>
                <span>FORAGE / JOB SIMULATIONS</span>
              </div>
              <div className="virtual-experience-list">
                {virtualExperiences.map((item, index) => (
                  <article className="virtual-experience-row" key={item.title + "-" + index}>
                    <span className="virtual-experience-index">0{index + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span className="virtual-experience-platform">{item.platform}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Currently Learning */}
        <section className="section shell learning-section" id="learning">
          <SectionHeading
            eyebrow="Learning lab"
            title="Currently learning."
            description="A living space for the areas currently being explored."
          />
          <div className="learning-list learning-list-premium">
            {learningAreas.map((area, index) => (
              <article className="learning-item learning-item-premium reveal" key={area.title + "-" + index}>
                <span>0{index + 1}</span>
                <div>
                  <p><strong>{area.title}</strong></p>
                  <p>{area.description}</p>
                </div>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
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
    </SiteSystemProvider>
  );
}

import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { SiteSystemProvider } from "@/components/site-system-provider";
import {
  certifications,
  contactLinks,
  experience,
  learningAreas,
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
            <div
              className="profile-placeholder reveal"
              aria-label="Future profile image placeholder"
            >
              <span>Profile image</span>
            </div>
            <div>
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
            {skillGroups.map((group) => (
              <article className="skill-group reveal" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.skills.map((skill, index) => (
                    <li key={`${skill}-${index}`}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="section shell" id="projects">
          <SectionHeading
            eyebrow="PROJECTS & PRACTICE"
            title="Work I'm building along the way."
            description="I'm currently building my hands-on cybersecurity experience through labs, practical exercises, and my upcoming VAPT internship. Projects will be added here as I complete them."
          />
          <div className="projects-empty reveal">
            <p>
              Projects coming soon — check back as hands-on work is completed.
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="section shell" id="experience">
          <SectionHeading
            eyebrow="Experience"
            title="Learning, contribution, and professional context."
          />
          <div className="timeline">
            {experience.map((item) => (
              <article
                className="timeline-entry reveal"
                key={`${item.period}-${item.title}`}
              >
                <p>{item.period}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p className="timeline-organization">{item.organization}</p>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="section shell" id="certifications">
          <SectionHeading eyebrow="Credentials" title="Certifications." />
          <div className="certifications-grid">
            {certifications.map((certification, index) => (
              <article
                className="certification-card reveal"
                key={`${certification.title}-${index}`}
              >
                <span className="certification-mark" aria-hidden="true">
                  ✦
                </span>
                <h3>{certification.title}</h3>
                <p>{certification.issuer}</p>
                <p>{certification.description}</p>
              </article>
            ))}
          </div>

          {/* Virtual Experience — clearly distinguished from formal certifications */}
          <div className="section-subheading reveal">
            <p className="eyebrow">Virtual Experience</p>
            <p className="section-description">
              Completed via Forage. These are job simulations, not professional
              employment or client engagements.
            </p>
          </div>
          <div className="certifications-grid">
            {virtualExperiences.map((item, index) => (
              <article
                className="certification-card reveal"
                key={`${item.title}-${index}`}
              >
                <span className="certification-mark" aria-hidden="true">
                  ◆
                </span>
                <h3>{item.title}</h3>
                <p>{item.platform}</p>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Currently Learning */}
        <section className="section shell learning-section" id="learning">
          <SectionHeading
            eyebrow="Learning lab"
            title="Currently learning."
            description="A living space for the areas currently being explored."
          />
          <div className="learning-list">
            {learningAreas.map((area, index) => (
              <div
                className="learning-item reveal"
                key={`${area.title}-${index}`}
              >
                <span>0{index + 1}</span>
                <div>
                  <p>
                    <strong>{area.title}</strong>
                  </p>
                  <p>{area.description}</p>
                </div>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="shell contact-layout">
            <div className="reveal">
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Let&apos;s connect.</h2>
              <p>
                I&apos;m always open to connecting with people interested in
                cybersecurity, technology, and learning through hands-on work.
              </p>
            </div>
            <address className="contact-links reveal">
              {contactLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                  className={`contact-link-${link.label.toLowerCase()}`}
                  target={
                    link.href.startsWith("mailto:") ||
                    link.href.startsWith("tel:")
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    link.href.startsWith("mailto:") ||
                    link.href.startsWith("tel:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                >
                  <span>{link.label}</span>
                  <strong>{link.value}</strong>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </address>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer shell">
        <span>Arhaan</span>
        <span>© 2026 Arhaan. Built with Next.js.</span>
        <div>
          <a
            href="https://github.com/Arhaan7045"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/arhaanshaikh1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:arhaan.s7045@gmail.com">Email</a>
        </div>
      </footer>
    </SiteSystemProvider>
  );
}

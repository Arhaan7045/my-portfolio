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
          <div className="credentials-primary">
            {certifications.map((certification, index) => (
              <article className="credential-primary-card reveal" key={certification.title + "-" + index}>
                <div className="credential-meta">
                  <span>01 / FORMAL CREDENTIAL</span>
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
              </article>
            ))}
          </div>
          <div className="section-subheading credential-subheading reveal">
            <p className="eyebrow">Virtual Experience</p>
            <p className="section-description">
              Completed via Forage. These are job simulations, not professional
              employment or client engagements.
            </p>
          </div>
          <div className="virtual-experience-list">
            {virtualExperiences.map((item, index) => (
              <article className="virtual-experience-row reveal" key={item.title + "-" + index}>
                <span className="virtual-experience-index">0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="virtual-experience-platform">{item.platform}</span>
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

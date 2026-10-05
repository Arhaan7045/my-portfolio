"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/data/portfolio";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ScrollProgress } from "@/components/scroll-progress";

const RESUME_URL =
  "https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing";

export function SiteHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const homeHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return pathname === "/" ? href : `/${href}`;
  };

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sections = navigationItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const renderNavLink = (item: (typeof navigationItems)[number]) => {
    const sectionId = item.href.slice(1);
    const isActive = pathname === "/" && activeSection === sectionId;

    return (
      <a
        className={`nav-section-link${isActive ? " is-active" : ""}`}
        href={homeHref(item.href)}
        key={item.href}
        aria-current={isActive ? "location" : undefined}
      >
        {item.label}
      </a>
    );
  };

  return (
    <header id="top" className="site-header">
      <ScrollProgress />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav aria-label="Primary navigation" className="shell navigation">
        <div className="desktop-navigation">
          {navigationItems.map(renderNavLink)}
          <a
            className="nav-resume"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Resume</span>
            <span aria-hidden="true">↗</span>
          </a>
          <ThemeSwitcher />
        </div>

        <details className="mobile-navigation">
          <summary aria-label="Open navigation menu" aria-controls="mobile-navigation-menu">
            <span className="menu-label">MENU</span>
            <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
          </summary>
          <div id="mobile-navigation-menu" className="mobile-navigation-menu">
            {navigationItems.map(renderNavLink)}
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Resume ↗</a>
            <ThemeSwitcher mobile />
          </div>
        </details>
      </nav>
    </header>
  );
}

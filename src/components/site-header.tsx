import { navigationItems } from "@/data/portfolio";

const RESUME_URL =
  "https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav aria-label="Primary navigation" className="shell navigation">
        <a className="wordmark" href="#top" aria-label="Arhaan Shaikh — home">
          <span className="wordmark-mark" aria-hidden="true" />
          <span>Arhaan Shaikh</span>
        </a>

        <div className="desktop-navigation">
          {navigationItems.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
          <a className="nav-resume" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            Resume ↗
          </a>
        </div>

        <details className="mobile-navigation">
          <summary aria-label="Open navigation menu" aria-controls="mobile-navigation-menu">
            <span className="menu-label">MENU</span>
            <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
          </summary>
          <div id="mobile-navigation-menu" className="mobile-navigation-menu">
            {navigationItems.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Resume ↗</a>
          </div>
        </details>
      </nav>
    </header>
  );
}

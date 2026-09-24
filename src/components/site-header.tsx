import { navigationItems } from "@/data/portfolio";

export function SiteHeader() {
  return <header className="site-header"><nav aria-label="Primary navigation" className="shell navigation"><a className="wordmark" href="#top" aria-label="Arhaan Shaikh — home"><span className="wordmark-mark" aria-hidden="true" /><span>Arhaan</span></a><div className="desktop-navigation">{navigationItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div><details className="mobile-navigation"><summary aria-label="Open navigation menu"><span /><span /><span /></summary><div className="mobile-navigation-menu">{navigationItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div></details></nav></header>;
}

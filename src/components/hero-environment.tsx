import { HeroArchitecture } from "@/components/hero-architecture";

export function HeroEnvironment() {
  return (
    <div className="hero-environment">
      <div className="atrium-atmosphere" />
      <div className="atrium-ceiling" />
      <div className="atrium-rear-wall" />
      <div className="atrium-side-wall atrium-side-wall-left" />
      <div className="atrium-side-wall atrium-side-wall-right" />
      <div className="atrium-floor">
        <div className="atrium-floor-reflection" />
        <div className="atrium-floor-seam atrium-floor-seam-one" />
        <div className="atrium-floor-seam atrium-floor-seam-two" />
      </div>
      <HeroArchitecture />
      <div className="atrium-foreground-frame atrium-foreground-frame-left" />
      <div className="atrium-foreground-frame atrium-foreground-frame-right" />
      <div className="atrium-light-slice" />
      <div className="atrium-floor-shadow" />
    </div>
  );
}

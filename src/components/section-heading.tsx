type SectionHeadingProps = { eyebrow: string; title: string; description?: string; };

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return <div className="section-heading reveal"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description ? <p className="section-description">{description}</p> : null}</div>;
}

// Replace every value in this file with owner-approved content before publishing.

export const navigationItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
] as const;

export const skillGroups = [
  { title: "Cybersecurity", skills: ["Editable skill", "Editable skill", "Editable skill"] },
  { title: "Systems", skills: ["Editable skill", "Editable skill", "Editable skill"] },
  { title: "Networking", skills: ["Editable skill", "Editable skill", "Editable skill"] },
  { title: "Tools", skills: ["Editable tool", "Editable tool", "Editable tool"] },
  { title: "Programming", skills: ["Editable language", "Editable language", "Editable language"] },
] as const;

export const projects = [
  { title: "Network Reconnaissance Lab", description: "Editable project summary describing the objective, methodology, and what was learned.", technologies: ["Editable technology", "Editable technology", "Editable technology"] },
  { title: "Web Application Security Lab", description: "Editable project summary describing the objective, methodology, and what was learned.", technologies: ["Editable technology", "Editable technology", "Editable technology"] },
  { title: "VAPT Internship Journey", description: "Editable project summary describing approved experience, responsibilities, and learning outcomes.", technologies: ["Editable technology", "Editable technology", "Editable technology"] },
] as const;

export const experience = [
  { period: "Editable dates", title: "Editable role or experience title", organization: "Editable organization", description: "Editable description. Use owner-approved information only." },
  { period: "Editable dates", title: "Editable role or experience title", organization: "Editable organization", description: "Editable description. Use owner-approved information only." },
] as const;

export const certifications = [
  { title: "Certification name", issuer: "Issuer", date: "Date" },
  { title: "Certification name", issuer: "Issuer", date: "Date" },
  { title: "Certification name", issuer: "Issuer", date: "Date" },
] as const;

export const learningAreas = ["Editable focus area", "Editable focus area", "Editable focus area"] as const;

export const contactLinks = [
  { label: "Email", value: "your.email@example.com", href: "mailto:your.email@example.com" },
  { label: "GitHub", value: "github.com/your-handle", href: "https://github.com/your-handle" },
  { label: "LinkedIn", value: "linkedin.com/in/your-handle", href: "https://linkedin.com/in/your-handle" },
  { label: "Resume", value: "Add resume link", href: "#" },
] as const;

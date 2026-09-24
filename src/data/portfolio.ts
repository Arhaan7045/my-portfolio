export const navigationItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
] as const;

export const skillGroups = [
  {
    title: "Cybersecurity",
    skills: [
      "Web Application Security",
      "VAPT",
      "Security Fundamentals",
      "OWASP",
      "Vulnerability Assessment",
    ],
  },
  {
    title: "Systems",
    skills: ["Linux", "Windows", "System Administration Fundamentals"],
  },
  {
    title: "Networking",
    skills: ["TCP/IP", "DNS", "HTTP/HTTPS", "Networking Fundamentals"],
  },
  {
    title: "Tools",
    skills: ["Burp Suite", "Nmap", "Wireshark", "Git", "GitHub"],
  },
  {
    title: "Programming",
    skills: ["Python", "Bash", "JavaScript", "SQL"],
  },
] as const;

// No completed projects yet. This array is intentionally empty.
// Real projects will be added here as they are completed.
export const projects: readonly never[] = [] as const;

export const experience = [
  {
    period: "Current",
    title: "VAPT Intern",
    organization: "AeroTrace Forensics",
    description:
      "Selected for a VAPT internship focused on developing practical experience in vulnerability assessment and penetration testing.",
  },
  {
    period: "Current",
    title: "Cybersecurity Intern",
    organization: "Elevance Skills",
    description:
      "Currently completing cybersecurity training as part of the internship program.",
  },
] as const;

export const certifications = [
  {
    title: "Google Cybersecurity Professional Certificate",
    issuer: "Google / Coursera",
    description:
      "Completed all 9 courses covering cybersecurity foundations, Linux, SQL, networking, threats and vulnerabilities, incident response, and security operations.",
    type: "formal" as const,
  },
] as const;

export const virtualExperiences = [
  {
    title: "Deloitte Australia — Cyber Job Simulation",
    platform: "Forage",
    description:
      "Completed practical tasks involving web activity log analysis, breach investigation, and identifying suspicious user activity.",
  },
  {
    title: "Mastercard — Cybersecurity Job Simulation",
    platform: "Forage",
    description:
      "Completed practical tasks involving security awareness, phishing and threat identification, and security training recommendations.",
  },
  {
    title: "Tata — Cybersecurity Analyst Job Simulation",
    platform: "Forage",
    description:
      "Completed practical tasks covering Identity and Access Management (IAM), cybersecurity best practices, documentation, and presentations.",
  },
] as const;

export const learningAreas = [
  {
    title: "Web Application Security",
    description:
      "Building practical understanding of web vulnerabilities and testing techniques.",
  },
  {
    title: "VAPT & Penetration Testing",
    description:
      "Developing hands-on skills through security labs and internship preparation.",
  },
  {
    title: "Linux & Networking",
    description:
      "Strengthening the system and networking foundations needed for cybersecurity.",
  },
  {
    title: "Security Operations",
    description:
      "Learning the fundamentals of monitoring, detection, investigation, and incident response.",
  },
] as const;

export const contactLinks = [
  {
    label: "Email",
    value: "arhaan.s7045@gmail.com",
    href: "mailto:arhaan.s7045@gmail.com",
  },
  {
    label: "Phone",
    value: "+91 8691927045",
    href: "tel:+918691927045",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/arhaanshaikh1",
    href: "https://www.linkedin.com/in/arhaanshaikh1/",
  },
  {
    label: "GitHub",
    value: "github.com/Arhaan7045",
    href: "https://github.com/Arhaan7045",
  },
  {
    label: "Instagram",
    value: "instagram.com/arhaanshaikh.00",
    href: "https://www.instagram.com/arhaanshaikh.00/",
  },
  {
    label: "Resume",
    value: "View Resume",
    href: "https://drive.google.com/file/d/1OgThSdbwqbpWfB8Nqk0tC27hgMRb07kV/view?usp=sharing",
  },
] as const;


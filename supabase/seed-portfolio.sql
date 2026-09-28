-- Initial content seed for the Supabase-backed public portfolio.
-- Run this once in the Supabase SQL Editor after the CMS schema is installed.
-- It mirrors the current public content in src/data/portfolio.ts.
delete from public.projects;
delete from public.experience;
delete from public.skill_groups;
delete from public.certifications;
delete from public.learning_areas;

insert into public.projects
  (slug, title, category, status, description, details, tags, sort_order, is_published)
values
  (
    'vapt-internship',
    'VAPT Internship — Web Application Security Assessment',
    'VAPT / Internship Project',
    'IN PROGRESS',
    'A practical web application security assessment project developed during my VAPT internship, covering reconnaissance, testing, vulnerability analysis, and security documentation.',
    'The project will document the assessment methodology, tools and techniques used, validated findings, evidence, risk context, and remediation guidance as the internship work is completed.',
    array['VAPT', 'WEB SECURITY', 'BURP SUITE', 'SECURITY TESTING'],
    1,
    true
  );

insert into public.experience
  (period, title, organization, description, sort_order, is_published)
values
  (
    'Current',
    'VAPT Intern',
    'AeroTrace Forensics',
    'Selected for a VAPT internship focused on developing practical experience in vulnerability assessment and penetration testing.',
    1,
    true
  ),
  (
    'Current',
    'Cybersecurity Intern',
    'Elevance Skills',
    'Currently completing cybersecurity training as part of the internship program.',
    2,
    true
  );

insert into public.skill_groups
  (title, skills, sort_order, is_published)
values
  (
    'Cybersecurity',
    array['Web Application Security', 'VAPT', 'Security Fundamentals', 'OWASP', 'Vulnerability Assessment'],
    1,
    true
  ),
  (
    'Systems',
    array['Linux', 'Windows', 'System Administration Fundamentals'],
    2,
    true
  ),
  (
    'Networking',
    array['TCP/IP', 'DNS', 'HTTP/HTTPS', 'Networking Fundamentals'],
    3,
    true
  ),
  (
    'Tools',
    array['Burp Suite', 'Nmap', 'Wireshark', 'Git', 'GitHub'],
    4,
    true
  ),
  (
    'Programming',
    array['Python', 'Bash', 'JavaScript', 'SQL'],
    5,
    true
  );

insert into public.certifications
  (title, issuer, description, type, sort_order, is_published)
values
  (
    'Google Cybersecurity Professional Certificate',
    'Google / Coursera',
    'Completed all 9 courses covering cybersecurity foundations, Linux, SQL, networking, threats and vulnerabilities, incident response, and security operations.',
    'formal',
    1,
    true
  ),
  (
    'Deloitte Australia — Cyber Job Simulation',
    'Forage',
    'Completed practical tasks involving web activity log analysis, breach investigation, and identifying suspicious user activity.',
    'virtual',
    2,
    true
  ),
  (
    'Mastercard — Cybersecurity Job Simulation',
    'Forage',
    'Completed practical tasks involving security awareness, phishing and threat identification, and security training recommendations.',
    'virtual',
    3,
    true
  ),
  (
    'Tata — Cybersecurity Analyst Job Simulation',
    'Forage',
    'Completed practical tasks covering Identity and Access Management (IAM), cybersecurity best practices, documentation, and presentations.',
    'virtual',
    4,
    true
  );

insert into public.learning_areas
  (title, description, sort_order, is_published)
values
  (
    'Web Application Security',
    'Building practical understanding of web vulnerabilities and testing techniques.',
    1,
    true
  ),
  (
    'VAPT & Penetration Testing',
    'Developing hands-on skills through security labs and internship preparation.',
    2,
    true
  ),
  (
    'Linux & Networking',
    'Strengthening the system and networking foundations needed for cybersecurity.',
    3,
    true
  ),
  (
    'Security Operations',
    'Learning the fundamentals of monitoring, detection, investigation, and incident response.',
    4,
    true
  );

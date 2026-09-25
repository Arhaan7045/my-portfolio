# Phase 3 --- Public Website UI

## Objective

Build the first complete visual version of the public cybersecurity
portfolio homepage.

## Important Scope

-   Do not add a database.
-   Do not add authentication.
-   Do not add the admin panel.
-   Do not add a blog.
-   Do not add GitHub API integration yet.
-   Do not add fake personal achievements or statistics.
-   Keep all personal information clearly editable.

## Design Goal

Create a premium cybersecurity portfolio that feels original,
professional, modern, and intentional.

It must not look like a generic AI-generated cybersecurity template.

### Avoid

-   Matrix rain
-   Hacker masks
-   Skulls
-   Excessive neon green
-   Fake terminal windows everywhere
-   Excessive glowing effects
-   Huge 3D objects
-   Random cybersecurity icons
-   Excessive gradients
-   Excessive glassmorphism
-   Fake statistics
-   Skill percentage bars

### Visual Direction

Use:

-   Dark cinematic background
-   Near-black / charcoal surfaces
-   Off-white typography
-   Restrained cyan/blue accent colour
-   Subtle technical grid/details
-   Strong typography
-   Generous whitespace
-   Thin borders
-   Refined cards
-   Subtle depth
-   Professional editorial-style composition

The cybersecurity theme should be communicated through the visual
language and content, not clichés.

## Typography

Choose a professional modern sans-serif typeface available through a
reliable web font source or the existing framework setup.

Use a strong hierarchy:

-   Large but controlled hero heading
-   Clear section headings
-   Comfortable body text
-   Small technical labels/metadata

## Page Structure

### 1. Navbar

Include:

-   Name/wordmark
-   About
-   Skills
-   Projects
-   Experience
-   Certifications
-   Contact
-   Responsive mobile navigation

### 2. Hero

Create a visually strong opening section.

Use editable placeholder content such as:

> Cybersecurity

> Building practical skills through security, systems and hands-on
> learning.

Include:

-   Primary CTA: View Projects
-   Secondary CTA: Resume
-   Subtle cybersecurity-inspired visual element

The visual element should be elegant and abstract, such as a restrained
network/grid/system visualization.

Do not use stock hacker imagery.

### 3. About

Create a concise introduction section with space for a future profile
image.

Include:

-   Small "About" label
-   Strong heading
-   Short editable introduction

### 4. Skills

Organize skills into categories rather than showing one giant list.

Categories:

-   Cybersecurity
-   Systems
-   Networking
-   Tools
-   Programming

Use placeholder skills only where they are clearly marked as editable.

### 5. Featured Projects

Create 3 polished project cards.

Use clearly marked sample project content such as:

-   Network Reconnaissance Lab
-   Web Application Security Lab
-   VAPT Internship Journey

Make it obvious in the code that these are temporary/editable entries.

Each card should support:

-   Title
-   Description
-   Technologies
-   GitHub link
-   Case study link

### 6. Experience

Create a clean vertical timeline.

Use placeholder entries and clearly mark them as editable.

### 7. Certifications

Create clean certification cards.

Do not invent certificates.

Use clearly marked placeholders until real information is added.

### 8. Currently Learning

Create a visually interesting but simple section showing areas currently
being learned.

### 9. Contact

Create a simple professional contact section with:

-   Email
-   GitHub
-   LinkedIn
-   Resume

Use placeholder links where necessary.

### 10. Footer

Create a minimal footer with:

-   Name
-   Copyright
-   Social links

## Animation

Use Motion or lightweight CSS animations only where useful.

Include:

-   Hero entrance animation
-   Scroll reveal for major sections
-   Subtle project-card hover interaction
-   Button micro-interactions
-   Very subtle background movement/grid effect

### Animation Rules

-   Keep animations smooth and restrained.
-   Never animate everything.
-   Avoid distracting continuous motion.
-   Respect `prefers-reduced-motion`.
-   Ensure animations remain performant on mobile.
-   Do not introduce Three.js yet.

## Responsive Design

Design mobile intentionally rather than simply shrinking desktop.

Check:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

Requirements:

-   Mobile navigation should be properly designed.
-   Buttons should remain easy to tap.
-   Typography should scale appropriately.
-   No horizontal overflow.

## Code Quality

-   Use reusable components.
-   Keep components reasonably sized.
-   Use semantic HTML.
-   Use accessible labels and focus states.
-   Keep content/data separate from presentation where practical.
-   Avoid unnecessary dependencies.
-   Do not modify `AGENTS.md` unless a permanent project rule genuinely
    needs to be added.
-   Do not create additional documentation files for this individual UI
    change.

## Validation

After implementation:

1.  Run lint.
2.  Run a production build.
3.  Fix any errors.
4.  Check for obvious responsive/layout problems.
5.  Briefly summarize what was implemented.

Do not work on future backend, admin, or database functionality yet.

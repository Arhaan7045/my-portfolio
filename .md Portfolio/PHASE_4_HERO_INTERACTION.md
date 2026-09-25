# Phase 4 — Hero Interaction

## Goal

Replace the current static right-side hero visual with a small, polished interactive visual that feels like part of a premium cybersecurity portfolio.

The existing hero copy and overall page design should remain intact unless a small change is required to connect the interaction correctly.

---

## Current Hero

Keep the existing headline:

**LEARN. TEST. BUILD.**

The active word in the headline should be connected to the interactive `MODE` control.

The hero layout remains:

- Left: eyebrow, headline, description/status, CTAs
- Right: interactive visual
- Desktop: two-column composition
- Mobile: text first, visual below the hero actions

---

## Interactive Controls

The visual should contain exactly three small controls:

### 1. MODE

Purpose: change the active mode of the hero.

Modes:

- LEARN
- TEST
- BUILD

Behavior:

- Clicking `MODE` cycles through the three modes.
- The active mode must update the corresponding word in the main hero headline.
- The visual should also reflect the active mode through a subtle state change.
- There must be **one source of truth** for the active mode/state.
- Do not maintain separate state values for the headline and visual.

Example:

`LEARN. TEST. BUILD.`

If `TEST` is active, `TEST` should have the active visual treatment in the headline and the hero visual should reflect TEST.

Do not use large color changes or excessive glow.

---

### 2. TRACE

Purpose: trigger a short visual animation.

Behavior:

- Clicking `TRACE` should animate a visible trace through a small set of connected nodes/paths.
- The animation should be short and intentional.
- It should feel like inspecting a system path rather than a fake terminal or hacker effect.
- It should return to its resting state after the animation.
- Do not use recursive timers or self-referencing callbacks.
- Prefer simple React state + CSS/SVG animation.
- If reduced motion is enabled, the interaction should remain understandable without the animation.

---

### 3. EXPLORE

Purpose: navigate the user deeper into the portfolio.

Behavior:

- Clicking `EXPLORE` smoothly scrolls to the Projects section (`#projects`).
- Use the existing projects section rather than creating a duplicate section.
- The control must be a real accessible button.

---

## Visual Direction

The visual should be:

- Small
- Sophisticated
- Minimal
- Technical without being cliché
- Premium
- Dark
- Violet-accented
- Clearly interactive

Suggested structure:

- Dark panel/card
- Subtle violet radial lighting
- A restrained grid or technical background detail
- A small number of connected nodes
- Thin paths between nodes
- One clearly active node/state
- Subtle depth and movement
- Thin refined borders
- Strong visual hierarchy

The visual should communicate:

**observe → trace → understand → build**

It should NOT look like a cybersecurity dashboard.

---

## Hard Avoid List

Do NOT use:

- Matrix rain
- Hacker masks
- Skulls
- Giant 3D objects
- Fake terminal windows
- Fake command output
- Excessive neon
- Excessive glow
- Huge node graphs
- Full-screen dashboards
- Stock cybersecurity imagery
- Random decorative controls
- More than the three requested controls
- Large text such as `MODE TRACE EXPLORE` inside the visual
- Duplicate hero eyebrow/headline
- Separate headline and visual state
- Heavy animation libraries unless absolutely necessary

Do not make the visual dominate the hero.

---

## Interaction Architecture

Prefer a small self-contained component such as:

`src/components/hero-visual.tsx`

The component may expose or receive the active mode state as needed, but the architecture must maintain a single source of truth.

Keep the implementation simple:

- React state
- CSS transitions/animations
- SVG or lightweight HTML/CSS for nodes and paths

No Three.js.

No unnecessary dependencies.

Do not introduce complex state machines.

Do not create recursive `setTimeout` logic.

If automatic mode cycling is not necessary, do not add it.

---

## Accessibility

All three controls must:

- Be real `<button>` elements
- Have clear accessible names
- Work with keyboard navigation
- Have visible focus states
- Not rely on color alone to communicate state

Respect:

`prefers-reduced-motion: reduce`

With reduced motion enabled:

- Disable or significantly reduce movement.
- MODE must still visibly change state.
- TRACE must still provide a clear non-motion state change.
- EXPLORE must still scroll correctly.

---

## Responsive Requirements

### Desktop

- Preserve the existing two-column hero.
- Visual should fit naturally on the right.
- Do not make the visual taller than necessary.
- Do not push the main hero content too far down.

### Mobile

- Stack the hero naturally.
- Text comes first.
- Hero actions remain usable.
- Interactive visual appears below the actions.
- Visual must fit the viewport width.
- No horizontal scrolling.
- Controls must remain easy to tap.
- Do not shrink controls to the point that they become difficult to use.

---

## Scope Boundary

Work ONLY on the hero interaction and the minimum supporting code required for it.

Do NOT redesign or rewrite:

- About
- Skills
- Projects content
- Experience
- Certifications
- Learning section
- Contact
- Footer
- Site-wide typography
- Site-wide color system

Do not add:

- Database
- Authentication
- Admin panel
- Blog
- GitHub API
- CMS
- New external services

Do not modify unrelated files unless a small change is technically required for the hero.

---

## Acceptance Criteria

The phase is complete only when all of the following are true:

### Visual

- [ ] Hero still feels premium and original.
- [ ] Right-side visual is small and sophisticated.
- [ ] Violet accent matches the current portfolio direction.
- [ ] No cybersecurity clichés.
- [ ] Visual does not overpower the hero.

### MODE

- [ ] Exactly three modes: LEARN, TEST, BUILD.
- [ ] Clicking MODE cycles through them.
- [ ] Main headline active word changes.
- [ ] Visual state changes with the same active mode.
- [ ] Headline and visual use one source of truth.

### TRACE

- [ ] TRACE triggers a short visible trace effect.
- [ ] Animation does not use recursive timers.
- [ ] It returns to a clean resting state.
- [ ] Reduced-motion users still receive meaningful feedback.

### EXPLORE

- [ ] EXPLORE scrolls to `#projects`.
- [ ] Scrolling is smooth where motion preferences allow it.

### Accessibility

- [ ] Controls are real buttons.
- [ ] Keyboard accessible.
- [ ] Focus states work.
- [ ] State is not communicated by color alone.
- [ ] Reduced-motion behavior works.

### Responsive

- [ ] Desktop layout works.
- [ ] Mobile layout works.
- [ ] No horizontal overflow.
- [ ] Controls remain usable on touch devices.

### Quality

- [ ] No runtime errors.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] No unrelated sections are changed.

---

## Final Validation

Before finishing, test:

1. Desktop hero
2. Mobile hero
3. MODE → LEARN → TEST → BUILD → LEARN
4. Confirm headline and visual always match
5. TRACE animation
6. EXPLORE → Projects
7. Keyboard interaction
8. Reduced-motion behavior
9. No horizontal overflow
10. `npm run lint`
11. `npm run build`

After implementation, report:

- Files changed
- What was implemented
- Lint result
- Build result
- Any known limitations

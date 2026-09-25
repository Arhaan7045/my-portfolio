# Phase 5 --- Hero Core + Mode-Aware CTA + INSPECT + SYSTEM

## Objective

Replace the current network-map hero visual with a premium interactive
**core**.

The hero remains:

**LEARN. TEST. BUILD.**

Controls:

-   `MODE`
-   `INSPECT`
-   `SYSTEM`

The active MODE must be one source of truth for the headline, core
visual, and primary CTA.

Animation quality is a first-class requirement. Do not simplify the
experience merely to make implementation easier.

------------------------------------------------------------------------

## Animation library

Use **Motion for React** as the primary animation system.

Install `motion` only if it is not already installed.

Use imports from:

`motion/react`

Use Motion for:

-   spring/tween transitions
-   hover/tap feedback
-   SVG animation
-   layout transitions
-   scroll-triggered effects
-   scroll-linked effects
-   coordinated sequences

Useful APIs include `motion`, `AnimatePresence`, `useScroll`,
`useInView`, `useMotionValueEvent`, and `animate`.

Do **not** add multiple animation libraries just because they exist.

Do not use Three.js.

If Motion genuinely cannot provide a required effect, explain why before
adding another dependency.

------------------------------------------------------------------------

# 1. New Hero Core

Remove the current node/network-map visual.

Do not keep iterating on the existing network-card concept.

Create a compact abstract object resembling:

-   precision instrument
-   architectural machine
-   layered geometric core
-   sophisticated technical object

Visual language:

-   charcoal/black
-   violet/lavender illumination
-   thin refined geometry
-   subtle depth
-   restrained technical markings
-   small amount of motion

Avoid:

-   cybersecurity dashboard
-   fake terminal
-   generic glowing orb
-   giant 3D object
-   Matrix
-   node graph
-   excessive neon
-   excessive blur
-   stock imagery

The object should look interactive even before the first click.

------------------------------------------------------------------------

# 2. MODE

Cycle:

`LEARN → TEST → BUILD → LEARN`

There must be ONE active mode state.

The same state controls:

1.  headline
2.  core visual
3.  primary CTA

Do not maintain separate state for these.

### LEARN

Core:

-   slightly open
-   components gently separated
-   calmer motion
-   central core visible

Communicates exploration/discovery.

### TEST

Core:

-   components become more precise
-   internal layers align
-   analytical configuration
-   subtle inspection/rotation

Communicates analysis/testing.

### BUILD

Core:

-   components move inward
-   layers assemble
-   central core locks together
-   subtle final settle

Communicates construction.

### Transition

Changing MODE must animate the existing object into its new
configuration.

Do not simply swap colors/text.

Avoid excessive bounce and layout shift.

------------------------------------------------------------------------

# 3. Mode-Aware Hero CTA

The secondary Resume button stays unchanged.

The primary CTA changes with MODE.

### LEARN

`EXPLORE LEARNING ↗`

Scrolls to the existing Currently Learning section.

### TEST

`VIEW PROJECTS ↗`

Scrolls to the existing Projects section.

### BUILD

`SEE MY WORK ↗`

Scrolls to an appropriate existing Projects/Experience target.

No duplicate sections.

CTA label/width must transition smoothly using Motion layout animation
or equivalent.

The CTA is derived from the same active mode state.

------------------------------------------------------------------------

# 4. Physical Controls

Controls:

`MODE` `INSPECT` `SYSTEM`

They must feel like actual pressable controls, not text inside boxes.

### Rest

-   raised surface
-   defined border
-   subtle depth/inset
-   clear label hierarchy

### Hover

-   slight lift
-   subtle surface change
-   restrained violet highlight

### Press

-   visibly depress
-   move down slightly
-   shadow/inset changes
-   spring back naturally

Use Motion `whileHover` / `whileTap` where appropriate.

On mobile, tap feedback must still feel physical.

No hover-only behavior.

------------------------------------------------------------------------

# 5. INSPECT --- Website Anatomy Mode

Replace TRACE with:

`INSPECT`

Concept:

**finished website → underlying anatomy**

Reference idea: an anatomical illustration where the finished body can
be understood through its underlying skeleton/organs.

For this website, reveal the underlying **architecture and structure**
of the portfolio.

This is NOT Chrome DevTools.

Do NOT show raw source code.

Do NOT create a fake developer console.

### Activation

1.  INSPECT physically presses.
2.  Polished page becomes visually quieter.
3.  Structural/anatomical layer appears.
4.  Existing sections become architectural outlines/modules.
5.  The user can toggle back to normal.

Visual language:

-   architectural x-ray
-   blueprint
-   machine anatomy
-   layered system
-   elegant structural drawing

Possible restrained labels:

`NAV` `HERO` `ABOUT` `SKILLS` `PROJECTS` `EXPERIENCE` `CERTIFICATIONS`
`LEARNING` `CONTACT`

### Layer idea

Optionally expose small selectable layers:

-   STRUCTURE
-   LAYOUT
-   INTERACTION
-   CONTENT

Do not turn this into a dashboard.

### Existing content

Do not duplicate the page.

Transform/highlight existing sections.

Example:

Normal project card:

`[ finished card ]`

Inspect:

-   frame
-   media region
-   content region
-   tech tags
-   action region

The effect should be visual, not raw HTML/code.

### Mobile

INSPECT must work fully on touch.

Tap to enter/exit.

No hover dependency.

The anatomy remains readable on narrow screens.

------------------------------------------------------------------------

# 6. SYSTEM --- Whole Website Experience

SYSTEM is the signature interaction.

When pressed:

### Activation

Button physically depresses.

Small status:

`SYSTEM INITIALIZING`

### Automatic scroll

The page automatically travels through the existing portfolio.

It must feel like a controlled cinematic tour, not a jump to the bottom.

### Synchronized section animation

Scrolling and section animations happen simultaneously.

Suggested sequence:

**ABOUT** - profile/frame activates - heading/details sharpen - subtle
signal passes through

**SKILLS** - groups activate sequentially

**PROJECTS** - cards activate in sequence - technical details can subtly
reveal

**EXPERIENCE** - timeline line/nodes activate progressively

**CERTIFICATIONS** - credentials activate as the sequence reaches them

**LEARNING** - final station activates

Do not flash everything at once.

The visual should feel like a signal travelling through one connected
system.

### Completion

End with:

`SYSTEM COMPLETE`

Then restore normal interaction and clear temporary state.

### Interruptibility

While running, the control becomes:

`STOP SYSTEM`

Pressing it must stop automatic scrolling and restore normal interaction
immediately.

The user must never feel trapped.

------------------------------------------------------------------------

# 7. SYSTEM Timing

Target approximately:

**8--12 seconds desktop**

Adjust based on page length/readability rather than forcing an arbitrary
duration.

Mobile may use a shorter/slower sequence depending on viewport and
performance.

Normal scrolling must be completely unaffected when SYSTEM is inactive.

------------------------------------------------------------------------

# 8. Scroll Architecture

Prefer browser-native scrolling plus Motion-driven section animations.

Do not scroll-jack normal browsing.

SYSTEM should:

-   start from the user's current position
-   move through the page deliberately
-   avoid horizontal movement
-   release control when stopped/completed

If reduced motion is enabled, greatly reduce or skip cinematic movement
while preserving the SYSTEM functionality.

------------------------------------------------------------------------

# 9. Section Architecture

Do not rewrite every section.

Add only the minimum state/classes/hooks needed for SYSTEM.

Use existing section IDs/classes where possible.

Do not duplicate section markup.

Do not change portfolio content.

------------------------------------------------------------------------

# 10. Mobile

Everything must work on mobile.

### MODE

Tap → core transforms → headline and CTA update.

### INSPECT

Tap → anatomy mode.

Tap again → normal.

### SYSTEM

Tap → automatic guided scroll.

Section animations synchronize.

`STOP SYSTEM` remains accessible.

All controls must be comfortable touch targets.

No hover-only interactions.

No drag-only interactions.

No tiny SVG targets.

No horizontal overflow.

------------------------------------------------------------------------

# 11. Reduced Motion

Respect:

`prefers-reduced-motion: reduce`

Functionality remains available.

MODE: - state changes with minimal transition

INSPECT: - mode switches with reduced transition

SYSTEM: - avoid long automatic cinematic movement - still progress
through sections in a controlled accessible way - preserve clear
completion state

------------------------------------------------------------------------

# 12. Performance

Prefer animating:

-   transform
-   opacity
-   scale
-   rotate
-   clip-path when appropriate

Avoid expensive layout recalculation and huge continuous animations.

Avoid large-area blur/filter effects.

Do not animate hundreds of DOM elements simultaneously.

Test mobile performance.

------------------------------------------------------------------------

# 13. Accessibility

All controls:

-   real `<button>`
-   keyboard accessible
-   visible focus
-   meaningful accessible labels
-   state not communicated only by color

SYSTEM:

-   interruptible
-   must not trap focus
-   normal navigation works afterward

INSPECT:

-   clearly communicates that anatomy mode is active

MODE:

-   active state is perceivable without color alone

------------------------------------------------------------------------

# 14. Hard Avoid List

Do NOT use:

-   Matrix rain
-   hacker masks
-   skulls
-   fake terminal
-   fake command output
-   generic glowing orb
-   giant 3D object
-   generic node graph
-   dashboard UI
-   excessive glassmorphism
-   excessive neon
-   excessive blur
-   particle explosions
-   glitch spam
-   "ACCESS GRANTED"
-   "HACKED"
-   fake statistics
-   random technical labels everywhere
-   cheesy sound effects
-   game scores
-   giant overlays
-   fullscreen modal
-   raw source code as the visual
-   duplicate page content

------------------------------------------------------------------------

# 15. Scope

Work only on the hero interaction and minimum supporting code.

Likely files:

-   `src/components/hero-section.tsx`
-   `src/components/hero-visual.tsx` or replacement core component
-   `src/app/page.tsx`
-   `src/app/globals.css`
-   small provider/state component only if genuinely necessary

Remove obsolete Phase 4 network-map implementation.

Do not redesign unrelated sections.

Do not add database, authentication, admin, CMS, blog, GitHub API, or
external services.

------------------------------------------------------------------------

# 16. Acceptance Criteria

### Core

-   [ ] Network map replaced.
-   [ ] New core is distinctive and premium.
-   [ ] Core works desktop/mobile.
-   [ ] Core feels interactive before clicking.

### MODE

-   [ ] LEARN → TEST → BUILD → LEARN.
-   [ ] Headline changes.
-   [ ] Core transforms.
-   [ ] CTA changes.
-   [ ] One source of truth.
-   [ ] Polished transitions.

### CTA

-   [ ] LEARN → EXPLORE LEARNING.
-   [ ] TEST → VIEW PROJECTS.
-   [ ] BUILD → SEE MY WORK.
-   [ ] Targets are correct.
-   [ ] Label transition is polished.

### INSPECT

-   [ ] Physical press feedback.
-   [ ] Website enters anatomy mode.
-   [ ] Existing structure is visually exposed.
-   [ ] Does not look like DevTools.
-   [ ] Toggles off.
-   [ ] Works mobile.

### SYSTEM

-   [ ] Physical press feedback.
-   [ ] Automatic scroll.
-   [ ] Cinematic but controlled.
-   [ ] Section animations synchronize.
-   [ ] About activates.
-   [ ] Skills activates.
-   [ ] Projects activates.
-   [ ] Experience activates.
-   [ ] Certifications activates.
-   [ ] Learning activates.
-   [ ] Completion state.
-   [ ] STOP SYSTEM works.
-   [ ] Normal scrolling unaffected outside SYSTEM.

### Animation

-   [ ] Motion used for interaction/animation where useful.
-   [ ] No abrupt/cheap animation.
-   [ ] No unnecessary second animation library.
-   [ ] Reduced motion works.
-   [ ] Mobile remains smooth.

### Quality

-   [ ] No runtime errors.
-   [ ] `npm run lint` passes.
-   [ ] `npm run build` passes.
-   [ ] No horizontal overflow.
-   [ ] No unrelated redesign.

------------------------------------------------------------------------

# 17. Required Testing

Actually test:

### Desktop

-   MODE all states
-   CTA changes and navigation
-   INSPECT enter/exit
-   INSPECT while scrolled
-   SYSTEM start
-   automatic scroll
-   synchronized section animations
-   STOP SYSTEM
-   SYSTEM completion
-   normal scrolling afterward

### Mobile

-   MODE
-   CTA
-   INSPECT
-   SYSTEM
-   STOP SYSTEM
-   touch targets
-   no horizontal overflow
-   performance

### Accessibility

-   keyboard controls
-   focus states
-   reduced motion

### Code

-   `npm run lint`
-   `npm run build`

Do not claim a feature was tested unless it was actually tested.

------------------------------------------------------------------------

# 18. Final Report

Report:

-   files changed
-   animation library installed/used
-   core concept
-   MODE behavior
-   CTA behavior
-   INSPECT behavior
-   SYSTEM behavior
-   mobile result
-   reduced-motion result
-   lint result
-   build result
-   known limitations

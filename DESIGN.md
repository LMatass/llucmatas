---
name: Lluc Matas — Personal studio
description: A quiet graphite personal portfolio with restrained typography and real project imagery.
colors:
  bg: "#151718"
  text: "#f0f1f2"
  body: "#c8cdd3"
  muted: "#a1aab5"
  line: "#303438"
  surface: "#1c1f21"
  active: "#344151"
  focus: "#a6c6ed"
  nav: "#191c1e"
  nav-hover: "#252b30"
  link-line: "#596978"
  control: "#272c30"
  control-hover: "#3a424a"
typography:
  display:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "clamp(36px, 3.15vw, 48px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-.035em"
  headline:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-.025em"
  title:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-.015em"
  body:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "19px"
    lineHeight: 1.65
    letterSpacing: "-.012em"
  label:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "14px"
  caption:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "13px"
    lineHeight: 1.6
rounded:
  preview: "6px"
  pill: "999px"
  circle: "50%"
  focus: "3px"
spacing:
  paragraph: "8px"
  inline: "12px"
  compact: "16px"
  project-gap: "20px"
  identity-gap: "24px"
  mobile-section: "28px"
  biography-top: "44px"
components:
  section-nav:
    backgroundColor: "{colors.nav}"
    textColor: "{colors.body}"
    rounded: "{rounded.pill}"
    padding: "3px"
  section-nav-active:
    backgroundColor: "{colors.active}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
  text-link:
    textColor: "{colors.body}"
    height: "36px"
  browse-button:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  browse-button-hover:
    backgroundColor: "{colors.control-hover}"
  project-preview:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.preview}"
  avatar:
    rounded: "{rounded.circle}"
    width: "124px"
    height: "124px"
  repository-row:
    textColor: "{colors.text}"
    padding: "18px 0"
---

# Design System: Lluc Matas — Personal studio

## Overview

**Creative North Star: "Personal studio"**

A quiet, spacious personal portfolio on graphite. The identity feels technical and approachable through modest Manrope typography, a circular initials mark, and clear text links. This is the user-approved K direction.

The interface remains flat and restrained so real project imagery can carry its own character. The established brand rejects oversized promotional identity treatments and product-style imagery; further screens should retain the same personal, simple tone.

**Key Characteristics:**

- Graphite ground with off-white text and a restrained slate-blue active state.
- Modest typography, generous breathing room, and unboxed captions.
- Real project imagery, native interactions, and optional restrained motion.

## Colors

The palette is predominantly cool graphite neutrals; slate blue communicates location and keyboard focus.

### Primary

- **Slate blue** (`active`): current navigation segment and text selection.
- **Pale blue** (`focus`): visible keyboard outlines.

### Neutral

- **Graphite** (`bg`): continuous page ground.
- **Off-white** (`text`): identity, headings, and emphasized controls.
- **Soft silver** (`body`): biography and profile links.
- **Muted silver** (`muted`): role, captions, secondary labels, and external-link icons.
- **Graphite line** (`line`): navigation outline and restrained list/footer dividers.
- **Preview charcoal** (`surface`): image fallback surface.
- **Navigation charcoal** (`nav`, `nav-hover`): segmented navigation at rest and hover.
- **Link slate** (`link-line`): text-link underline.
- **Control charcoal** (`control`, `control-hover`): circular browsing controls.

**The Quiet Accent Rule.** Use slate blue for state and focus; let project images supply the page's broad color variation.

## Typography

Self-hosted Manrope Variable is the sole type family, with sans-serif fallback. Medium headings and slightly tight tracking establish hierarchy without a promotional display treatment.

The frontmatter defines the desktop roles. Display is the personal name; headline is a section title; title is a project name; body is biography; label is navigation or disclosure; caption is supporting project or repository text. Biography lines are constrained by a maximum width of 690px.

At 760px and below, the name becomes 36px, section headings 22px, and biography 17px with 1.7 line-height. At 360px and below, the name becomes 31px. The role line scales from 20px to 15px, then 13px. Preserve readable hierarchy and natural wrapping.

## Layout

Use a centered content column with maximum width 1070px and 56px side gutters. At 760px and below, use 24px gutters; at 360px and below, use 18px. The header begins 84px from the top on desktop and 32px on mobile.

Spacing is purpose-specific, not an invented modular scale. The identity aligns name and initials across the column. Biography follows with generous separation, then compact profile links. Desktop section titles and notes share a baseline; mobile notes move beneath the title.

The project filmstrip uses native horizontal overflow and mandatory horizontal scroll snap. Each project takes 34% of the strip on desktop, with a 20px gap; mobile uses 86% with a 16px gap to reveal part of the adjacent item. Preview aspect ratio is 1.64. Desktop controls sit outside the strip; below 1250px they move closer to its edges; at 760px they become a separate right-aligned row above it. The footer wraps naturally on mobile.

## Elevation & Depth

There are no shadows. Tonal contrast, fine borders, image cropping, and spacing establish structure. Project captions sit directly on the page; only the image preview is clipped. Avoid adding lifted panels or glass treatments to this flat system.

## Shapes

Small preview corners use the `preview` radius. Navigation and visit labels are pills; initials and browse controls are circles. Focus outlines use the smaller `focus` radius. Fine straight separators organize repository rows and the footer without boxing the whole page.

## Components

### Section navigation

Compact segmented anchors use a fine outline and charcoal track. Desktop segments have minimum dimensions of 96 × 38px, reducing to 84 × 38px on mobile. The current section uses the active fill and `aria-current="location"`. Selecting an anchor preserves that section until the visitor manually scrolls, so Work and Contact remain distinct even when they share a bottom scroll position. Manual scrolling updates the current section. Hover lightens the background and text. Keep native anchor destinations.

### Text links

Underlined text and a small external-link icon are the contact primitive. The body color brightens on hover, together with the underline. Main profile links have a minimum height of 36px; footer links use 34px. External destinations expose new-tab behavior to assistive technology.

### Browse buttons

Circular icon buttons use the control colors. They are 44px on desktop and 40px on mobile, with disabled endpoint opacity of .3. Hide the control group when there is no overflow. These buttons enhance the native scrollable strip; links and project content remain available without JavaScript.

### Project preview and caption

A real website capture fills the clipped image area with top-centered cover positioning. The project title and concise muted description sit below it, unboxed. Hover and keyboard focus scale the image to 1.035 and reduce brightness to .8; a small "Visit website" pill appears at the lower right. The whole project is a real website link.

Left/Right keys move between project links; Home/End select the first/last project. Programmatic movement updates a screen-reader status. Focus is visible with an inset outline offset so the scroll viewport does not clip it.

### Portrait

A circular portrait accompanies the name and is announced as a portrait of Lluc. The crop shows Lluc in a motorsport setting, retaining the site’s personal tone without adding decorative imagery. Diameter steps from 124px to 88px at mobile, then 68px at the smallest breakpoint.

### Public-code disclosure and repository rows

Use native details/summary with a count and plus icon that rotates on expansion. The summary has a minimum height of 48px. Rows use text with secondary descriptions, thin separators between siblings, and a trailing external-link icon. Hover underlines the repository name.

### Shared focus and motion

Interactive elements have a 2px pale-blue outline with a 6px offset, except the project-link inset treatment. Color changes take 180–220ms; image movement takes 550ms with the shared ease-out curve. The disclosure icon takes 250ms, and the visit-label movement takes 350ms. Respect reduced motion: disable transitions and animations, remove image scaling, and use immediate scrolling. Do not introduce autoplay.

## Do's and Don'ts

### Do

- Do retain the quiet graphite palette and modest Manrope hierarchy.
- Do keep captions unboxed and let real project imagery provide color.
- Do preserve visible focus, native links and disclosure, and reduced-motion behavior.
- Do retain readable mobile spacing and a visible adjacent project in the filmstrip.

### Don't

- Don't introduce oversized promotional identity treatments or product-style imagery.
- Don't add shadows or elevated cards to the flat project presentation.
- Don't replace real website captures with invented project interfaces.
- Don't require motion or JavaScript to access project content and links.

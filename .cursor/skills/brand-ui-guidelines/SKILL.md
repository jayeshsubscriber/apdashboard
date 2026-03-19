---
name: ap-dashboard-brand-ui
description: Applies AP Dashboard brand UI guidelines (brand purple #542087, Inter Display headings, consistent typography and color/token usage). Use when styling new or existing pages/components, adding UI elements (buttons/cards/inputs), or when asked for “font/color/UI guidelines”.
---

# AP Dashboard Brand UI

## Brand Color
- Primary brand purple: `#542087`
- Recommended variants:
  - Light accent: `#6b2ba8`
  - Dark accent: `#3d1866`
- Implementation rule: Prefer the existing semantic/theme tokens from `app/globals.css` (e.g. `bg-primary`, `text-primary-foreground`, `ring`, `bg-accent`, `border-border`) over hardcoding hex in component code.

## Typography & Fonts
### Base font
- Use the project’s current default sans font for body/UI copy (already wired as `--font-sans`).

### Headings / display text
- Use “Inter Display” styling for headings and hero-like titles:
  - Heavier weight (typically 600–700)
  - Slightly tighter tracking (`tracking-tight`)
  - Stronger line-height clarity (generally `leading-[1.2]` to `leading-7`)

### Practical Tailwind scale
- Hero/page title: `text-4xl` to `text-3xl` + `font-bold`
- Section header: `text-2xl` + `font-semibold`
- Card title: `text-xl` + `font-semibold`
- Body: `text-base` + `font-normal` + `leading-6` or `leading-relaxed`
- Dense/meta text: `text-sm` (or `text-xs` for helper text)

## Color Usage Rules (Dark/Light Safe)
- Backgrounds/cards/panels:
  - Use `bg-background`, `bg-card`, and matching `text-foreground` / `text-card-foreground`
- Borders/inputs:
  - Use `border-border` / `ring` focus handling instead of custom border colors
- Muted/supporting text:
  - Use `text-muted-foreground` (avoid low-contrast hardcoded grays)
- Primary actions/CTAs:
  - Use `bg-primary` + `text-primary-foreground`
- Charts:
  - Use theme chart tokens (`--chart-1` … `--chart-5`) when available via existing utilities/components

## Radius, Focus, and Interaction
- Radius: use existing rounding conventions from the project (`rounded-lg` / `rounded-xl` are good defaults that align with theme radius scaling).
- Focus states: ensure interactive controls have keyboard-visible focus using the project’s ring/outline patterns (e.g. `outline-ring`, `focus-visible:ring-*`).
- Hover states: use token-based backgrounds (e.g. `hover:bg-muted`, `hover:bg-primary/90`) rather than hardcoded colors.

## Component Checklist (use before finalizing a UI change)
- Headings use Inter Display-like styling (weight + `tracking-tight`)
- Body copy uses readable sizing (`text-base` or `text-sm` in dense sections) and consistent line-height
- Buttons/cards/inputs use semantic tokens (`bg-*`, `text-*`, `border-border`, `ring`) to remain compatible with dark mode
- Focus/hover states are present and accessible

## Implementation Notes (when code changes are needed)
- If introducing new typography variables, update `app/layout.tsx` to load the appropriate “Inter Display” variant via `next/font/google` (use the closest supported variant name available in your Next version), and wire it to a CSS variable for headings.


---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code in **React with TypeScript** that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Tailwind CSS Support

When the user specifies Tailwind CSS (or the project uses it), follow these rules:

- **Use utility classes first**: Build layout, spacing, and base styles with Tailwind utilities.
- **Extend, don't override**: Define custom tokens in `tailwind.config.js` (colors, fonts, spacing, keyframes) instead of writing raw CSS. This keeps everything in the Tailwind system.
- **Custom animations**: Add `keyframes` and `animation` entries to the Tailwind config. Use `animate-*` utilities in markup. Only fall back to `<style>` blocks for effects that truly can't be expressed as utilities (e.g. complex SVG filters, noise textures).
- **Distinctive typography**: Load Google Fonts (or similar) via `<link>` and register them in `theme.extend.fontFamily`. Never rely on Tailwind's default `font-sans` stack alone.
- **Dark mode**: Use `darkMode: 'class'` and toggle the `dark` class on `<html>` for theme switching.
- **Avoid inline styles**: Prefer `@layer utilities` or config extensions over `style=""` attributes.

When Tailwind is NOT specified, default to custom CSS with variables as before.

## React + shadcn/ui Stack

This project uses **React (TypeScript) + Tailwind CSS + shadcn/ui**. Follow these rules:

### shadcn/ui Component Usage
- **Extend, don't replace**: Always use shadcn/ui primitives (`Button`, `Card`, `Dialog`, `Input`, `Select`, `Table`, etc.) as the foundation. Customize via `className` prop with Tailwind utilities — never rewrite from scratch.
- **Check before building**: Before creating a custom component, verify if shadcn/ui already provides it. Common ones: `Sheet`, `Popover`, `Tooltip`, `Badge`, `Separator`, `Skeleton`, `Avatar`, `Tabs`, `Command`, `Combobox`.
- **cn() utility**: Always use the `cn()` helper (from `@/lib/utils`) to merge classNames conditionally.
- **Variants**: Use `cva` (class-variance-authority) for components with multiple visual states instead of inline conditionals.
- **Compound components**: Prefer shadcn/ui's compound pattern (`Card`, `CardHeader`, `CardContent`, etc.) over monolithic components.

### React Patterns
- **TypeScript first**: All components must have explicit props interfaces.
- **Hooks**: Extract logic into custom hooks (`use-*.ts`) when state/effects are non-trivial.
- **File structure**: One component per file. Co-locate related types, hooks, and helpers.
- **Server vs Client**: Default to Server Components. Add `"use client"` only when using `useState`, `useEffect`, event handlers, or browser APIs.

### Responsiveness
- Mobile-first: start with base styles, then `sm:`, `md:`, `lg:` breakpoints.
- Use CSS Grid and Flexbox via Tailwind. Avoid fixed pixel widths.
- Test layouts at 375px (mobile), 768px (tablet), 1280px (desktop).

### Accessibility
- All interactive elements must be keyboard-navigable.
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`).
- shadcn/ui handles ARIA for its primitives — don't override unless necessary.
- Maintain WCAG AA contrast ratios (4.5:1 for text).

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables (or Tailwind config tokens) for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
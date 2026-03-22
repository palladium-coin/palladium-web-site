---
name: web-designer-skill
description: >
  Expert web designer and UX designer skill for creating visually stunning, conversion-optimised,
  and deeply considered websites and web interfaces. Use this skill whenever the user wants to
  build or redesign a website, landing page, portfolio, SaaS homepage, dashboard, e-commerce page,
  or any web presence. Also trigger for: "make it look professional", "redesign this site",
  "create a beautiful web page", "improve the UX", "I need a website for my project", "make this
  more modern", "fix the layout", "improve conversion", "web design", "website layout", or any task
  involving visual identity, information architecture, user experience, or the overall aesthetics
  and structure of a web project. Produces complete, deployable HTML/CSS/JS following current
  design and UX best practices (2024–2025).
---

# Web Designer & UX Designer Skill

Produce websites that are not just beautiful — they are **purposeful, usable, and conversion-focused**. Every visual decision must serve the user. Every layout must guide attention. Every interaction must feel earned.

---

## 1. Designer Mindset — Before Writing a Single Line

### Define Intent First

Before touching code, answer these five questions:

| Question | Why it matters |
|---|---|
| **Who is the primary user?** | Age, technical level, context of use, device preference |
| **What is the single most important action?** | One CTA rules them all — never dilute with equal-weight alternatives |
| **What emotion should the site evoke?** | Trust, excitement, calm, luxury, urgency — this drives every aesthetic choice |
| **What does success look like?** | Signup, purchase, download, engagement — defines layout hierarchy |
| **What does failure look like?** | Bounce, confusion, abandonment — informs what to eliminate |

### Aesthetic Direction — Commit to One

Pick **one** direction and execute it with precision. Mixing directions produces mediocrity.

| Direction | Visual Signature | Best For |
|---|---|---|
| **Dark Luxury** | Near-black bg, subtle brand glow, Syne/Fraunces display, generous whitespace | Crypto, fintech, premium SaaS, portfolios |
| **Glassmorphism** | Frosted layers, blur depth, luminous borders, aurora backgrounds | Tech dashboards, mobile apps, modern SaaS |
| **Bento Grid** | Asymmetric cards à la Apple, strong white space, editorial typography | Product showcases, feature pages, 2025 SaaS |
| **Brutalist Modern** | Oversized type, extreme contrast, non-standard grid, raw borders | Music, underground brands, developer tools |
| **Organic/Blob** | Fluid shapes, soft mesh gradients, curved layouts, natural palette | Health, wellness, creative agencies |
| **Editorial/Magazine** | Dominant typography hierarchy, large photography, variable grid | Blogs, publishers, luxury lifestyle brands |
| **Minimal Japanese** | Extreme whitespace, ink-on-paper palette, precise grid, haiku-length copy | Architecture, jewelry, premium portfolios |
| **Aurora/Mesh** | Animated mesh gradients, semi-transparent layers, dreamy atmosphere | Web3, AI products, creative tools |

**Never choose**: purple-on-white gradients, generic Inter + white card with shadow, hero with bouncing blob.

---

## 2. UX Principles — The Foundation of Good Design

### Visual Hierarchy

Every page has **one primary focal point**. Everything else supports it or gets out of the way.

```
Level 1 — Primary:   Hero headline, main CTA button
Level 2 — Secondary: Subheadline, supporting visuals, nav
Level 3 — Tertiary:  Body text, labels, footnotes, secondary nav
Level 4 — Hidden:    Legal text, meta info (users find it when needed)
```

**Rule**: If everything shouts, nothing is heard. Use size, weight, colour, and whitespace to establish clear levels.

### Gestalt Principles in Practice

| Principle | Implementation |
|---|---|
| **Proximity** | Group related items; more space between unrelated ones. Cards = grouping in action. |
| **Similarity** | Same style = same function. All primary buttons look identical. |
| **Continuation** | Guide the eye with alignment, lines, arrows pointing at the CTA. |
| **Closure** | Partially visible cards invite scrolling. Use it intentionally. |
| **Figure/Ground** | High-contrast text on background. Glassmorphism relies on this. |

### Cognitive Load Reduction

- **Hick's Law**: More choices = longer decision time. Remove options that don't serve the primary goal.
- **Miller's Law**: Humans process ~7±2 items at once. Navigation links ≤ 7. Feature bullets ≤ 5.
- **F-pattern and Z-pattern**: Users scan, not read. Put key info top-left → top-right → bottom-left.
- **Progressive Disclosure**: Show the minimum needed. Reveal complexity only when the user requests it (accordions, tabs, "read more").

### Information Architecture

Structure content so users can answer: *"Where am I? Where can I go? What can I do here?"*

```
Homepage
├── Hero — Immediately answers: "What is this? Is it for me?"
├── Social Proof — "Can I trust this?" (logos, numbers, testimonials)
├── Features/Benefits — "What will I get?"
├── How it Works — "How does it work?" (reduces friction)
├── Pricing/CTA — "What does it cost? How do I start?"
└── FAQ — Objection handling

Rule: Never bury the CTA. Never make the user work to find next steps.
```

### Conversion-Focused Design

```
Above the fold checklist:
✓ Clear headline — what it is, for whom, key benefit (under 10 words)
✓ Subheadline — elaborates the headline (under 25 words)
✓ Primary CTA — one button, action verb ("Download", "Start Free", "Get Access")
✓ Social proof signal — count, logos, or a single strong quote
✓ No navigation distraction — consider hiding nav on landing pages

CTA design rules:
- One dominant CTA per screen section
- Action verbs: "Download", "Start", "Get", "Join" — not "Submit" or "Click Here"
- CTA should contrast everything around it (brand colour on neutral bg)
- Secondary CTA must be clearly lower weight (ghost/outline style)
```

### Spacing — The Most Underused Design Tool

Whitespace communicates premium, clarity, and confidence. Crowded = cheap.

```css
/* 8pt spacing system — everything is a multiple of 8 */
:root {
  --sp-1:  0.5rem;   /*  8px — tight inline gaps */
  --sp-2:  1rem;     /* 16px — standard padding */
  --sp-3:  1.5rem;   /* 24px — card padding */
  --sp-4:  2rem;     /* 32px — section internal spacing */
  --sp-6:  3rem;     /* 48px — between major elements */
  --sp-8:  4rem;     /* 64px — section top/bottom padding */
  --sp-12: 6rem;     /* 96px — section breathing room */
  --sp-16: 8rem;     /* 128px — hero padding, major section separation */
}
```

**Rule**: When in doubt, double the whitespace. Premium brands use 2–3× more whitespace than average sites.

---

## 3. CSS Architecture — Token-First

```css
/* Never hardcode values in components. All design decisions live in :root */
:root {
  /* === COLOUR TOKENS === */
  --bg:           oklch(9%  0.04 245);    /* body background */
  --surface-1:    oklch(12% 0.045 245);   /* cards */
  --surface-2:    oklch(16% 0.04 245);    /* elevated cards */
  --surface-3:    oklch(22% 0.035 245);   /* hover/active */
  --border:       oklch(28% 0.03 245);    /* subtle borders */
  --border-strong:oklch(36% 0.03 245);    /* visible borders */
  --text-1:       oklch(95% 0.006 240);   /* primary text */
  --text-2:       oklch(68% 0.012 230);   /* muted text */
  --text-3:       oklch(48% 0.012 230);   /* placeholder/disabled */
  --brand:        oklch(78% 0.18 195);    /* primary brand colour */
  --brand-dark:   oklch(62% 0.18 195);    /* brand hover/active */
  --brand-light:  oklch(88% 0.12 190);    /* brand tint */
  --brand-dim:    color-mix(in srgb, var(--brand) 12%, transparent);
  --brand-glow:   color-mix(in srgb, var(--brand) 28%, transparent);
  --success:      oklch(65% 0.20 145);
  --error:        oklch(60% 0.22  20);
  --warning:      oklch(76% 0.18  75);

  /* === TYPOGRAPHY === */
  --font-display: 'Syne', sans-serif;
  --font-body:    'Poppins', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Fluid type scale — clamp(min, preferred, max) */
  --text-xs:   clamp(0.694rem, 0.65rem  + 0.22vw, 0.8rem);
  --text-sm:   clamp(0.833rem, 0.78rem  + 0.27vw, 0.95rem);
  --text-base: clamp(1rem,     0.95rem  + 0.25vw, 1.1rem);
  --text-lg:   clamp(1.2rem,   1.1rem   + 0.5vw,  1.4rem);
  --text-xl:   clamp(1.44rem,  1.3rem   + 0.72vw, 1.75rem);
  --text-2xl:  clamp(1.728rem, 1.5rem   + 1.14vw, 2.25rem);
  --text-3xl:  clamp(2rem,     1.7rem   + 1.87vw, 3rem);
  --text-hero: clamp(2.4rem,   8vw,      5.5rem);

  /* === SPACING === */
  --sp-1: 0.5rem;  --sp-2: 1rem;   --sp-3: 1.5rem;  --sp-4: 2rem;
  --sp-6: 3rem;    --sp-8: 4rem;   --sp-12: 6rem;   --sp-16: 8rem;

  /* === SHAPE === */
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-xl:   32px;
  --radius-full: 9999px;

  /* === MOTION === */
  --spring-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-smooth:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --duration-fast:    150ms;
  --duration-base:    300ms;
  --duration-slow:    600ms;
}
```

---

## 4. Typography — Rules of Craft

```css
/* Display headings */
h1, h2, h3 {
  font-family: var(--font-display);
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-wrap: balance;   /* prevents ugly single-word last lines */
}

/* Body text */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

p { max-width: 65ch; text-wrap: pretty; }   /* optimal reading width */
```

**Font pairing system** — see `references/typography-guide.md`

**Golden rules**:
- Min contrast: **4.5:1** body text, **3:1** large text (WCAG AA)
- Never use pure black on white — use near-black (`oklch(15% 0.02 250)`)
- Line-height: 1.1–1.2 for headings, 1.6–1.8 for body
- 65–75 characters per line is the optimal reading width
- Use `font-variant-numeric: tabular-nums` on any number that changes dynamically

---

## 5. Layout — Modern CSS Patterns

```css
/* Responsive container without magic numbers */
.container {
  width: min(90%, 1200px);
  margin-inline: auto;
  padding-inline: var(--sp-4);
}

/* Auto-fit grid — cards that self-organise */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: var(--sp-4);
}

/* Sticky navbar (always use sticky, not fixed — maintains document flow) */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

Full layout patterns → `references/layout-patterns.md`

---

## 6. Interaction Design

### Every Interactive Element Needs 5 States

```
1. Default    — resting state
2. Hover      — subtle lift, colour shift (desktop only — use @media (hover: hover))
3. Active     — pressed feedback (scale down 0.97, instant)
4. Focus-visible — visible ring for keyboard navigation (never remove outline)
5. Disabled   — 45% opacity, cursor: not-allowed, no hover effects
```

### Motion Hierarchy

```
Page load:     Staggered fade-up (hero immediate, sections on scroll)
Scroll:        Intersection Observer reveals, kinetic type
Hover:         translateY + box-shadow (spring easing)
Click/Active:  Instant response (< 100ms) with scale feedback
State change:  Smooth cross-fade or height transition
Page transition: View Transitions API (where supported)
```

### Touch Device Rules

```css
/* Never apply hover transforms on touch — causes sticky states */
@media (hover: none) {
  .card:hover, .btn:hover { transform: none !important; }
}

/* Minimum touch target: 44×44px (Apple HIG / WCAG 2.5.5) */
.btn, a, [role="button"] { min-height: 44px; min-width: 44px; }
```

---

## 7. Accessibility — Non-Negotiable

```html
<!-- Every image needs alt text -->
<img src="..." alt="Descriptive text">         <!-- informative image -->
<img src="decorative.png" alt="">              <!-- purely decorative -->

<!-- Icons without visible text need aria-label -->
<button aria-label="Close menu">
  <svg aria-hidden="true">...</svg>
</button>

<!-- One h1 per page, then h2, h3... never skip levels -->
<!-- Form inputs always have associated <label> -->
<!-- Colour alone never conveys meaning — add text or icon -->
```

```css
/* Branded focus ring — never remove outline, style it instead */
:focus-visible {
  outline: 2.5px solid var(--brand);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Respect user's motion preferences — always */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 8. Responsive Design Strategy

**Mobile-first** for CSS. Desktop is an enhancement.

```css
/* Base styles = mobile. Enhance upward. */
.hero-title { font-size: clamp(2rem, 8vw, 5.5rem); }

/* Breakpoints as design decisions, not device sizes */
/* sm:  640px — single-column layouts break */
/* md:  768px — two-column becomes possible */
/* lg: 1024px — full multi-column layouts */
/* xl: 1280px — max-width container kicks in */

/* Use container queries for component-level responsiveness */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
@container card (min-width: 420px) {
  .card-inner { display: grid; grid-template-columns: auto 1fr; }
}
```

**Mobile design checklist**:
- ✓ Text minimum 16px (prevents iOS auto-zoom on input focus)
- ✓ Tap targets minimum 44×44px
- ✓ No horizontal scroll at 320px viewport width
- ✓ Images use `max-width: 100%`
- ✓ Tables scroll horizontally or restructure on mobile
- ✓ Navigation collapses to burger or bottom bar
- ✓ `min-height: 100svh` (not `100vh`) — accounts for mobile browser chrome

---

## 9. What Never to Do

### Design
- ❌ Equal visual weight on multiple elements — creates decision paralysis
- ❌ More than 3 different type sizes in a single card/section
- ❌ More than 2 brand colours in primary UI (accent + neutral)
- ❌ Centred body text over 3 lines long
- ❌ Clip-path/shape on text elements that makes them unreadable at small sizes
- ❌ Animations that serve no function (spinning logos, random floating blobs)

### CSS
- ❌ `transition: all 0.3s ease` — transitions `all` properties, including expensive ones
- ❌ Animating `left`, `top`, `width`, `height` — use `translate`/`scale` instead
- ❌ Pure `#000` and `#fff` — use near-black and near-white
- ❌ Hardcoded hex values in components — always use tokens
- ❌ `will-change: transform` on more than 5–6 elements per page
- ❌ Negative `z-index` without a clear reason

### UX
- ❌ Auto-playing video/audio with sound
- ❌ Carousels that auto-advance (users hate them; they kill conversions)
- ❌ Modal on first page load (cookie banners excluded when required)
- ❌ Hiding the price — friction destroys trust
- ❌ Generic CTAs: "Submit", "Click Here", "Learn More" with no context
- ❌ Removing the browser back button behaviour
- ❌ Pagination when infinite scroll or "load more" serves the use case better

---

## 10. Design Audit Protocol

When redesigning an **existing site**, run this audit before touching code:

| Dimension | Questions to answer |
|---|---|
| **Hierarchy** | Is there a clear primary focal point? Can I identify the intended CTA in 3 seconds? |
| **Colour system** | Are colours in CSS tokens or hardcoded? Is the palette coherent? Contrast compliant? |
| **Typography** | Fluid scale or fixed px? Line-height appropriate? Max-width on paragraphs? |
| **Spacing** | Does it follow a grid system or are values arbitrary? Enough breathing room? |
| **Motion** | Purposeful or decorative? Accessible? GPU-composited? |
| **Mobile** | Tested at 320px? Touch targets adequate? No horizontal overflow? |
| **Performance** | LCP < 2.5s? Images with width/height? Fonts with preconnect? |
| **Accessibility** | Alt text? Focus rings? Heading hierarchy? WCAG AA contrast? |
| **Conversion** | Is the CTA above the fold? Clear, single primary action? Social proof visible? |

Prioritise fixes by: **impact on primary goal** first, visual polish second.

---

## 11. Final Checklist Before Delivering

### Visual Quality
- [ ] Aesthetic direction is clear and consistent from header to footer
- [ ] Typography creates immediate visual hierarchy
- [ ] Colour contrast passes WCAG AA (4.5:1 body, 3:1 large)
- [ ] Whitespace used deliberately — no crowding
- [ ] Every animation adds value, not distraction
- [ ] Layout is interesting and not generic

### Code Quality
- [ ] All design values use CSS tokens — zero hardcoded hex in components
- [ ] Fluid typography with `clamp()`
- [ ] GPU-only animations (translate, scale, opacity, filter)
- [ ] `prefers-reduced-motion` respected
- [ ] No `transition: all`
- [ ] `position: sticky` for navbar (not fixed — avoids padding compensation)

### UX Quality
- [ ] Primary CTA visible above the fold
- [ ] Single dominant action per screen section
- [ ] Hover state on all interactive elements
- [ ] Focus-visible ring on all focusable elements
- [ ] Loading/empty/error states for all dynamic content
- [ ] Touch targets ≥ 44×44px

### Performance
- [ ] Hero image: `fetchpriority="high"`, no `loading="lazy"`
- [ ] All fonts: `<link rel="preconnect">` before stylesheet
- [ ] Below-fold images: `loading="lazy" decoding="async"`
- [ ] Animations use `translate`/`scale`/`opacity` — never `left`/`top`/`width`
- [ ] `will-change` on max 5–6 elements

### Accessibility
- [ ] One `<h1>` per page, logical heading order
- [ ] All images have `alt` text (empty `alt=""` for decorative)
- [ ] All form inputs have associated `<label>`
- [ ] All icon-only buttons have `aria-label`
- [ ] Colour is never the sole carrier of meaning

---

## Reference Library

Detailed patterns in `references/`:
- `color-systems.md` — OKLCH palettes, glassmorphism, aurora, grain, neon, colour mixing
- `typography-guide.md` — Font pairs, fluid scale, gradient text, variable fonts, kinetic type
- `animation-patterns.md` — Spring physics, scroll reveals, counters, magnetic elements, View Transitions
- `layout-patterns.md` — Bento, masonry, sticky-story, split hero, marquee, full-bleed
- `interactions-and-effects.md` — Glassmorphism depth system, form micro-interactions, button states, parallax, custom cursor
- `performance-patterns.md` — Core Web Vitals, GPU compositing, critical CSS, lazy loading
- `component-patterns.md` — Stat card, progress bar, badge, accordion, toast, modal

---

> **Remember**: Design is not decoration. It is the architecture of user attention.
> Every pixel you place is a decision about where the user looks next.
> Every millisecond of animation is a claim on their patience.
> Execute with the care of a craftsperson, not the speed of an assembly line.

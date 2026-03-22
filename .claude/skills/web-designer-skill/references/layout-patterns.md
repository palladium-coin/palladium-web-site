# Layout Patterns — Modern Grid & Composition

## Core Layout Philosophy

Layout is not decoration — it is the skeleton of communication. Every layout decision affects reading order, visual hierarchy, and cognitive load. Use CSS Grid for page-level structure and Flexbox for component-level alignment. Never use floats or positioning hacks.

---

## Spacing System — 8pt Grid

All spacing should be multiples of 8px. This creates visual consistency without manual calculation:

```css
:root {
  --space-0:  0;
  --space-1:  4px;    /* 0.5 unit — only for tight micro-spacing */
  --space-2:  8px;    /* 1 unit */
  --space-3:  12px;   /* 1.5 units */
  --space-4:  16px;   /* 2 units — base gap */
  --space-5:  20px;
  --space-6:  24px;   /* 3 units */
  --space-8:  32px;   /* 4 units — section inner padding */
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;   /* 8 units — between major sections */
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;  /* 16 units — hero padding */
}
```

---

## Hero Layouts

### Full-Bleed Hero (Centered)
```css
.hero-full {
  min-height: 100svh;    /* svh avoids mobile toolbar covering content */
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  padding: var(--space-8) var(--space-4);
}

.hero-full__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hero-full__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
}
```

### Split Hero (50/50)
```css
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
  align-items: center;
  gap: var(--space-8);
}

@media (max-width: 768px) {
  .hero-split {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: var(--space-16) 0;
  }
  .hero-split__visual { order: -1; }  /* Image above text on mobile */
}
```

### Asymmetric Hero (60/40)
```css
.hero-asymmetric {
  display: grid;
  grid-template-columns: 3fr 2fr;
  min-height: 85svh;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-16) 0;
}
```

---

## Bento Grid (Apple-Style)

Asymmetric grid where cards have different visual weights:

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 16px;
}

/* Weight assignments */
.bento-hero   { grid-column: span 8; grid-row: span 3; }
.bento-tall   { grid-column: span 4; grid-row: span 3; }
.bento-wide   { grid-column: span 6; grid-row: span 2; }
.bento-medium { grid-column: span 4; grid-row: span 2; }
.bento-small  { grid-column: span 3; grid-row: span 1; }

/* Mobile: all cards stack full-width */
@media (max-width: 768px) {
  .bento-grid > * { grid-column: span 12 !important; }
}
```

---

## Responsive Card Grid

Auto-fill with minimum card width — no media queries needed:

```css
/* Cards fill space, min 280px, max 1fr */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

/* Fixed column counts at breakpoints */
.card-grid--2col {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr));
}

/* 3 columns on desktop, 2 on tablet, 1 on mobile */
.card-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 900px) { .card-grid--3col { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .card-grid--3col { grid-template-columns: 1fr; } }
```

---

## Subgrid — Internal Card Alignment

When multiple cards in a grid need internal elements aligned across all cards:

```css
.card-grid-aligned {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Each card spans 3 rows: header / body / footer */
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;   /* inherits row tracks from parent grid */
  padding: 1.5rem;
  gap: 0.75rem;
}

.card__header { /* row 1 — same height across all cards */ }
.card__body   { /* row 2 — grows uniformly */ }
.card__footer { align-self: end; /* row 3 — always pinned to bottom */ }
```

**Browser support**: Chrome 117+, Firefox 71+, Safari 16+. Fallback: `display: flex; flex-direction: column` with `flex: 1` on body.

---

## Masonry Layout (CSS-Only)

```css
.masonry {
  columns: 3 300px;    /* 3 columns minimum, 300px minimum width */
  column-gap: 1.5rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}
```

---

## Sticky Story — Scroll Narrative

Left panel stays fixed while content on the right scrolls. Ideal for feature showcases and onboarding:

```css
.sticky-story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.sticky-story__visual {
  position: sticky;
  top: calc(50vh - 200px);    /* centered in viewport */
  height: 400px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.5s var(--ease-out-expo);
}

.sticky-story__steps > * {
  min-height: 60vh;
  display: flex;
  align-items: center;
  padding: var(--space-8) 0;
}

.sticky-story__steps > * + * {
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .sticky-story { grid-template-columns: 1fr; }
  .sticky-story__visual { position: relative; top: auto; height: 250px; }
}
```

```javascript
function initStickyStory(selector = '.sticky-story') {
  const container = document.querySelector(selector);
  if (!container) return;

  const steps  = container.querySelectorAll('.sticky-story__steps > *');
  const visual = container.querySelector('.sticky-story__visual');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        steps.forEach(s => s.classList.remove('is-active'));
        e.target.classList.add('is-active');
        const img = e.target.dataset.visual;
        if (img && visual) visual.style.backgroundImage = `url(${img})`;
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(s => io.observe(s));
}
```

---

## Feature Grid with Connectors

```css
/* Grid where borders create a connected "table" appearance */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.feature-card {
  padding: var(--space-8) var(--space-6);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.feature-card:nth-child(3n)      { border-right: none; }
.feature-card:nth-last-child(-n+3) { border-bottom: none; }

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .feature-card { border-right: none; }
  .feature-card:last-child { border-bottom: none; }
}
```

---

## Testimonials Marquee (Infinite Scroll)

```css
.marquee {
  display: flex;
  overflow: hidden;
  /* Fade edges */
  mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee__track {
  display: flex;
  gap: 1.5rem;
  animation: marquee 30s linear infinite;
  flex-shrink: 0;
}

/* Duplicate content for seamless loop */
.marquee__track--clone { animation-delay: -15s; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - 1.5rem)); }
}

.marquee:hover .marquee__track { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
```

---

## Full-Bleed Element

Make an element break out of its container:

```css
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

/* Safer version using logical properties */
.full-bleed {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
}
```

---

## Sticky Sidebar Layout

```css
.sticky-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: start;
}

.sticky-panel {
  position: sticky;
  top: var(--space-8);
  max-height: calc(100svh - 4rem);
  overflow-y: auto;
}

@media (max-width: 900px) {
  .sticky-layout { grid-template-columns: 1fr; }
  .sticky-panel { position: relative; top: auto; max-height: none; }
}
```

---

## Overlay Grid (Text Over Image)

```css
/* Grid stacking technique — no absolute positioning needed */
.overlay-grid {
  display: grid;
  grid-template-areas: "content";
}

.overlay-grid > * {
  grid-area: content;
}

.overlay-grid__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay-grid__content {
  position: relative;
  z-index: 1;
  background: linear-gradient(
    to top,
    oklch(0% 0 0 / 0.8) 0%,
    transparent 60%
  );
  display: flex;
  align-items: flex-end;
  padding: var(--space-6);
}
```

---

## Navbar — Glassmorphism Sticky

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: oklch(9% 0.04 245 / 0.88);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--brand);
  transition: background 0.3s ease;
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: min(90%, 1280px);
  margin-inline: auto;
  padding-inline: var(--space-4);
}

.nav__link {
  padding: 0.4em 0.8em;
  border-radius: var(--radius-full);
  color: var(--text-2);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
  text-decoration: none;
}
.nav__link:hover {
  color: var(--brand);
  background: color-mix(in srgb, var(--brand) 12%, transparent);
}

/* Mobile: 44px minimum touch target */
@media (max-width: 1023px) {
  .nav__link { min-height: 44px; padding: 0.75rem 1.25rem; }
}
```

---

## Footer

```css
.footer {
  padding: var(--space-16) 0 var(--space-6);
  border-top: 1px solid var(--border);
  background: var(--surface-1);
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
  color: var(--text-3);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer__grid { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: span 2; }
  .footer__bottom { flex-direction: column; gap: var(--space-3); text-align: center; }
}

@media (max-width: 480px) {
  .footer__grid { grid-template-columns: 1fr; }
  .footer__brand { grid-column: span 1; }
}
```

---

## Container Queries — Component-Level Responsiveness

```css
/* Declare the container on the wrapper */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Card adapts to its container width, not viewport */
.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
    padding: 1.5rem;
  }
}

@container card (min-width: 600px) {
  .card__title {
    font-size: 1.5rem;
  }
}
```

---

## Responsive Design Principles

1. **Mobile-first** — write base styles for small screens, override upward
2. **Breakpoints as design decisions** — add a breakpoint only when the layout actually breaks, not at arbitrary screen sizes
3. **Use `min()`, `max()`, `clamp()`** — fluid values eliminate many breakpoints
4. **Test at 320px, 375px, 768px, 1024px, 1440px** — these represent real device densities
5. **Minimum 44px touch targets** — WCAG 2.5.5

```css
/* Fluid container — no breakpoints needed */
.container {
  width: min(90%, 1280px);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2rem);
}

/* Fluid columns — auto-layout from 1 to 4 columns */
.fluid-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

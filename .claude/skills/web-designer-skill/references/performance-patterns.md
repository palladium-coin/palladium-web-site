# Performance Patterns — Core Web Vitals & Optimization

A slow site is not a beautiful site. These patterns ensure visual quality never costs performance.

**Targets:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **INP** (Interaction to Next Paint): < 200ms
- **FCP** (First Contentful Paint): < 1.8s

---

## LCP — Largest Contentful Paint

The LCP is the largest image or text block visible at load. It must arrive fast.

### Hero Image: Maximum Priority

```html
<!-- Preload + high priority — eliminates render-blocking delay -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- Hero image: NEVER use loading="lazy" -->
<img
  src="hero.webp"
  alt="Meaningful description"
  width="1200"
  height="800"
  fetchpriority="high"
  decoding="async"
>

<!-- Responsive hero with srcset -->
<img
  src="hero-800.webp"
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="..."
  width="1600"
  height="900"
  fetchpriority="high"
>
```

### Font Preconnect — Must Be First in `<head>`

```html
<!-- These two MUST be among the first links in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Then the font itself -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## CLS — Cumulative Layout Shift

Every element that shifts during load worsens CLS. Reserve space in advance.

### Reserve Space for Dynamic Content

```css
/* Use aspect-ratio — prevents reflow as images load */
.media-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-2);  /* placeholder while loading */
}

.avatar {
  aspect-ratio: 1;
  width: 3rem;
  border-radius: 50%;
  background: var(--surface-2);  /* placeholder */
}

/* Reserve width for numbers that update dynamically */
.stat-value {
  min-width: 5ch;
  font-variant-numeric: tabular-nums;  /* fixed-width digits — prevents layout shift */
}
```

### Font `size-adjust` — Eliminates FOUT Layout Shift

```css
@font-face {
  font-family: 'Poppins';
  src: url('/fonts/poppins.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;       /* Tune until text doesn't jump on font load */
  ascent-override: 95%;    /* Fine-tune line height to match fallback */
}

/* font-display: swap — show fallback immediately, then swap
   font-display: optional — never swap (best CLS, worst FOUT) */
```

---

## GPU Compositing — Smooth Animations

Only `opacity`, `transform` (translate/scale/rotate), and `filter` run on the GPU. **Never** animate `left`, `top`, `width`, `height`, `margin`, `padding`.

```css
/* ✅ GPU composited — guaranteed 60fps */
.smooth-move {
  transition: translate 0.3s ease;
}
.smooth-move:hover { translate: 0 -4px; }

/* ❌ Triggers layout recalculation — avoid for animation */
.bad-move {
  position: relative;
  transition: top 0.3s ease;  /* top causes layout recalc every frame */
}
.bad-move:hover { top: -4px; }
```

### `will-change` — Use Sparingly

```css
/* ✅ Only on elements that animate frequently */
.carousel-slide { will-change: transform; }

/* Remove after animation ends */
.carousel-slide.stopped { will-change: auto; }

/* ❌ Never on everything — destroys GPU memory */
/* * { will-change: transform; }  — catastrophic */
/* section { will-change: transform; }  — wasted GPU */

/* Max 5-6 elements per page with active will-change */
```

---

## Efficient Event Listeners

```javascript
// ✅ Passive listeners — tell browser scroll won't be blocked
window.addEventListener('scroll',     onScroll, { passive: true });
window.addEventListener('touchstart', onTouch,  { passive: true });

// ✅ Debounce expensive operations on resize
function debounce(fn, wait = 100) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

window.addEventListener('resize', debounce(() => {
  recalculateLayout();
}, 150));

// ✅ requestAnimationFrame for visual updates
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ✅ Event delegation — one listener instead of many
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  handleAction(btn.dataset.action, btn);
});
```

---

## Critical CSS — Inline Above-the-Fold

For vanilla HTML sites (no bundler), the most effective pattern for fast LCP:

```html
<head>
  <!-- 1. Critical CSS inline — everything visible without scroll -->
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    :root { --brand: oklch(78% 0.18 195); --bg: oklch(9% 0.04 245); }
    body  { font-family: 'Poppins', system-ui, sans-serif; background: var(--bg); color: oklch(95% 0.006 240); }
    .navbar { position: sticky; top: 0; /* minimal navbar styles */ }
    .hero   { /* minimal hero styles */ }
  </style>

  <!-- 2. Font preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 3. Rest of CSS loaded non-blocking -->
  <link rel="preload" href="/css/main.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/main.css"></noscript>
</head>
```

---

## Lazy Loading Images

```html
<!-- All images BELOW the fold: loading="lazy" -->
<img src="photo.webp" alt="..." width="800" height="600"
     loading="lazy" decoding="async">
```

```javascript
// IntersectionObserver lazy loading — for reveal effects
const imgObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const img = e.target;
    img.src = img.dataset.src;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.classList.add('loaded');
    imgObserver.unobserve(img);
  });
}, {
  rootMargin: '200px 0px',   // pre-load 200px before entering viewport
  threshold: 0,
});

document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
```

```css
img[data-src] {
  opacity: 0;
  transition: opacity 0.4s ease;
}
img.loaded { opacity: 1; }
```

---

## Script Loading Strategy

```html
<!-- Non-critical: defer (executes after DOM parsed, in order) -->
<script src="/js/animations.js" defer></script>
<script src="/js/analytics.js" defer></script>

<!-- Independent non-critical: async (executes when downloaded, no order) -->
<script src="/js/chat-widget.js" async></script>

<!-- Critical interactive JS: defer (not async — preserves execution order) -->
<script src="/js/main.js" defer></script>

<!-- Tiny inline scripts that must run immediately (theme, feature detection): OK in <head> -->
<script>
  // Apply saved theme before first paint to prevent flash
  const theme = localStorage.getItem('theme');
  if (theme) document.documentElement.dataset.theme = theme;
</script>
```

---

## Image Format Guide

| Format | Use for | Notes |
|---|---|---|
| **WebP** | Photos, screenshots, UI images | 25-35% smaller than JPEG |
| **AVIF** | High-quality photos | 50% smaller than JPEG — growing support |
| **SVG** | Icons, logos, illustrations | Infinitely scalable, tiny file size |
| **PNG** | Complex transparency | Only when SVG not possible |
| **GIF** | Short looping animations | Use MP4/WebM instead — much smaller |

```html
<!-- Responsive image: AVIF → WebP → JPEG fallback -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="..." width="1200" height="800" fetchpriority="high">
</picture>
```

---

## INP — Interaction to Next Paint

Users expect < 100ms response to input. Long tasks block the main thread.

```javascript
// ✅ Break up long tasks with scheduler.yield() or setTimeout
async function processLargeDataset(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);

    // Yield to browser every 50 items — allows input handling
    if (i % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

// ✅ Use Web Workers for heavy computation (sorting, parsing, crypto)
const worker = new Worker('/js/heavy-compute.js');
worker.postMessage({ data: largeArray });
worker.onmessage = e => updateUI(e.data);

// ✅ Virtualize long lists — only render visible items
// If rendering > 200 items: use virtual scrolling
```

---

## CSS Containment

Tell the browser which elements are independent — improves paint and layout performance:

```css
/* Full containment — nothing inside affects anything outside */
.widget {
  contain: strict;
  /* = contain: size layout style paint — safest for isolated widgets */
}

/* Layout containment — internal layout doesn't affect page flow */
.card {
  contain: layout;
}

/* Paint containment — prevents painting outside bounds */
.panel {
  contain: paint;
  /* Also creates stacking context — useful for z-index isolation */
}

/* content-visibility — skip rendering off-screen sections entirely */
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;   /* estimated height to prevent CLS */
}
```

---

## Reduced Motion — Always Respect

```css
/* Wrap all decorative animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Preserve meaningful UI transitions */
  .btn,
  .nav__link {
    transition-duration: 0.15s !important;  /* fast but not instant */
  }
}
```

---

## Performance Budget

Before shipping, verify:

| Metric | Budget | Check with |
|---|---|---|
| Total page weight | < 500KB transferred | Chrome DevTools Network |
| Hero image | < 150KB | Compress at squoosh.app |
| Total JS | < 200KB | Bundle analyzer |
| CSS | < 50KB | DevTools Coverage tab |
| LCP element | Loaded in < 2.5s | Lighthouse |
| Layout shifts | CLS < 0.1 | Lighthouse |
| Unused CSS | < 20% | DevTools Coverage |

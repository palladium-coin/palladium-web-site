# Animation Patterns — CSS & JavaScript Library

## Core Principle: Motion Hierarchy

Not every element should animate. Establish a clear hierarchy:

| Priority | What animates | Duration | Easing |
|---|---|---|---|
| **P1** | Hero elements, primary CTA | 0.6–0.9s | ease-out-expo |
| **P2** | Section reveals on scroll | 0.5–0.7s | ease-out-expo |
| **P3** | Card hover, button feedback | 0.15–0.35s | spring-bounce |
| **P4** | Form states, badges, tooltips | 0.1–0.2s | ease |
| **P5** | Skeleton loaders, spinners | continuous | linear |

---

## Easing Reference — Spring Physics

Replace generic `ease` and `ease-in-out` with physically credible curves:

```css
:root {
  /* Bounce — buttons, cards, elements that "spring" */
  --spring-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Smooth — fluid transitions without overshoot */
  --spring-smooth:  cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Snappy — fast feedback (click, toggle) */
  --spring-snappy:  cubic-bezier(0.68, -0.55, 0.27, 1.55);

  /* Expo out — entrance animations */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);

  /* Quart in-out — page transitions */
  --ease-inout-quart: cubic-bezier(0.76, 0, 0.24, 1);
}
```

---

## Page Load — Staggered Reveal

The most impactful animation. Everything above the fold should reveal in sequence:

```css
.nav        { animation: slideDown 0.6s var(--ease-out-expo) both; }
.hero-title { animation: fadeUp 0.8s var(--ease-out-expo) 0.05s both; }
.hero-sub   { animation: fadeUp 0.8s var(--ease-out-expo) 0.15s both; }
.hero-cta   { animation: fadeUp 0.8s var(--ease-out-expo) 0.25s both; }
.hero-img   { animation: fadeIn 1s ease 0.35s both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Scale reveal — for images and cards */
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Scroll Animations — Intersection Observer

```javascript
function initScrollReveal() {
  const config = { threshold: 0.1, rootMargin: '0px 0px -80px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings within the same parent
      const siblings = entry.target.parentElement?.querySelectorAll('[data-animate]');
      const index = siblings ? Array.from(siblings).indexOf(entry.target) : 0;

      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, index * 80);   // 80ms stagger between siblings
    });
  }, config);

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollReveal);
```

```css
/* Base state — all animate targets start hidden */
[data-animate] {
  opacity: 0;
  transition:
    opacity  0.65s var(--ease-out-expo),
    transform 0.65s var(--ease-out-expo);
}

/* Reveal state */
[data-animate].in-view {
  opacity: 1;
  transform: none;
}

/* Animation variants via data-animate="type" */
[data-animate]:not(.in-view)              { transform: translateY(24px); }   /* default: fade up */
[data-animate="fade"]:not(.in-view)       { transform: none; }
[data-animate="left"]:not(.in-view)       { transform: translateX(-40px); }
[data-animate="right"]:not(.in-view)      { transform: translateX(40px); }
[data-animate="scale"]:not(.in-view)      { transform: scale(0.92); }
[data-animate="scale-down"]:not(.in-view) { transform: scale(1.06); }
[data-animate="blur"]:not(.in-view)       { transform: translateY(16px); filter: blur(8px); }

/* Blur variant needs filter in transition */
[data-animate="blur"] {
  transition:
    opacity  0.7s var(--ease-out-expo),
    transform 0.7s var(--ease-out-expo),
    filter   0.7s var(--ease-out-expo);
}
[data-animate="blur"].in-view { filter: none; }

/* Disable for prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  [data-animate] {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
```

---

## Card Hover Effects

```css
/* Standard card lift + glow */
.card {
  transition:
    transform   0.3s var(--ease-out-expo),
    box-shadow  0.3s ease,
    border-color 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 60px oklch(0% 0 0 / 0.2),
    0 0 0 1px var(--brand);
}

/* Spring lift — more playful, uses bounce easing */
.card-spring {
  transition:
    transform  0.4s var(--spring-bounce),
    box-shadow 0.3s ease;
}
.card-spring:hover {
  transform: translateY(-8px) rotate(-0.5deg);
}
.card-spring:active {
  transform: translateY(-2px) scale(0.98);
  transition-duration: 0.1s;
}

/* Gradient reveal on hover */
.card-gradient {
  position: relative;
  overflow: hidden;
}
.card-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--brand), oklch(65% 0.20 280));
  opacity: 0;
  transition: opacity 0.4s ease;
}
.card-gradient:hover::before { opacity: 0.07; }
```

```javascript
// 3D tilt effect — magnetic card
document.querySelectorAll('.card-tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
```

---

## Button Animations

```css
/* Solid primary button — full state system */
.btn {
  position: relative;
  overflow: hidden;
  transition:
    background  0.2s ease,
    box-shadow  0.2s ease,
    transform   0.15s var(--spring-bounce);
}

/* Ripple on click */
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, white 0%, transparent 65%);
  opacity: 0;
  transform: scale(0);
  border-radius: inherit;
}
.btn:active::after {
  opacity: 0.18;
  transform: scale(2.5);
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.btn:hover:not(:disabled) { transform: translateY(-1px); }
.btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.08s;
}

/* Outline button with shimmer sweep */
.btn-outline {
  position: relative;
  overflow: hidden;
}
.btn-outline::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, oklch(100% 0 0 / 0.06), transparent);
  transition: left 0.5s ease;
}
.btn-outline:hover::before { left: 100%; }
```

---

## Skeleton / Loading States

```css
/* Skeleton screen — always prefer over spinners */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-2, oklch(16% 0.04 245)) 25%,
    var(--surface-3, oklch(22% 0.035 245)) 50%,
    var(--surface-2, oklch(16% 0.04 245)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: var(--radius-md, 8px);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* Preset shapes */
.skeleton-text    { height: 1em;   margin-bottom: 0.5em; }
.skeleton-title   { height: 1.6em; width: 55%; }
.skeleton-avatar  { width: 3rem; height: 3rem; border-radius: 50%; }
.skeleton-card    { height: 180px; }
.skeleton-button  { height: 2.5rem; width: 8rem; border-radius: 9999px; }

/* Pulsing variant — simpler, lower GPU cost */
.skeleton-pulse {
  animation: pulse 1.4s ease-in-out infinite;
  background: var(--surface-2);
  border-radius: var(--radius-md);
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
```

---

## Stagger Lists

```css
/* CSS-only: nth-child for fixed-length lists */
.stagger-list > * {
  opacity: 0;
  animation: fadeUp 0.5s var(--spring-bounce) both;
}
.stagger-list > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-list > *:nth-child(2) { animation-delay: 0.10s; }
.stagger-list > *:nth-child(3) { animation-delay: 0.15s; }
.stagger-list > *:nth-child(4) { animation-delay: 0.20s; }
.stagger-list > *:nth-child(5) { animation-delay: 0.25s; }
.stagger-list > *:nth-child(n+6) { animation-delay: 0.30s; }
```

```javascript
// JS: dynamic stagger for arbitrary list lengths
function applyStagger(selector, delayStep = 60) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.animationDelay = `${i * delayStep}ms`;
  });
}

// Usage:
// applyStagger('.feature-grid .card');
```

---

## Magnetic Element

Elements that pull toward the cursor — ideal for primary CTAs and logo.

```javascript
function initMagnetic(selector = '[data-magnetic]') {
  // Only on pointer devices (not touch)
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll(selector).forEach(el => {
    const strength = parseFloat(el.dataset.magneticStrength ?? '0.3');

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform  = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0.1s linear';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = 'transform 0.6s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1))';
    });
  });
}

document.addEventListener('DOMContentLoaded', initMagnetic);
```

```html
<!-- Usage: -->
<button data-magnetic data-magnetic-strength="0.25">Get Started</button>
```

---

## Number Counter Animation

```javascript
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const duration = parseInt(el.dataset.duration ?? '1500', 10);
  const prefix   = el.dataset.prefix ?? '';
  const suffix   = el.dataset.suffix ?? '';
  const decimals = parseInt(el.dataset.decimals ?? '0', 10);
  const start    = performance.now();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const value   = easeOutCubic(elapsed) * target;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (elapsed < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Trigger only when visible
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);   // fire only once
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
```

```html
<!-- Usage: -->
<span data-count data-target="12500" data-suffix=" MH/s" data-duration="2000">0</span>
<span data-count data-target="99.8" data-decimals="1" data-suffix="%" data-duration="1200">0</span>
```

---

## View Transitions API — Smooth Page Navigation

```javascript
// Intercept internal links for animated page transitions
document.addEventListener('click', async e => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const url = new URL(link.href);
  if (url.origin !== location.origin) return;  // external links only
  if (link.target === '_blank') return;

  e.preventDefault();

  if (!document.startViewTransition) {
    location.href = link.href;
    return;
  }

  await document.startViewTransition(async () => {
    const res  = await fetch(link.href);
    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    document.body.innerHTML = doc.body.innerHTML;
    document.title          = doc.title;
    history.pushState({}, '', link.href);
    // Re-init scripts if needed
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
});
```

```css
/* Page transition animation */
::view-transition-old(root) {
  animation: vt-out 0.25s var(--ease-inout-quart, cubic-bezier(0.76, 0, 0.24, 1)) both;
}
::view-transition-new(root) {
  animation: vt-in  0.25s var(--ease-inout-quart, cubic-bezier(0.76, 0, 0.24, 1)) both;
}

@keyframes vt-out { to   { opacity: 0; translate: -1.5rem 0; } }
@keyframes vt-in  { from { opacity: 0; translate:  1.5rem 0; } }

/* Named element with shared transition */
.hero-image { view-transition-name: hero-img; }
::view-transition-group(hero-img) {
  animation-duration: 0.4s;
  animation-timing-function: var(--ease-out-expo);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

---

## Scroll Progress Bar

```javascript
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  document.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${scrolled / total})`;
  }, { passive: true });
}
```

```css
.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left;
  z-index: 1000;
  box-shadow: 0 0 6px var(--brand);
}
```

---

## Animated Border Gradient

```css
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.border-animated {
  position: relative;
  border-radius: var(--radius-lg);
  background: var(--surface-2);
}

.border-animated::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    var(--brand),
    oklch(65% 0.20 280),
    oklch(70% 0.18 160),
    var(--brand)
  );
  z-index: -1;
  animation: rotate-border 4s linear infinite;
}

.border-animated::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: calc(var(--radius-lg) - 1px);
  background: var(--surface-2);
  z-index: -1;
}

@keyframes rotate-border { to { --angle: 360deg; } }

/* Hover-only variant */
.border-animated-hover::before {
  animation: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.border-animated-hover:hover::before {
  opacity: 1;
  animation: rotate-border 3s linear infinite;
}
```

---

## Animation Performance Rules

```css
/* ✅ GPU composited — always smooth */
.animate-good {
  transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
}

/* ❌ Causes layout recalculation — avoid for animations */
/* .animate-bad { transition: width, height, top, left, margin, padding ... } */

/* ✅ will-change — only on elements that animate constantly */
.constantly-animated {
  will-change: transform;
}
/* Remove after animation ends */
.constantly-animated.done {
  will-change: auto;
}
/* ❌ Never apply to static elements or large containers */
/* Max 5-6 elements per page with active will-change */
```

# Interactions & Visual Effects

Advanced visual effects and micro-interactions. Copy-paste ready.

---

## Design Principle: Every Element Has 5 States

Before implementing an interactive element, define all five states:

| State | When | What changes |
|---|---|---|
| **Default** | At rest | Base appearance |
| **Hover** | Mouse over (pointer devices only) | Lift, color, cursor hint |
| **Focus-visible** | Keyboard navigation | Branded focus ring — never remove outline entirely |
| **Active** | During click/tap | Scale down, immediate feedback |
| **Disabled** | Not interactive | 40-50% opacity, cursor: not-allowed |

---

## 1. Glassmorphism — 3-Depth System

Use depth levels progressively to create real visual hierarchy. Glassmorphism works **only** over texture, gradient, or image — never on solid flat backgrounds.

```css
/* Depth 1 — Card backgrounds, secondary elements */
.glass-1 {
  background: oklch(100% 0 0 / 0.04);
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
  border: 1px solid oklch(100% 0 0 / 0.08);
  border-radius: var(--radius-lg);
}

/* Depth 2 — Modal, drawer, main overlays */
.glass-2 {
  background: oklch(100% 0 0 / 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid oklch(100% 0 0 / 0.14);
  box-shadow: 0 8px 32px oklch(0% 0 0 / 0.25);
  border-radius: var(--radius-lg);
}

/* Depth 3 — Tooltip, popover, foreground elements */
.glass-3 {
  background: oklch(100% 0 0 / 0.15);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid oklch(100% 0 0 / 0.2);
  box-shadow: 0 16px 48px oklch(0% 0 0 / 0.35);
  border-radius: var(--radius-md);
}

/* Dark glassmorphism — for light backgrounds */
.glass-dark {
  background: oklch(0% 0 0 / 0.06);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid oklch(0% 0 0 / 0.1);
}
```

---

## 2. Button States — Complete System

Every button must have: default, hover, active, focus-visible, loading, disabled.

```css
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background  0.2s ease,
    box-shadow  0.2s ease,
    transform   0.15s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
  -webkit-user-select: none;
  user-select: none;
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

.btn:hover:not(:disabled)  { transform: translateY(-1px); }
.btn:active:not(:disabled) { transform: translateY(0) scale(0.98); transition-duration: 0.08s; }

/* Branded focus ring — keyboard accessibility */
.btn:focus-visible {
  outline: 2.5px solid var(--brand);
  outline-offset: 3px;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* --- Variants --- */
.btn-primary {
  background: var(--brand);
  color: white;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--brand) 30%, transparent);
}
.btn-primary:hover:not(:disabled) {
  background: color-mix(in oklch, var(--brand) 85%, black);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--brand) 35%, transparent);
}

.btn-secondary {
  background: var(--surface-2);
  color: var(--text-1);
  border: 1.5px solid var(--border);
}
.btn-secondary:hover:not(:disabled) {
  border-color: var(--brand);
  color: var(--brand);
}

.btn-ghost {
  background: transparent;
  color: var(--text-1);
  border: 1.5px solid transparent;
}
.btn-ghost:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--border);
}

.btn-danger {
  background: oklch(60% 0.22 20);
  color: white;
}
.btn-danger:hover:not(:disabled) {
  background: oklch(52% 0.22 20);
  box-shadow: 0 6px 20px oklch(60% 0.22 20 / 0.35);
}

/* --- Loading state --- */
.btn[data-loading] {
  pointer-events: none;
  color: transparent;
}
.btn[data-loading]::before {
  content: '';
  position: absolute;
  width: 1.1em; height: 1.1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
  color: white;
}
.btn-secondary[data-loading]::before,
.btn-ghost[data-loading]::before { color: var(--text-1); }

@keyframes btn-spin { to { transform: rotate(360deg); } }

/* --- Sizes --- */
.btn-sm { padding: 0.4rem 0.9rem;  font-size: 0.8rem; }
.btn-lg { padding: 0.85rem 1.8rem; font-size: 1rem; }
.btn-xl { padding: 1rem 2.2rem;    font-size: 1.1rem; }
```

---

## 3. Form Micro-interactions

### Floating Label Input

```html
<div class="field-float">
  <input type="text" id="username" placeholder=" " autocomplete="off">
  <label for="username">Username</label>
</div>
```

```css
.field-float { position: relative; }

.field-float input {
  width: 100%;
  padding: 1.4rem 1rem 0.5rem;
  background: var(--surface-2);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-1);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
  outline: none;
}

.field-float input:focus { border-color: var(--brand); }

.field-float label {
  position: absolute;
  left: 1rem;
  top: 50%;
  translate: 0 -50%;
  color: var(--text-2);
  pointer-events: none;
  font-size: 1rem;
  transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease, translate 0.2s ease;
}

/* placeholder=" " is required for :not(:placeholder-shown) to work */
.field-float input:focus ~ label,
.field-float input:not(:placeholder-shown) ~ label {
  top: 0.55rem;
  translate: 0 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--brand);
}

/* Error state */
.field-float.is-error input {
  border-color: oklch(60% 0.22 20);
  animation: field-shake 0.4s ease;
}
.field-float.is-error label { color: oklch(60% 0.22 20); }

/* Success state */
.field-float.is-valid input { border-color: oklch(65% 0.20 145); }

@keyframes field-shake {
  0%, 100% { translate: 0; }
  20%       { translate: -6px 0; }
  40%       { translate:  6px 0; }
  60%       { translate: -4px 0; }
  80%       { translate:  4px 0; }
}
```

### Search Input with Animated Icon

```css
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-wrap .search-icon {
  position: absolute;
  left: 0.9rem;
  color: var(--text-2);
  transition: color 0.2s, transform 0.2s;
  pointer-events: none;
}

.search-wrap input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.6rem;
  background: var(--surface-2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-1);
  font-size: 0.9rem;
  transition: border-color 0.2s, background 0.2s;
  outline: none;
}

.search-wrap input:focus {
  border-color: var(--brand);
  background: var(--surface-3, var(--surface-2));
}

.search-wrap input:focus ~ .search-icon {
  color: var(--brand);
  transform: scale(1.1);
}
```

---

## 4. Neon Glow System

```css
.neon-text {
  color: var(--brand);
  text-shadow:
    0 0 7px  var(--brand),
    0 0 10px var(--brand),
    0 0 21px var(--brand),
    0 0 42px color-mix(in srgb, var(--brand) 60%, transparent);
}

.neon-border {
  border: 1px solid var(--brand);
  box-shadow:
    0 0 5px  color-mix(in srgb, var(--brand) 40%, transparent),
    0 0 20px color-mix(in srgb, var(--brand) 25%, transparent),
    inset 0 0 5px color-mix(in srgb, var(--brand) 15%, transparent);
}

.neon-pulse { animation: neon-flicker 2s ease-in-out infinite alternate; }

@keyframes neon-flicker {
  0%, 100% {
    text-shadow:
      0 0 7px var(--brand), 0 0 21px var(--brand),
      0 0 42px color-mix(in srgb, var(--brand) 60%, transparent);
  }
  50% {
    text-shadow:
      0 0 4px var(--brand), 0 0 12px var(--brand),
      0 0 24px color-mix(in srgb, var(--brand) 40%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) { .neon-pulse { animation: none; } }
```

---

## 5. Parallax with CSS Variables

Zero layout thrash, GPU composited, passive listener:

```javascript
function initParallax() {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--scroll-y', `${window.scrollY}px`
        );
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initParallax);
```

```css
/* Use --scroll-y with different speed multipliers */
.parallax-slow  { translate: 0 calc(var(--scroll-y, 0px) * -0.15); }
.parallax-mid   { translate: 0 calc(var(--scroll-y, 0px) * -0.35); }
.parallax-fast  { translate: 0 calc(var(--scroll-y, 0px) * -0.6); }
.parallax-bg    { translate: 0 calc(var(--scroll-y, 0px) * -0.08); }  /* background only */

/* Horizontal parallax for decorative elements */
.parallax-x-left  { translate: calc(var(--scroll-y, 0px) * -0.1) 0; }
.parallax-x-right { translate: calc(var(--scroll-y, 0px) *  0.1) 0; }
```

---

## 6. Canvas Aurora Background

Lightweight JS class, zero dependencies. Creates an animated aurora sky as background:

```html
<canvas class="aurora-canvas" aria-hidden="true"></canvas>
```

```css
.aurora-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.6;
}

/* CSS-only alternative (lighter, no JS) */
.aurora-css {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%,
      oklch(62% 0.22 30  / 0.35) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 60%,
      oklch(65% 0.20 280 / 0.30) 0%, transparent 50%),
    radial-gradient(ellipse 100% 80% at 50% 100%,
      oklch(60% 0.18 200 / 0.20) 0%, transparent 60%);
  background-size: 200% 200%;
  animation: aurora-shift 12s ease-in-out infinite alternate;
}

@keyframes aurora-shift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 50% 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-css { animation: none; }
}
```

```javascript
class Aurora {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.orbs = Array.from({ length: options.orbCount ?? 3 }, (_, i) => ({
      x:   Math.random(),
      y:   Math.random(),
      vx:  (Math.random() - 0.5) * (options.speed ?? 0.002),
      vy:  (Math.random() - 0.5) * (options.speed ?? 0.002),
      hue: options.hues?.[i] ?? (i * 120 + Math.random() * 60),
      size: options.size ?? 0.45,
    }));
    this._running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = Math.min(devicePixelRatio, 2);
    this.canvas.width  = this.canvas.offsetWidth  * dpr;
    this.canvas.height = this.canvas.offsetHeight * dpr;
  }

  draw() {
    const { ctx, canvas, orbs } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    orbs.forEach(orb => {
      orb.x = ((orb.x + orb.vx) + 1) % 1;
      orb.y = ((orb.y + orb.vy) + 1) % 1;

      const gx = orb.x * canvas.width;
      const gy = orb.y * canvas.height;
      const gr = canvas.width * orb.size;
      const g  = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, 0.28)`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }

  start() {
    if (this._running) return;
    this._running = true;
    const loop = () => { if (!this._running) return; this.draw(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  stop() { this._running = false; }
}

// Usage:
// const aurora = new Aurora(document.querySelector('.aurora-canvas'), {
//   hues: [18, 260, 185],  // brand orange, purple, teal — match your palette
//   speed: 0.0015,
// });
// aurora.start();

// Pause when off-screen (performance)
// const io = new IntersectionObserver(([e]) => e.isIntersecting ? aurora.start() : aurora.stop());
// io.observe(aurora.canvas);
```

---

## 7. Custom Cursor

Only on desktop (`pointer: fine`). Always respect `prefers-reduced-motion`.

```html
<div class="cursor" aria-hidden="true"></div>
<div class="cursor-ring" aria-hidden="true"></div>
```

```css
@media (pointer: fine) {
  * { cursor: none !important; }

  .cursor {
    position: fixed;
    width: 9px; height: 9px;
    background: var(--brand);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    translate: -50% -50%;
    transition:
      transform 0.15s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
      width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
  }

  .cursor-ring {
    position: fixed;
    width: 34px; height: 34px;
    border: 1.5px solid color-mix(in srgb, var(--brand) 50%, transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    translate: -50% -50%;
    transition:
      left 0.08s linear, top 0.08s linear,
      width 0.3s ease, height 0.3s ease,
      border-color 0.3s ease, opacity 0.3s ease;
  }

  /* On links/buttons: dot disappears, ring expands */
  body:has(a:hover) .cursor,
  body:has(button:hover) .cursor { opacity: 0; transform: scale(0); }
  body:has(a:hover) .cursor-ring,
  body:has(button:hover) .cursor-ring {
    width: 48px; height: 48px;
    border-color: var(--brand);
    background: color-mix(in srgb, var(--brand) 8%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor, .cursor-ring { display: none !important; }
}
```

```javascript
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  document.addEventListener('mousemove', e => {
    const pos = `${e.clientX}px`;
    cursor.style.left = ring.style.left = `${e.clientX}px`;
    cursor.style.top  = `${e.clientY}px`;
    ring.style.top    = `${e.clientY}px`;
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = ring.style.opacity = '';
  });
}

document.addEventListener('DOMContentLoaded', initCursor);
```

---

## 8. SVG Gooey Filter

Blob elements that merge smoothly when they touch — creates liquid/organic feel:

```html
<!-- Hidden SVG — place once in body -->
<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
      <feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
        result="goo"/>
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>
  </defs>
</svg>
```

```css
/* Apply filter to container */
.goo-container { filter: url(#goo); }

/* Gooey navigation pill */
.blob-nav {
  filter: url(#goo);
  background: var(--surface-2);
  padding: 0.5rem;
  border-radius: 999px;
  display: flex;
}
.blob-nav a {
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  transition: background 0.3s;
}
.blob-nav a:hover,
.blob-nav a.active { background: var(--brand); }
```

---

## 9. Grain Texture Overlay

Adds premium tactile depth to any background:

```css
.grain { position: relative; isolation: isolate; }

.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  /* Intensity: 0.025 subtle | 0.04 standard | 0.07 heavy */
  opacity: 0.04;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  mix-blend-mode: overlay;
}
```

---

## 10. Animated Border Gradient

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
    var(--brand), oklch(65% 0.20 280), oklch(70% 0.18 160), var(--brand)
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
.border-animated-hover::before { animation: none; opacity: 0; transition: opacity 0.3s; }
.border-animated-hover:hover::before { opacity: 1; animation: rotate-border 3s linear infinite; }
```

---

## 11. Tooltip

```css
[data-tooltip] {
  position: relative;
}

[data-tooltip]::before,
[data-tooltip]::after {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  pointer-events: none;
  opacity: 0;
  translate: -50% 4px;
  transition:
    opacity 0.15s ease,
    translate 0.15s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

[data-tooltip]::before {
  content: attr(data-tooltip);
  background: var(--surface-3, oklch(22% 0.035 245));
  color: var(--text-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm, 6px);
  padding: 0.35em 0.7em;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 12px oklch(0% 0 0 / 0.25);
  z-index: 100;
}

[data-tooltip]::after {
  content: '';
  border: 5px solid transparent;
  border-top-color: var(--surface-3, oklch(22% 0.035 245));
  bottom: calc(100% + 0px);
  z-index: 101;
}

[data-tooltip]:hover::before,
[data-tooltip]:hover::after,
[data-tooltip]:focus-visible::before,
[data-tooltip]:focus-visible::after {
  opacity: 1;
  translate: -50% 0;
}
```

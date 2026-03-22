# Color Systems — Advanced Reference

## Core Principle: Never Use Pure Colors

```css
/* ❌ Avoid */
--bg: #ffffff;
--text: #000000;

/* ✅ Use perceptually nuanced values */
--bg: #f8f7f5;        /* warm off-white — feels lighter */
--bg: #0d0d12;        /* cool near-black — prevents eye strain */
--text: #1a1a2e;      /* warm dark with slight hue */
--text: #e8e8f0;      /* cool light — easier on dark backgrounds */
```

---

## Color Space Hierarchy

Choose the right color space for the task:

| Space | Use for | Why |
|---|---|---|
| `oklch` | Design tokens, palette generation | Perceptually uniform L — same L = same perceived brightness across hues |
| `color-mix()` in oklch | Tints, shades, transparent overlays | Uniform mixing — no muddy gray zones |
| `hsl` | Legacy support, quick prototyping | Intuitive but non-uniform lightness |
| `srgb` | Alpha blending, browser default | Fine for rgba() overlay patterns |

---

## OKLCH Palette Generation

OKLCH is superior to HSL for palettes: identical `L` values produce identical perceived brightness across all hues.

```css
/* Full brand scale — change only the hue number for a completely different palette */
/* Hue reference: 0/360=red  30=orange  60=yellow  120=green  185=teal  250=blue  290=violet */
:root {
  --brand-50:   oklch(96% 0.04  30);   /* near-white tinted */
  --brand-100:  oklch(92% 0.08  30);
  --brand-200:  oklch(85% 0.13  30);
  --brand-300:  oklch(75% 0.17  30);
  --brand-400:  oklch(68% 0.20  30);
  --brand-500:  oklch(62% 0.22  30);   /* BASE — approx #EE5A24 orange */
  --brand-600:  oklch(54% 0.20  30);
  --brand-700:  oklch(45% 0.17  30);
  --brand-800:  oklch(36% 0.13  30);
  --brand-900:  oklch(26% 0.08  30);
  --brand-950:  oklch(16% 0.04  30);
}
```

---

## Proven Palettes by Context

### Dark Tech / Crypto (Deep Navy + Cyan)
```css
:root {
  --bg:          oklch(9%  0.04  245);   /* deep cool near-black */
  --surface-1:   oklch(12% 0.045 245);   /* card base */
  --surface-2:   oklch(16% 0.04  245);   /* elevated card */
  --surface-3:   oklch(22% 0.035 245);   /* hover / active */
  --border:      oklch(28% 0.03  245);   /* subtle dividers */
  --border-strong: oklch(36% 0.03 245);
  --text-1:      oklch(95% 0.006 240);   /* primary text */
  --text-2:      oklch(68% 0.012 230);   /* muted text */
  --text-3:      oklch(48% 0.012 230);   /* subtle text */
  --brand:       oklch(78% 0.18  195);   /* cyan */
  --brand-dark:  oklch(62% 0.18  195);
  --brand-light: oklch(88% 0.12  190);
}
```

### Dark Luxury (SaaS, Fintech, Portfolio)
```css
:root {
  --surface-base:    oklch(8%  0.015 250);
  --surface-raised:  oklch(11% 0.015 250);
  --surface-overlay: oklch(16% 0.015 250);
  --border:          oklch(100% 0 0 / 0.08);
  --border-strong:   oklch(100% 0 0 / 0.15);
  --primary:         oklch(68% 0.20 280);   /* soft violet */
  --accent:          oklch(72% 0.18 35);    /* warm coral */
  --text:            oklch(92% 0.005 250);
  --text-muted:      oklch(55% 0.012 240);
  --text-subtle:     oklch(38% 0.012 240);
}
```

### Minimal Light (Agency, Corporate)
```css
:root {
  --surface-base:    oklch(98% 0.003 80);   /* warm off-white */
  --surface-raised:  oklch(94% 0.006 80);
  --surface-overlay: oklch(89% 0.008 80);
  --border:          oklch(0% 0 0 / 0.07);
  --border-strong:   oklch(0% 0 0 / 0.14);
  --primary:         oklch(22% 0.015 250);  /* deep navy */
  --accent:          oklch(52% 0.20 35);    /* terracotta */
  --text:            oklch(22% 0.015 250);
  --text-muted:      oklch(50% 0.012 240);
}
```

### Aurora/Vibrant (Creative, Music, Art)
```css
:root {
  --surface-base:    oklch(7% 0.02 250);
  --primary:         oklch(78% 0.20 200);   /* electric cyan */
  --secondary:       oklch(65% 0.28 340);   /* hot pink */
  --tertiary:        oklch(60% 0.22 280);   /* violet */
  --accent:          oklch(85% 0.20 85);    /* bright yellow */

  --gradient-mesh:
    radial-gradient(ellipse at 20% 50%, oklch(78% 0.20 200 / 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, oklch(65% 0.28 340 / 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 80%, oklch(60% 0.22 280 / 0.15) 0%, transparent 60%);
}
```

### Warm Editorial (Blog, Publisher, Luxury Brand)
```css
:root {
  --surface-base:    oklch(97% 0.008 75);   /* warm parchment */
  --surface-raised:  oklch(92% 0.012 75);
  --primary:         oklch(18% 0.04 60);    /* espresso */
  --accent:          oklch(62% 0.18 75);    /* amber gold */
  --accent-2:        oklch(42% 0.18 20);    /* burgundy */
  --text:            oklch(18% 0.04 60);
  --text-muted:      oklch(48% 0.025 65);
}
```

---

## CSS Color Functions — Modern Toolkit

### `color-mix()` — Automated Tints and Shades

Never manually calculate color variants. Let the browser do it:

```css
:root {
  --brand: oklch(62% 0.22 30);

  /* Tints (toward white) */
  --brand-100: color-mix(in oklch, var(--brand) 10%, white);
  --brand-200: color-mix(in oklch, var(--brand) 20%, white);
  --brand-300: color-mix(in oklch, var(--brand) 40%, white);

  /* Shades (toward black) */
  --brand-700: color-mix(in oklch, var(--brand) 70%, black);
  --brand-800: color-mix(in oklch, var(--brand) 50%, black);
  --brand-900: color-mix(in oklch, var(--brand) 25%, black);

  /* Transparent overlays */
  --brand-glass:  color-mix(in srgb, var(--brand) 12%, transparent);
  --brand-subtle: color-mix(in srgb, var(--brand) 18%, transparent);
}
```

**Why `oklch` in color-mix?** Produces perceptually uniform blends — no desaturated gray zones you get in srgb.

### Relative Color Syntax — Derive Variants from Base

```css
:root {
  --brand: hsl(18 85% 52%);

  /* Dark: same hue/sat, lightness -15% */
  --brand-dark:  hsl(from var(--brand) h s calc(l - 15%));

  /* Muted: same hue, reduced saturation */
  --brand-muted: hsl(from var(--brand) h calc(s - 30%) l);

  /* Complementary: hue rotated 180° */
  --brand-comp:  hsl(from var(--brand) calc(h + 180) s l);

  /* Analogous: hue rotated 30° */
  --brand-warm:  hsl(from var(--brand) calc(h - 30) s l);
}
```

---

## Semantic Color System

Map functional meaning onto palette values — keep design decisions in one place:

```css
:root {
  /* Status colors — WCAG AA on dark background */
  --color-success:  oklch(65% 0.20 145);   /* green */
  --color-warning:  oklch(78% 0.20 80);    /* amber */
  --color-error:    oklch(60% 0.22 20);    /* red */
  --color-info:     oklch(68% 0.18 240);   /* blue */

  /* Transparent status fills (for badges, alerts) */
  --color-success-bg: oklch(65% 0.20 145 / 0.12);
  --color-warning-bg: oklch(78% 0.20 80  / 0.12);
  --color-error-bg:   oklch(60% 0.22 20  / 0.12);
  --color-info-bg:    oklch(68% 0.18 240 / 0.12);
}
```

---

## Contrast Ratios — WCAG Requirements

```css
/* Test your color combinations */
/* WCAG AA: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px bold+) */
/* WCAG AAA: 7:1 for normal text */

/* oklch(95% 0.006 240) on oklch(9% 0.04 245) ≈ 17:1 — AAA */
/* oklch(68% 0.012 230) on oklch(9% 0.04 245) ≈ 6:1 — AA */
/* oklch(48% 0.012 230) on oklch(9% 0.04 245) ≈ 3.5:1 — AA large only */

/* Chroma (saturation) drops with lightness — at L=85%+, chroma max ≈ 0.12-0.15 */
/* At L=50%, you can push chroma to 0.25-0.30 */
```

---

## Glassmorphism Recipe

Works **only** when there is texture, gradient, or image behind it — never on solid flat backgrounds.

```css
/* Depth 1 — Card backgrounds, secondary elements */
.glass-1 {
  background: oklch(100% 0 0 / 0.04);
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
  border: 1px solid oklch(100% 0 0 / 0.08);
  border-radius: var(--radius-lg);
}

/* Depth 2 — Main panels, overlays */
.glass-2 {
  background: oklch(100% 0 0 / 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid oklch(100% 0 0 / 0.14);
  box-shadow: 0 8px 32px oklch(0% 0 0 / 0.25);
  border-radius: var(--radius-lg);
}

/* Depth 3 — Tooltips, popovers, foreground elements */
.glass-3 {
  background: oklch(100% 0 0 / 0.15);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid oklch(100% 0 0 / 0.2);
  box-shadow: 0 16px 48px oklch(0% 0 0 / 0.35);
  border-radius: var(--radius-md);
}

/* Dark glassmorphism variant — for light backgrounds */
.glass-dark {
  background: oklch(0% 0 0 / 0.06);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid oklch(0% 0 0 / 0.1);
}
```

---

## Gradient Patterns — Sophisticated, Not Clichéd

```css
/* ✅ Sophisticated gradients */

/* Hue-shifted gradient — feels organic, not flat */
.gradient-hue-shift {
  background: linear-gradient(
    135deg,
    oklch(62% 0.22 30)  0%,      /* brand orange */
    oklch(60% 0.22 340) 50%,     /* shifted to magenta */
    oklch(58% 0.22 280) 100%     /* to violet */
  );
}

/* Mesh gradient — layered radial gradients */
.gradient-mesh {
  background:
    radial-gradient(circle at 30% 20%, oklch(62% 0.22 30  / 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, oklch(65% 0.20 340 / 0.4) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, oklch(60% 0.18 200 / 0.2) 0%, transparent 70%),
    var(--bg);
}

/* ❌ Overused gradients — never use these */
/* linear-gradient(135deg, #667eea 0%, #764ba2 100%) */
/* linear-gradient(to right, #f093fb, #f5576c) */
/* linear-gradient(to right, #4facfe 0%, #00f2fe 100%) */
```

---

## Aurora / Animated Mesh Gradient

```css
.aurora-bg {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%,
      oklch(62% 0.22 30 / 0.35) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 60%,
      oklch(65% 0.20 280 / 0.28) 0%, transparent 50%),
    radial-gradient(ellipse 100% 80% at 50% 100%,
      oklch(60% 0.18 200 / 0.18) 0%, transparent 60%),
    var(--surface-1);
  background-size: 200% 200%;
  animation: aurora-drift 14s ease-in-out infinite alternate;
}

@keyframes aurora-drift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 30% 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-bg { animation: none; }
}
```

---

## Grain Texture — CSS-Only Depth

Adds premium tactile feel to any background. No image file required.

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

## Neon Glow System

```css
/* Text neon */
.neon-text {
  color: var(--brand);
  text-shadow:
    0 0 7px  var(--brand),
    0 0 21px var(--brand),
    0 0 42px color-mix(in srgb, var(--brand) 60%, transparent);
}

/* Box neon border */
.neon-border {
  border: 1px solid var(--brand);
  box-shadow:
    0 0 5px  color-mix(in srgb, var(--brand) 40%, transparent),
    0 0 20px color-mix(in srgb, var(--brand) 25%, transparent),
    inset 0 0 5px color-mix(in srgb, var(--brand) 15%, transparent);
}

/* Pulsing neon animation */
.neon-pulse {
  animation: neon-flicker 2.5s ease-in-out infinite alternate;
}

@keyframes neon-flicker {
  0%, 100% {
    text-shadow:
      0 0 7px var(--brand),
      0 0 21px var(--brand),
      0 0 42px color-mix(in srgb, var(--brand) 60%, transparent);
  }
  50% {
    text-shadow:
      0 0 4px var(--brand),
      0 0 12px var(--brand);
  }
}

@media (prefers-reduced-motion: reduce) {
  .neon-pulse { animation: none; }
}
```

---

## Dark Mode Toggle — CSS-Only Pattern

```css
/* Single source of truth via [data-theme] on <html> */
:root,
[data-theme="dark"] {
  --bg:       oklch(9%  0.04 245);
  --surface-1: oklch(12% 0.045 245);
  --text-1:   oklch(95% 0.006 240);
  --text-2:   oklch(68% 0.012 230);
}

[data-theme="light"] {
  --bg:       oklch(98% 0.003 80);
  --surface-1: oklch(94% 0.006 80);
  --text-1:   oklch(18% 0.04 60);
  --text-2:   oklch(48% 0.025 65);
}

/* Respect OS preference by default */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    --bg:       oklch(98% 0.003 80);
    --surface-1: oklch(94% 0.006 80);
    --text-1:   oklch(18% 0.04 60);
    --text-2:   oklch(48% 0.025 65);
  }
}
```

```javascript
// Toggle with localStorage persistence
function toggleTheme() {
  const current = document.documentElement.dataset.theme ?? 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}

// Apply on page load before render (prevents flash)
;(function() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
})();
```

---

## Forced Colors Mode — Accessibility

Always provide fallbacks for Windows High Contrast / forced-colors mode:

```css
@media (forced-colors: active) {
  /* Gradient text fallback */
  .gradient-text {
    color: ButtonText;
    background: none;
    -webkit-background-clip: initial;
    background-clip: initial;
  }

  /* Custom borders must use system colors */
  .card {
    border: 1px solid ButtonText;
  }

  /* Brand-colored elements */
  .badge {
    border: 1px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }
}
```

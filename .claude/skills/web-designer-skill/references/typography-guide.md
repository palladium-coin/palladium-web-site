# Typography Guide — Font Pairings, Scale & Effects

## Font Pairing Reference

### Pair 1 — Tech Futuristic (Crypto, SaaS, Startup)
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

--font-display: 'Syne', sans-serif;       /* Headings, hero, display */
--font-body: 'Poppins', sans-serif;       /* Everything else */
```
**Character**: Geometric, futuristic, confident. Best for: tech products, crypto, fintech, Web3.

### Pair 2 — Editorial Modern (Blog, Media, Portfolio)
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,100..900;1,100..900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

--font-display: 'Fraunces', serif;        /* Headings, pull quotes, hero */
--font-body: 'DM Sans', sans-serif;       /* Body, UI, captions */
```
**Character**: Elegant, literary, luxury. Best for: editorial, long-form, fashion, portfolio.

### Pair 3 — Creative Energetic (Agency, Music, Art)
```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');

--font-display: 'Bricolage Grotesque', sans-serif;
--font-body: 'Plus Jakarta Sans', sans-serif;
```
**Character**: Dynamic, expressive, contemporary. Best for: creative agency, product launches, bold brands.

### Pair 4 — Minimal Refined (Luxury, Architecture, High Fashion)
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');

--font-display: 'Cormorant Garamond', serif;
--font-body: 'Outfit', sans-serif;
```
**Character**: Classic-modern, refined, whisper-quiet. Best for: luxury brands, architecture, fine dining.

### Pair 5 — Industrial / Raw (Technical, Underground, Music)
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

--font-display: 'Bebas Neue', sans-serif;   /* Uppercase only */
--font-body: 'IBM Plex Mono', monospace;
```
**Character**: Raw, direct, countercultural. Best for: technical portfolio, developer tools, music.

### Pair 6 — Humanist Approachable (Health, Education, Consumer)
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500&display=swap');

--font-display: 'Nunito', sans-serif;
--font-body: 'Inter', sans-serif;
```
**Character**: Friendly, trustworthy, accessible. Best for: healthcare, fintech, consumer apps, educational platforms.

---

## Fluid Type Scale

Replace breakpoint-based font sizing with a single continuous scale:

```css
:root {
  --text-xs:    clamp(0.694rem, 0.65rem + 0.22vw,  0.8rem);    /*  ~11px → 13px */
  --text-sm:    clamp(0.833rem, 0.78rem + 0.27vw,  0.95rem);   /*  ~13px → 15px */
  --text-base:  clamp(1rem,     0.95rem + 0.25vw,  1.1rem);    /*  ~16px → 18px */
  --text-lg:    clamp(1.2rem,   1.1rem  + 0.5vw,   1.4rem);    /*  ~19px → 22px */
  --text-xl:    clamp(1.44rem,  1.3rem  + 0.72vw,  1.75rem);   /*  ~23px → 28px */
  --text-2xl:   clamp(1.728rem, 1.5rem  + 1.14vw,  2.25rem);   /*  ~28px → 36px */
  --text-3xl:   clamp(2.074rem, 1.7rem  + 1.87vw,  3rem);      /*  ~33px → 48px */
  --text-4xl:   clamp(2.488rem, 2rem    + 2.44vw,  4rem);      /*  ~40px → 64px */
  --text-5xl:   clamp(3rem,     2rem    + 5vw,     6rem);      /*  ~48px → 96px */
  --text-hero:  clamp(2.4rem,   8vw,               5.5rem);    /* Responsive hero */
}
```

---

## Typography Rules

### Headings
```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-feature-settings: "kern" 1, "liga" 1, "ss01" 1;
  text-wrap: balance;          /* Distribute lines evenly — prevents orphan words */
}

/* Hero heading — maximum impact */
.hero-title {
  font-size: var(--text-hero);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;           /* Tight for giant headings */
}
```

### Body Text
```css
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

p {
  max-width: 65ch;             /* 65ch ≈ optimal reading width (~600px at 16px) */
  text-wrap: pretty;           /* Prevent orphan lines */
}
```

### Optimal Line Lengths
| Content type | max-width | Why |
|---|---|---|
| Body paragraph | `65ch` | Research: 45-75 characters per line optimal |
| UI labels, captions | `45ch` | Short, scannable |
| Hero/display text | no limit | Large text, not body reading |
| Code blocks | `80ch` | Standard terminal width |

---

## Advanced Typography Effects

### Gradient Text — Canonical Pattern

```css
.gradient-text {
  background: linear-gradient(135deg, var(--brand), oklch(65% 0.20 280));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Required fallback for Windows High Contrast mode */
@media (forced-colors: active) {
  .gradient-text {
    color: ButtonText;
    background: none;
    -webkit-background-clip: initial;
    background-clip: initial;
  }
}
```

### Animated Gradient Text

```css
.text-animated {
  background: linear-gradient(
    270deg,
    var(--brand),
    oklch(65% 0.20 280),
    oklch(70% 0.18 160),
    var(--brand)
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-flow 6s ease infinite;
}

@keyframes gradient-flow {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .text-animated { animation: none; background-position: 50% 50%; }
}
```

### Outlined Text
```css
.text-outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--text-1);
}

/* Partial fill — filled on hover */
.text-outline-fill {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--brand);
  transition: color 0.3s ease;
}
.text-outline-fill:hover {
  color: var(--brand);
}
```

### Text with Background Clip (Image/Texture)
```css
.text-texture {
  background-image: url('texture.jpg');
  background-size: cover;
  background-position: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Variable Fonts — Axis Control

```css
/* Variable font with weight and optical size axes */
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');

.display-variable {
  font-family: 'Inter', sans-serif;
  font-variation-settings: 'wght' 700, 'opsz' 32;
  /* opsz: 14 for small text, 32 for large headings */
  transition: font-variation-settings 0.3s ease;
}

/* Weight animation on hover — premium effect */
.display-variable:hover {
  font-variation-settings: 'wght' 900, 'opsz' 32;
}
```

**Recommended variable fonts:**
- `Inter` (opsz + wght) — universal, clean, technical
- `Fraunces` (opsz + wght + ital + WONK) — editorial, character
- `Syne` (wght 400–800) — geometric, futuristic

---

## Word Reveal Animation

```css
.word-reveal {
  overflow: hidden;
}
.word-reveal span {
  display: inline-block;
  opacity: 0;
  translate: 0 0.6em;
  animation: word-in 0.55s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)) both;
  animation-delay: calc(var(--i, 0) * 0.07s);
}

@keyframes word-in {
  to { opacity: 1; translate: 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .word-reveal span { animation: none; opacity: 1; translate: 0 0; }
}
```

```javascript
// Automatically apply --i to each word of a heading
function splitWords(el) {
  const words = el.textContent.split(' ');
  el.innerHTML = words
    .map((w, i) => `<span style="--i:${i}">${w}</span>`)
    .join(' ');
}

document.querySelectorAll('[data-split-words]').forEach(splitWords);
```

```html
<!-- Usage: -->
<h1 data-split-words>Welcome to the future of mining</h1>
```

---

## Scroll-Driven Typography

```css
/* Heading that scales and fades as it exits the viewport */
.kinetic-exit {
  animation: kinetic-scroll linear both;
  animation-timeline: view();
  animation-range: exit -10% exit 40%;
}

@keyframes kinetic-scroll {
  to {
    opacity: 0;
    scale: 0.8;
    filter: blur(8px);
    translate: 0 -2rem;
  }
}

/* Text that reveals as it enters the viewport */
.kinetic-enter {
  animation: kinetic-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;
}

@keyframes kinetic-in {
  from {
    opacity: 0;
    scale: 1.1;
    letter-spacing: 0.3em;
  }
}

/* Weight shift on scroll — font gets lighter as user scrolls down */
.scroll-weight {
  animation: weight-scroll linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 30%;
}
@keyframes weight-scroll {
  from { font-variation-settings: 'wght' 800; }
  to   { font-variation-settings: 'wght' 300; }
}

@media (prefers-reduced-motion: reduce) {
  .kinetic-exit, .kinetic-enter, .scroll-weight { animation: none; }
}
```

---

## Typographic Rhythm

```css
/* Consistent vertical spacing using line-height units */
:root {
  --lh: 1.7;           /* body line-height multiplier */
  --lh-unit: calc(1rem * var(--lh));  /* 1 baseline unit ≈ 27px */
}

/* Heading spacing — creates visual breathing room */
h1 { margin-bottom: calc(var(--lh-unit) * 1.5); }
h2 { margin-bottom: calc(var(--lh-unit) * 1.25); margin-top: calc(var(--lh-unit) * 2.5); }
h3 { margin-bottom: var(--lh-unit); margin-top: calc(var(--lh-unit) * 2); }

p  { margin-bottom: var(--lh-unit); }
p + p { text-indent: 2em; margin-bottom: 0; }  /* Continuous prose: indent instead of gap */
```

---

## Font Loading Strategy

```html
<!-- In <head> — these MUST come first -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Use display=swap to prevent invisible text during load -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
/* System font stack as fallback — prevents layout shift */
body {
  font-family: var(--font-body, 'Poppins'),
    /* System fonts that match Poppins metrics */
    -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## Typography Anti-Patterns

```css
/* ❌ Never use more than 2 font families */
/* ❌ Never mix more than 2 weights casually — pick intentional contrasts */
/* ❌ Never set body text wider than 75ch */
/* ❌ Never use line-height < 1.4 for body text */
/* ❌ Never use letter-spacing on lowercase body text (only uppercase/caps) */
/* ❌ Never animate font-size — use scale() instead */
/* ❌ Never use text-align: justify without hyphenation */

/* ✅ Letter-spacing only on uppercase labels */
.label-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.08em;    /* ok */
  font-size: 0.75rem;
  font-weight: 700;
}

/* ✅ Never mix display and body font at the same size */
/* Use display font for text ≥ 1.5rem, body font for smaller */
```

# Typography Guide — Coppie di Font e Scale

## Font Pairing Testati

### Pair 1 — Editorial Moderno
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,100..900;1,100..900&family=DM+Sans:wght@300;400;500&display=swap');

--font-display: 'Fraunces', serif;      /* Heading, quote, hero */
--font-body: 'DM Sans', sans-serif;     /* Tutto il resto */
```
**Carattere**: Elegante, letterario, luxury. Per portfolio, blog, fashion, editorial.

### Pair 2 — Tech Futurista
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@300;400;500;600&display=swap');

--font-display: 'Syne', sans-serif;
--font-body: 'Manrope', sans-serif;
```
**Carattere**: Geometrico, futuristico, tech. Per SaaS, startup, app.

### Pair 3 — Creativo Vivace
```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');

--font-display: 'Bricolage Grotesque', sans-serif;
--font-body: 'Plus Jakarta Sans', sans-serif;
```
**Carattere**: Dinamico, espressivo, contemporaneo. Per agency, portfolio creativo.

### Pair 4 — Minimal Raffinato
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Outfit:wght@300;400;500&display=swap');

--font-display: 'Cormorant Garamond', serif;
--font-body: 'Outfit', sans-serif;
```
**Carattere**: Classico-moderno, raffinato. Per luxury brand, architettura, alta moda.

### Pair 5 — Industriale/Brutalist
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

--font-display: 'Bebas Neue', sans-serif;   /* Solo uppercase */
--font-body: 'IBM Plex Mono', monospace;
```
**Carattere**: Raw, diretto, controcorrente. Per portfolio tecnico, music, underground.

---

## Fluid Type Scale

```css
/* Fluid type scale — sostituisce media queries per la tipografia */
:root {
  --text-xs:    clamp(0.694rem, 0.65rem + 0.22vw, 0.8rem);
  --text-sm:    clamp(0.833rem, 0.78rem + 0.27vw, 0.95rem);
  --text-base:  clamp(1rem, 0.95rem + 0.25vw, 1.1rem);
  --text-lg:    clamp(1.2rem, 1.1rem + 0.5vw, 1.4rem);
  --text-xl:    clamp(1.44rem, 1.3rem + 0.72vw, 1.75rem);
  --text-2xl:   clamp(1.728rem, 1.5rem + 1.14vw, 2.25rem);
  --text-3xl:   clamp(2.074rem, 1.7rem + 1.87vw, 3rem);
  --text-4xl:   clamp(2.488rem, 2rem + 2.44vw, 4rem);
  --text-5xl:   clamp(3rem, 2rem + 5vw, 6rem);
  --text-hero:  clamp(3.5rem, 3vw + 5vw, 9rem);
}
```

## Regole Tipografiche

### Heading
```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-feature-settings: "kern" 1, "liga" 1, "ss01" 1;
}

/* Hero heading extra impact */
.hero-title {
  font-size: var(--text-hero);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;    /* tight per heading enormi */
}
```

### Body
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
  max-width: 65ch;    /* Ottimale per leggibilità */
}
```

### Balance e Wrap
```css
/* Moderni: usa text-wrap per headings */
h1, h2, h3 {
  text-wrap: balance;   /* Distribuisce le righe in modo uniforme */
}

p {
  text-wrap: pretty;    /* Evita righe orfane */
}
```

## Effetti Tipografici Avanzati

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Outlined Text
```css
.text-outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--color-text);
}
```

### Text con Texture/Immagine
```css
.text-texture {
  background-image: url('texture.jpg');
  background-size: cover;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Gradient Text — Pattern Canonico

Il metodo più robusto, con fallback per `forced-colors`:

```css
.gradient-text {
  background: linear-gradient(135deg, var(--brand), oklch(65% 0.20 280));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Fallback obbligatorio per forced-color mode (Windows High Contrast) */
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

---

## Variable Fonts — Controllo Asse

```css
/* Variable font con asse weight e optical size */
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');

.display-variable {
  font-family: 'Inter', sans-serif;
  font-variation-settings: 'wght' 700, 'opsz' 32;
  /* opsz: 14 per testo piccolo, 32 per heading grandi */
  transition: font-variation-settings 0.3s ease;
}

/* Animazione peso al hover — effetto premium */
.display-variable:hover {
  font-variation-settings: 'wght' 900, 'opsz' 32;
}

/* Titolo che si alleggerisce scorrendo */
.scroll-weight {
  animation: weight-scroll linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 30%;
}
@keyframes weight-scroll {
  from { font-variation-settings: 'wght' 800; }
  to   { font-variation-settings: 'wght' 300; }
}
```

**Font variabili consigliati:**
- `Inter` (opsz + wght) — universale, tecnico
- `Fraunces` (opsz + wght + ital + WONK) — editoriale, carattere
- `Roboto Flex` (molti assi) — massima flessibilità

---

## Word Reveal Animation

```css
/* Ogni parola/carattere appare con stagger usando --i come inline style */
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
// Applica automaticamente --i a ogni parola di un heading
function splitWords(el) {
  const words = el.textContent.split(' ');
  el.innerHTML = words
    .map((w, i) => `<span style="--i:${i}">${w}</span>`)
    .join(' ');
}

document.querySelectorAll('[data-split-words]').forEach(splitWords);
```

```html
<!-- Uso: -->
<h1 data-split-words>Benvenuto nel futuro del mining</h1>
```

---

## Kinetic Typography — Scroll

```css
/* Heading che scala e sfuma mentre esce dal viewport */
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

/* Testo che si rivela mentre entra */
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

@media (prefers-reduced-motion: reduce) {
  .kinetic-exit, .kinetic-enter { animation: none; }
}
```

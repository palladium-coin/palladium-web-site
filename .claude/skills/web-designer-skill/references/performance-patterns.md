# Performance Patterns — Core Web Vitals e Ottimizzazione

Questi pattern garantiscono che i siti belli siano anche veloci. Un sito lento non è un bel sito.

---

## LCP — Largest Contentful Paint

L'LCP è l'immagine o il blocco di testo più grande visibile al caricamento. Target: < 2.5s.

### Hero Image: massima priorità

```html
<!-- Preload esplicito + priorità alta -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- L'immagine hero NON deve avere loading="lazy" -->
<img
  src="hero.webp"
  alt="Descrizione significativa"
  width="1200"
  height="800"
  fetchpriority="high"
  decoding="async"
>

<!-- Immagine responsive con srcset -->
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

### Font: preconnect prima di tutto

```html
<!-- Questi due link DEVONO essere tra i primissimi nel <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Poi il font stesso -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

---

## CLS — Cumulative Layout Shift

Target: < 0.1. Ogni elemento che si sposta durante il caricamento peggiora il CLS.

### Riserva spazio per contenuto dinamico

```css
/* Usa aspect-ratio per media — previene il reflow */
.media-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-2); /* placeholder mentre carica */
}

.avatar {
  aspect-ratio: 1;
  width: 3rem;
  border-radius: 50%;
  background: var(--surface-2);
}

/* Riserva spazio per numeri che cambiano */
.stat-value {
  min-width: 5ch;          /* evita layout shift quando il numero si aggiorna */
  font-variant-numeric: tabular-nums;  /* cifre a larghezza fissa */
}
```

### Font size-adjust — elimina FOUT layout shift

```css
/* Dichiarala con size-adjust per far combaciare le metriche
   del web font con il font di sistema di fallback */
@font-face {
  font-family: 'Poppins';
  src: url('/fonts/poppins.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;     /* Regola finché il testo non "salta" al caricamento */
  ascent-override: 95%;
}

/* font-display: swap — mostra subito il fallback, poi swappa
   font-display: optional — non swappa se non già in cache */
```

---

## GPU Compositing — Animazioni Fluide

Solo `opacity`, `transform` (translate/scale/rotate), e `filter` vengono eseguiti sulla GPU.
**Mai** animare `left`, `top`, `width`, `height`, `margin`, `padding`.

```css
/* ✅ GPU composited — 60fps garantito */
.smooth-move {
  translate: 0 0;
  transition: translate 0.3s ease;
}
.smooth-move:hover { translate: 0 -4px; }

/* ❌ Causa layout recalculation — evita */
.bad-move {
  position: relative;
  top: 0;
  transition: top 0.3s ease;
}
.bad-move:hover { top: -4px; }
```

### `will-change` — usa con parsimonia

```css
/* ✅ Solo su elementi che si animano frequentemente */
.animated-card {
  will-change: transform;
}

/* Rimuovi will-change quando l'animazione finisce */
.animated-card.animation-done {
  will-change: auto;
}

/* ❌ MAI su tutto o su sezioni statiche */
/* * { will-change: transform; }  DISTRUGGE le performance */
/* section { will-change: transform; }  peggiora il GPU usage */

/* Massimo 5-6 elementi per pagina con will-change attivo */
```

---

## Event Listeners — Passive e Debounce

```javascript
// ✅ Passive listener per scroll — non blocca lo scroll del browser
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('touchstart', onTouch, { passive: true });

// ✅ Debounce per operazioni costose su resize
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

// ✅ requestAnimationFrame per aggiornamenti visivi
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
```

---

## Critical CSS — Inline Above-the-Fold

Per siti vanilla HTML (no bundler), il pattern più efficace per LCP veloce:

```html
<head>
  <!-- 1. Critical CSS inline: tutto ciò che è visibile senza scroll -->
  <style>
    /* Reset minimo, nav, hero, font declarations */
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    :root { --brand: oklch(62% 0.22 30); --surface-1: hsl(220 13% 9%); }
    body { font-family: 'Poppins', system-ui, sans-serif; background: var(--surface-1); }
    .nav { ... }
    .hero { ... }
  </style>

  <!-- 2. Font preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 3. Il resto del CSS caricato in modo non bloccante -->
  <link rel="preload" href="/css/main.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/main.css"></noscript>
</head>
```

---

## Lazy Loading Immagini

```html
<!-- Tutte le immagini SOTTO la fold: loading="lazy" -->
<img src="photo.webp" alt="..." width="800" height="600"
     loading="lazy" decoding="async">
```

```javascript
// Lazy loading con IntersectionObserver per browser non supportati
// o per immagini con effetti di reveal
const imgObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const img = e.target;
      img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.classList.add('loaded');
      imgObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '200px 0px',  // pre-carica 200px prima che l'immagine entri in viewport
  threshold: 0,
});

document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
```

```css
/* Fade in immagini al caricamento */
img[data-src] {
  opacity: 0;
  transition: opacity 0.4s ease;
}
img.loaded {
  opacity: 1;
}
```

---

## Bundle e Script — Caricamento Ottimizzato

```html
<!-- Script non critico: defer o async -->
<script src="/js/analytics.js" defer></script>
<script src="/js/chat-widget.js" async></script>

<!-- Script critico (interattività iniziale): defer con priorità -->
<script src="/js/main.js" defer></script>

<!-- Inline script piccoli che devono girare subito: ok in <head> -->
<script>
  // Solo: dark mode init, viewport fix, feature detection
  const theme = localStorage.getItem('theme');
  if (theme) document.documentElement.dataset.theme = theme;
</script>
```

---

## Formato Immagini

| Formato | Usa per | Note |
|---|---|---|
| **WebP** | Foto, screenshot | 25-35% più piccolo di JPEG |
| **AVIF** | Foto di alta qualità | 50% più piccolo di JPEG, supporto crescente |
| **SVG** | Icone, loghi, illustrazioni | Infinitamente scalabile |
| **PNG** | Immagini con trasparenza complessa | Solo se SVG non è possibile |

```html
<!-- Picture element: AVIF → WebP → JPEG fallback -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="..." width="1200" height="800" fetchpriority="high">
</picture>
```

---
name: web-designer
description: >
  Expert modern web designer skill for creating visually stunning, contemporary websites and web interfaces.
  Use this skill whenever the user wants to build or redesign a website, landing page, portfolio, SaaS homepage,
  e-commerce page, blog, product page, or any web presence that needs to look professional and modern.
  Also trigger for requests like "make it look professional", "redesign this site", "create a beautiful web page",
  "I need a website for my business/project/portfolio", "make this more modern", "create a stunning UI",
  "web design", "website layout", or any task involving the overall visual identity and structure of a web project.
  This skill produces complete, deployable HTML/CSS/JS or React code following current design trends (2024-2025)
  with attention to aesthetics, UX, performance, and accessibility.
---

# Web Designer Skill

Produci siti web moderni, accattivanti e funzionali che impressionano. Il codice deve essere **immediatamente deployabile**, esteticamente superiore, e costruito con intenzione progettuale chiara.

---

## 1. Processo di Design

### Fase 1 — Comprendi il Contesto
Prima di scrivere una riga di codice, rispondi a:
- **Chi è l'utente target?** (età, settore, aspettative)
- **Qual è l'obiettivo principale?** (conversione, portfolio, informazione, vendita)
- **Qual è la brand personality?** (serio/istituzionale, creativo/edgy, minimal/luxury, friendly/playful)
- **Esiste un sistema di colori o font già definito?** Se no, crea il tuo.

### Fase 2 — Scegli una Direzione Estetica
Impegnati su **una** direzione e eseguila con precisione. Esempi di direzioni 2024-2025:

| Direzione | Caratteristiche chiave |
|---|---|
| **Glassmorphism evoluto** | Frosted glass layers, blur stratificati, bordi luminosi |
| **Bento Grid** | Layout a cards asimmetriche tipo Apple, grandi spazi bianchi |
| **Brutalist moderno** | Tipografia oversized, contrasti estremi, grid non convenzionale |
| **Organic/Blob** | Forme fluide, gradienti morbidi, layout non rettangolare |
| **Editorial/Magazine** | Gerarchie tipografiche forti, fotografia dominante, griglia variabile |
| **Dark luxury** | Sfondi quasi neri, dettagli dorati/cromatici, animazioni eleganti |
| **Neumorphism soft** | Ombre morbide, profondità sottile, palette neutri |
| **Aurora/Mesh gradient** | Gradienti mesh colorati come cieli nordici, semi-trasparenti |

**NON scegliere mai** la direzione più ovvia o quella che "fa AI": gradienti viola su bianco, Inter + card con shadow standard, hero con blob animato generico.

---

## 2. Principi Tecnici

### CSS Architecture
```css
/* Usa sempre CSS Custom Properties per tutto il design system */
:root {
  /* Palette semantica */
  --color-surface:     #0a0a0f;
  --color-surface-2:   #13131a;
  --color-primary:     #6c63ff;
  --color-accent:      #ff6b6b;
  --color-text:        #f0f0f5;
  --color-text-muted:  #8888aa;

  /* Typography scale */
  --text-xs:    clamp(0.75rem, 1.5vw, 0.875rem);
  --text-sm:    clamp(0.875rem, 1.8vw, 1rem);
  --text-base:  clamp(1rem, 2vw, 1.125rem);
  --text-lg:    clamp(1.125rem, 2.5vw, 1.375rem);
  --text-xl:    clamp(1.375rem, 3vw, 1.75rem);
  --text-2xl:   clamp(1.75rem, 4vw, 2.5rem);
  --text-3xl:   clamp(2.5rem, 6vw, 4rem);
  --text-hero:  clamp(3rem, 10vw, 8rem);

  /* Spacing system (8pt grid) */
  --space-1: 0.5rem;    /* 8px */
  --space-2: 1rem;      /* 16px */
  --space-3: 1.5rem;    /* 24px */
  --space-4: 2rem;      /* 32px */
  --space-6: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-12: 6rem;     /* 96px */
  --space-16: 8rem;     /* 128px */

  /* Radius */
  --radius-sm:   4px;
  --radius-md:   12px;
  --radius-lg:   24px;
  --radius-xl:   40px;
  --radius-full: 9999px;

  /* Transitions */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
}
```

### Typography — Regole d'Oro
- **Mai** usare font di sistema come fallback principale (Arial, Helvetica, system-ui come scelta primaria)
- Carica sempre da Google Fonts o usa font moderni. Stack consigliati:
  - Display: `Playfair Display`, `Fraunces`, `Cabinet Grotesk`, `Syne`, `Clash Display`, `Bebas Neue`
  - Body: `DM Sans`, `Plus Jakarta Sans`, `Outfit`, `Bricolage Grotesque`, `Manrope`
  - Mono (accenti): `JetBrains Mono`, `Fira Code`, `Space Mono`
- Usa `clamp()` per fluid typography — niente media queries solo per i font
- Contrasto minimo: **4.5:1** per testo normale, **3:1** per testo grande (WCAG AA)
- Line-height: 1.2–1.4 per heading, 1.6–1.8 per body
- Letter-spacing: -0.02em a -0.04em per heading grandi, normale per body

### Layout Moderno
```css
/* Container responsive senza magic numbers */
.container {
  width: min(90%, 1200px);
  margin-inline: auto;
  padding-inline: var(--space-4);
}

/* Grid fluido per card layout */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: var(--space-4);
}

/* Bento grid asimmetrico */
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: var(--space-3);
}
```

### Animazioni — Gerarchia delle Priorità
1. **Page load**: Staggered reveal con `animation-delay` (0ms, 100ms, 200ms, 300ms...)
2. **Scroll**: Intersection Observer per fade-in/slide-in degli elementi
3. **Hover**: Trasformazioni leggere su card e bottoni (scale, translateY, box-shadow)
4. **Micro-interactions**: Feedback visivo su click/focus

```javascript
// Pattern Intersection Observer standard
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

```css
[data-animate] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--duration-slow) var(--ease-out-expo),
              transform var(--duration-slow) var(--ease-out-expo);
}
[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 3. Componenti Essenziali

### Hero Section — Checklist
- [ ] Headline a tutta larghezza o quasi, con peso visivo estremo
- [ ] Sottotitolo conciso (max 2 righe) che chiarisce il valore
- [ ] CTA primario prominente + CTA secondario opzionale
- [ ] Elemento visivo di supporto (immagine, video, 3D, gradient, canvas)
- [ ] Social proof immediato (logo strip, numero utenti, rating)
- [ ] Scroll indicator o freccia verso il basso

### Navigation
```html
<!-- Pattern moderno: glassmorphism sticky nav -->
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav__inner">
    <a href="/" class="nav__logo" aria-label="Homepage">
      <!-- Logo SVG inline preferito -->
    </a>
    <ul class="nav__links" role="list">
      <!-- voci menu -->
    </ul>
    <div class="nav__actions">
      <!-- CTA -->
    </div>
    <button class="nav__toggle" aria-expanded="false" aria-controls="mobile-menu">
      <!-- Hamburger accessibile -->
    </button>
  </div>
</nav>
```

### Card Components
- Usa `backdrop-filter: blur()` per glassmorphism
- Border: `1px solid rgba(255,255,255,0.1)` su dark, `1px solid rgba(0,0,0,0.08)` su light
- Hover: `translateY(-4px)` + aumento di `box-shadow`
- Mai bordi troppo spessi o colori flat su card importanti

---

## 4. Tendenze 2024-2025 da Implementare

### ✅ Fare Sempre
- **Fluid typography** con `clamp()`
- **Container queries** per componenti adattivi (non solo viewport)
- **CSS Grid** per layout complessi (non solo flexbox)
- **Scroll-driven animations** (CSS o JS) per storytelling
- **Dark mode** come prima scelta o come alternativa nativamente supportata
- **Focus visible** custom per accessibilità tastiera elegante
- **Loading skeleton** per stati di caricamento (mai spinner generici)
- **Aspect-ratio** CSS per immagini responsive senza JS

### ❌ Mai Fare
- Hero con gradient `linear-gradient(135deg, #667eea, #764ba2)` (cliché assoluto)
- Font Inter o Roboto come scelta principale di design
- Box-shadow `0 4px 6px rgba(0,0,0,0.1)` su tutto
- Bottoni con `border-radius: 4px` su tema moderno
- Padding simmetrico ovunque (usa asimmetria con intenzione)
- `transition: all 0.3s ease` (performa male, troppo generico)
- Colori #ffffff puro e #000000 puro (usa near-white/near-black)

---

## 5. Performance & Accessibilità

### Performance — Obbligatorio
```html
<!-- Font loading ottimizzato -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Immagini responsive -->
<img 
  src="image.webp" 
  alt="Descrizione significativa"
  width="800" 
  height="600"
  loading="lazy"
  decoding="async"
>

<!-- Critical CSS inline, resto defer -->
<style>/* above-the-fold CSS qui */</style>
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

### Accessibilità — Non Opzionale
- `alt` su tutte le immagini (vuoto `alt=""` per decorative)
- `aria-label` su icone e bottoni senza testo
- Struttura heading logica: un solo `<h1>`, poi `<h2>`, `<h3>`...
- `prefers-reduced-motion` rispettato:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Focus ring visibile e personalizzato
- Skip navigation link come primo elemento

---

## 6. Stack Tecnologici per Contesto

| Contesto | Stack Consigliato |
|---|---|
| Sito statico / landing page | HTML + CSS + Vanilla JS (zero dipendenze) |
| Sito con contenuti dinamici | HTML + Alpine.js o HTMX |
| Web app / dashboard | React + Vite + CSS Modules o Tailwind |
| Portfolio / blog | HTML statico con CSS animato |
| E-commerce semplice | HTML + Vanilla JS |
| Componente React isolato | React + Tailwind (se disponibile) |

Per **Claude.ai Artifacts**: preferisci HTML single-file o JSX con Tailwind.
Per **Claude Code**: usa lo stack che l'utente ha già o quello più appropriato al progetto.

---

## 7. Checklist Finale Prima di Consegnare

### Design
- [ ] La direzione estetica è chiara e coerente dall'header al footer?
- [ ] La tipografia crea gerarchia visiva immediata?
- [ ] Il contrasto colori supera WCAG AA?
- [ ] Le animazioni aggiungono valore (non distrazione)?
- [ ] Il layout è interessante e non generico?

### Codice
- [ ] CSS Custom Properties usate per tutto il design system? (nessun hex hardcoded nei componenti)
- [ ] Fluid typography con `clamp()`?
- [ ] Responsive senza media queries ridondanti?
- [ ] Container queries usate per almeno 2 componenti riusabili?
- [ ] Immagini con `alt`, `width`, `height`, `loading="lazy"`?
- [ ] `prefers-reduced-motion` gestito?
- [ ] Heading semanticamente corretti?
- [ ] Codice leggibile e commentato nei punti complessi?

### UX
- [ ] Il CTA principale è immediatamente visibile?
- [ ] Il percorso utente è chiaro?
- [ ] Ogni elemento interattivo ha 3 stati: default, hover, focus-visible?
- [ ] Il sito funziona senza JS (progressive enhancement)?

### Performance
- [ ] Hero image ha `fetchpriority="high"` + `width`/`height` espliciti?
- [ ] Font con `<link rel="preconnect">` prima del caricamento?
- [ ] `will-change: transform` applicato solo su elementi animati (max 5-6 in pagina)?
- [ ] Animazioni usano `translate`/`scale`/`opacity` — mai `left`/`top`/`width`?

### Dark Mode (se implementata)
- [ ] Tutti i colori via token `var(--token)`, zero hex hardcoded?
- [ ] Immagini con `filter: brightness(0.9)` in dark mode?
- [ ] SVG icone con `currentColor`?
- [ ] Glassmorphism testato: opacità adeguata su sfondo scuro?

---

## 8. Tecniche Avanzate

### Dark Mode Architecture

Sistema CSS-first con toggle manuale + rispetto OS preference:

```css
:root {
  color-scheme: light dark;
  --surface-1: hsl(0 0% 100%);
  --surface-2: hsl(0 0% 96%);
  --text-1:    hsl(220 10% 10%);
  --text-2:    hsl(220 10% 35%);
  --border:    hsl(220 10% 86%);
}

/* OS preference (senza toggle) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --surface-1: hsl(220 13% 9%);
    --surface-2: hsl(220 13% 13%);
    --text-1:    hsl(220 10% 94%);
    --text-2:    hsl(220 10% 65%);
    --border:    hsl(220 13% 22%);
  }
}

/* Toggle manuale via JS */
[data-theme="dark"] {
  --surface-1: hsl(220 13% 9%);
  --surface-2: hsl(220 13% 13%);
  --text-1:    hsl(220 10% 94%);
  --text-2:    hsl(220 10% 65%);
  --border:    hsl(220 13% 22%);
}

/* Immagini più morbide in dark */
[data-theme="dark"] img:not([data-no-dim]),
@media (prefers-color-scheme: dark) {
  img:not([data-no-dim]) { filter: brightness(0.9); }
}
```

```javascript
// Persistenza preferenza utente
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.dataset.theme = saved;

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}
```

**Regole fondamentali dark mode:**
- Mai hex/rgb diretti nei componenti — solo `var(--token)`
- SVG sempre con `currentColor` per ereditare il colore testo
- `--brand` non cambia tra light/dark; cambia solo `--brand-subtle` (trasparenza)

---

### Scroll-Driven Animations (CSS Nativo — Chrome 115+)

```css
/* Fade-in su scroll: zero JS */
@supports (animation-timeline: scroll()) {
  .reveal {
    animation: fade-up linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 30%;
  }
}

@keyframes fade-up {
  from { opacity: 0; translate: 0 2rem; }
  to   { opacity: 1; translate: 0 0; }
}

/* Scroll progress bar CSS-only */
.scroll-bar {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: var(--brand);
  transform-origin: left;
  animation: progress-grow linear;
  animation-timeline: scroll(root);
  z-index: 1000;
}
@keyframes progress-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

```javascript
// Fallback per Safari < 17
if (!CSS.supports('animation-timeline: scroll()')) {
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
```

```css
/* Fallback CSS */
.reveal { opacity: 0; transform: translateY(1.5rem); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
```

---

### Container Queries

Usa `@container` per i componenti, `@media` solo per il layout di pagina.

```css
/* Definisci il contesto sul wrapper */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Il componente si adatta al suo contesto, non al viewport */
@container card (min-width: 420px) {
  .card-inner {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
  }
}
```

---

### @property — Custom Properties Animabili

```css
/* Gradiente con angolo animato */
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 135deg;
}

.animated-gradient-bg {
  background: linear-gradient(var(--gradient-angle), var(--brand), oklch(65% 0.20 280));
  animation: spin-gradient 6s linear infinite;
}

@keyframes spin-gradient {
  to { --gradient-angle: 495deg; }
}

/* Counter animato CSS-only */
@property --num {
  syntax: '<integer>';
  inherits: false;
  initial-value: 0;
}

.counter-css {
  counter-reset: num var(--num);
  animation: count-up 2s ease-out forwards;
  /* Imposta --target come inline style: style="--target: 1500" */
}
.counter-css::after { content: counter(num); }

@keyframes count-up {
  to { --num: var(--target, 100); }
}
```

---

### Design Audit Mode

Quando invocata su un sito **esistente**, prima di proporre modifiche eseguire un audit rapido:

| Dimensione | Domanda |
|---|---|
| **Token system** | I colori sono in CSS custom properties o hardcoded? |
| **Scala tipografica** | I font-size usano `clamp()` o valori fissi? |
| **Spacing system** | Gli spazi seguono una griglia (es. 8pt) o sono arbitrari? |
| **Motion strategy** | Nessuna animazione / base / intenzionale? |
| **Dark mode** | Assente / parziale / completa con token? |
| **Stati componenti** | Solo default o anche hover/focus/loading/error? |

Poi proporre miglioramenti **mirati** per dimensione, in ordine di impatto visivo.

---

## 9. Risorse di Riferimento

Per approfondimenti specifici, leggi i file in `references/`:
- `references/color-systems.md` — Sistemi colore avanzati, OKLCH, palette generation, aurora, grain, neon
- `references/typography-guide.md` — Coppie di font, scale tipografiche, fluid type, variable fonts, gradient text
- `references/animation-patterns.md` — Spring physics, magnetic cursor, View Transitions, counter, skeleton
- `references/layout-patterns.md` — Bento grid, subgrid, sticky-story, asymmetric layouts
- `references/interactions-and-effects.md` — Glassmorphism depth, SVG filters, micro-interactions, aurora canvas, custom cursor
- `references/performance-patterns.md` — Core Web Vitals, GPU compositing, lazy loading, critical CSS
- `references/component-patterns.md` — Libreria componenti pronti: stat card, accordion, toast, badge

---

> **Ricorda**: Un sito web non è solo codice funzionante — è un'esperienza. Ogni dettaglio conta: il cursore al hover, il modo in cui gli elementi entrano in viewport, il bilanciamento tra testo e spazio vuoto. Esegui con la stessa cura di un designer professionista.

# Layout Patterns — Grid e Composizioni Moderne

## Bento Grid (stile Apple 2024)

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 16px;
}

/* Esempio: layout 4 card con pesi diversi */
.bento-hero    { grid-column: span 8; grid-row: span 3; }
.bento-tall    { grid-column: span 4; grid-row: span 3; }
.bento-wide    { grid-column: span 6; grid-row: span 2; }
.bento-small   { grid-column: span 3; grid-row: span 1; }

/* Responsive: collassa su mobile */
@media (max-width: 768px) {
  .bento-grid > * { grid-column: span 12 !important; }
}
```

## Masonry Layout (CSS puro)

```css
.masonry {
  columns: 3 300px;
  column-gap: 1.5rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}
```

## Split Layout Hero

```css
.split-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
}

.split-hero__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-16) var(--space-8);
}

.split-hero__visual {
  position: relative;
  overflow: hidden;
}

@media (max-width: 900px) {
  .split-hero { grid-template-columns: 1fr; }
  .split-hero__visual { min-height: 40svh; }
}
```

## Sticky Scroll Sections

```css
/* Pattern "sticky sidebar + scrolling content" */
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
}
```

## Full-bleed Section

```css
/* Elemento che sfonda il container */
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
```

## Overlay Grid (testo sopra immagine)

```css
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
  position: relative;  /* sopra l'immagine */
  z-index: 1;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.8) 0%,
    transparent 60%
  );
}
```

## Feature Grid con Connectors

```css
/* Grid di feature con icone grandi e linee di connessione */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;    /* No gap, usiamo border */
}

.feature-card {
  padding: var(--space-8) var(--space-6);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.feature-card:nth-child(3n) { border-right: none; }
.feature-card:nth-last-child(-n+3) { border-bottom: none; }

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .feature-card { border-right: none; }
}
```

## Testimonials Marquee (scroll infinito)

```css
.marquee {
  display: flex;
  overflow: hidden;
  mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee__track {
  display: flex;
  gap: 1.5rem;
  animation: marquee 30s linear infinite;
  flex-shrink: 0;
}

/* Duplica il contenuto per loop senza gap */
.marquee__track--clone { animation-delay: -15s; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - 1.5rem)); }
}

.marquee:hover .marquee__track { animation-play-state: paused; }
```

## Horizontal Scroll Section

```css
.h-scroll-container {
  overflow: hidden;
}

.h-scroll-track {
  display: flex;
  gap: 2rem;
  transition: transform 0.6s var(--ease-out-expo);
  will-change: transform;
}

.h-scroll-item {
  flex-shrink: 0;
  width: min(400px, 80vw);
}
```

## Navbar Patterns

```css
/* Glassmorphism sticky nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(var(--surface-base-rgb), 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
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

/* Nav links */
.nav__links {
  display: flex;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__link {
  padding: 0.4em 0.8em;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
  text-decoration: none;
}

.nav__link:hover {
  color: var(--text);
  background: var(--surface-overlay);
}

.nav__link.active {
  color: var(--text);
  background: var(--surface-raised);
}
```

## Footer Moderno

```css
.footer {
  padding: var(--space-16) 0 var(--space-6);
  border-top: 1px solid var(--border);
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.footer__brand { 
  /* Logo + tagline + social */
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
  color: var(--text-subtle);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer__grid { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: span 2; }
}
```

---

## Subgrid — Card con Allineamento Interno

Quando più card in griglia devono avere heading/body/footer allineati tra loro:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Ogni card occupa 3 righe: header / content / footer */
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;  /* eredita la riga dalla griglia padre */
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  gap: 0.75rem;
}

.card__header { /* row 1 — stesso livello in tutte le card */ }
.card__body   { /* row 2 — si estende in modo uniforme */ }
.card__footer { align-self: end; /* row 3 — sempre al fondo */ }
```

**Compatibilità**: Chrome 117+, Firefox 71+, Safari 16+. Per browser più vecchi, usa `display: flex; flex-direction: column` con `flex: 1` sul body.

---

## Hero Full-Bleed Moderno

```css
/* min-height: 100svh usa "small viewport height" — evita il problema
   della toolbar mobile che copre il contenuto */
.hero-full {
  min-height: 100svh;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  padding: var(--space-8) var(--space-4);
}

/* Layer sfondo: aurora/gradiente separato dal contenuto */
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

/* Split hero 50/50 */
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
    padding: var(--space-8) 0;
  }
}
```

---

## Sticky Story — Scroll Narrativo

Layout in cui il pannello sinistro rimane fisso mentre il contenuto a destra scorre.
Ideale per feature showcase, onboarding, storytelling di prodotto.

```css
.sticky-story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* Il pannello visivo rimane centrato verticalmente nel viewport */
.sticky-story__visual {
  position: sticky;
  top: calc(50vh - 200px);   /* centrato: metà schermo meno metà altezza */
  height: 400px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.5s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

/* I "passi" della storia scorrono normalmente */
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
  .sticky-story {
    grid-template-columns: 1fr;
  }
  .sticky-story__visual {
    position: relative;
    top: auto;
    height: 250px;
  }
}
```

```javascript
// Aggiorna il pannello visivo in base allo step attivo
function initStickyStory(containerSelector = '.sticky-story') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const steps  = container.querySelectorAll('.sticky-story__steps > *');
  const visual = container.querySelector('.sticky-story__visual');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        steps.forEach(s => s.classList.remove('is-active'));
        e.target.classList.add('is-active');
        // Aggiorna il contenuto del pannello visivo
        const img = e.target.dataset.visual;
        if (img && visual) visual.style.backgroundImage = `url(${img})`;
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(s => io.observe(s));
}
```

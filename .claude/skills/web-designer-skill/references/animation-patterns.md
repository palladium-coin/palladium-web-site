# Animation Patterns — Libreria CSS/JS

## Page Load — Staggered Reveal (il più importante)

```css
/* Elementi da animare al caricamento */
.hero-title    { animation: fadeUp 0.8s var(--ease-out-expo) both; }
.hero-sub      { animation: fadeUp 0.8s var(--ease-out-expo) 0.1s both; }
.hero-cta      { animation: fadeUp 0.8s var(--ease-out-expo) 0.2s both; }
.hero-visual   { animation: fadeIn 1s ease 0.3s both; }
.nav           { animation: slideDown 0.6s var(--ease-out-expo) both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## Scroll Animations — Intersection Observer

```javascript
// Setup universale
const observerConfig = { threshold: 0.1, rootMargin: '0px 0px -80px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger per gruppi di elementi
      const siblings = entry.target.parentElement?.querySelectorAll('[data-animate]');
      const index = siblings ? Array.from(siblings).indexOf(entry.target) : 0;
      
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, index * 80);   // 80ms stagger tra elementi fratelli
    }
  });
}, observerConfig);

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

```css
/* Varianti di animazione — applica con data-animate="tipo" */
[data-animate] {
  opacity: 0;
  transition: opacity 0.7s var(--ease-out-expo),
              transform 0.7s var(--ease-out-expo);
}

/* Default: fade up */
[data-animate].in-view { opacity: 1; transform: none; }
[data-animate]:not(.in-view) { transform: translateY(24px); }

/* Fade in semplice */
[data-animate="fade"]:not(.in-view) { transform: none; }

/* Slide from left */
[data-animate="left"]:not(.in-view) { transform: translateX(-40px); }

/* Slide from right */
[data-animate="right"]:not(.in-view) { transform: translateX(40px); }

/* Scale up */
[data-animate="scale"]:not(.in-view) { transform: scale(0.92); }
```

## Hover Effects — Card

```css
/* Card con lift e glow */
.card {
  transition: 
    transform 0.3s var(--ease-out-expo),
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px var(--primary);
}

/* Card con gradient reveal */
.card-gradient {
  position: relative;
  overflow: hidden;
}
.card-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  opacity: 0;
  transition: opacity 0.4s ease;
}
.card-gradient:hover::before { opacity: 0.08; }

/* Magnetic card effect (JS richiesto) */
```

```javascript
// Magnetic hover effect per card premium
document.querySelectorAll('.card-magnetic').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
```

## Buttons

```css
/* Bottone primario moderno */
.btn-primary {
  position: relative;
  overflow: hidden;
  padding: 0.75em 1.75em;
  background: var(--primary);
  border-radius: var(--radius-full);
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.4);
}
.btn-primary:hover::after { background: rgba(255,255,255,0.08); }
.btn-primary:active { transform: translateY(0); }

/* Bottone outline con shimmer */
.btn-outline {
  position: relative;
  padding: 0.75em 1.75em;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-full);
  background: transparent;
  overflow: hidden;
}
.btn-outline::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transition: left 0.5s ease;
}
.btn-outline:hover::before { left: 100%; }
```

## Loader / Skeleton

```css
/* Skeleton screen — mai il classico spinner */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-raised) 25%,
    var(--surface-overlay) 50%,
    var(--surface-raised) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Cursor Personalizzato

```javascript
// Custom cursor per siti premium
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
});

document.querySelectorAll('a, button, [data-cursor="pointer"]').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
```

```css
.custom-cursor {
  position: fixed;
  top: -8px; left: -8px;
  width: 16px; height: 16px;
  background: var(--primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.3s, height 0.3s, background 0.3s, top 0.3s, left 0.3s;
  transition-timing-function: var(--ease-out-expo);
  mix-blend-mode: difference;
}
.custom-cursor.hover {
  top: -20px; left: -20px;
  width: 40px; height: 40px;
  background: white;
}
```

## Scroll Progress Bar

```javascript
const progressBar = document.querySelector('.scroll-progress');
document.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrolled / total})`;
});
```

```css
.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left;
  z-index: 100;
}
```

---

## Spring Physics — Easing Avanzato

Sostituisci `ease` e `ease-in-out` generici con curve spring per animazioni fisicamente credibili:

```css
:root {
  /* Bounce — per bottoni, card, elementi che "rimbalzano" */
  --spring-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Smooth — per transizioni fluide senza rimbalzo */
  --spring-smooth:  cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Snappy — per feedback rapido (click, toggle) */
  --spring-snappy:  cubic-bezier(0.68, -0.55, 0.27, 1.55);

  /* Expo out — per animazioni di entrata */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);

  /* Quart in-out — per transizioni di pagina */
  --ease-inout-quart: cubic-bezier(0.76, 0, 0.24, 1);
}

/* Esempio uso: */
.btn-spring {
  transition:
    transform 0.4s var(--spring-bounce),
    box-shadow 0.3s ease;
}
.btn-spring:hover  { transform: translateY(-3px) scale(1.02); }
.btn-spring:active { transform: scale(0.97); transition-duration: 0.1s; }
```

---

## Stagger List — CSS e JS

```css
/* CSS-only: usa :nth-child per stagger fisso */
.stagger-list > * {
  opacity: 0;
  animation: fadeUp 0.5s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)) both;
}
.stagger-list > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-list > *:nth-child(2) { animation-delay: 0.10s; }
.stagger-list > *:nth-child(3) { animation-delay: 0.15s; }
.stagger-list > *:nth-child(4) { animation-delay: 0.20s; }
.stagger-list > *:nth-child(5) { animation-delay: 0.25s; }
.stagger-list > *:nth-child(n+6) { animation-delay: 0.30s; }
```

```javascript
// JS: stagger dinamico per liste di lunghezza arbitraria
function applyStagger(selector, delayStep = 50) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.setProperty('--stagger-delay', `${i * delayStep}ms`);
    el.style.animationDelay = `${i * delayStep}ms`;
  });
}
// Usa con: applyStagger('.card-grid .card');
```

---

## Magnetic Element

Elementi che si attraggono magneticamente verso il cursore — ideale per CTA principali e logo.

```javascript
function initMagnetic(selector = '[data-magnetic]') {
  document.querySelectorAll(selector).forEach(el => {
    const strength = parseFloat(el.dataset.magneticStrength ?? '0.3');

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform    = `translate(${dx}px, ${dy}px)`;
      el.style.transition   = 'transform 0.1s linear';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = 'transform 0.6s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1))';
    });
  });
}

// Disabilita su touch device
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('DOMContentLoaded', initMagnetic);
}
```

```html
<!-- Uso: -->
<button data-magnetic data-magnetic-strength="0.25">Get Started</button>
```

---

## View Transitions API — Navigazione Fluida

Transizioni native browser tra pagine senza librerie.

```javascript
// Intercetta i link interni
document.addEventListener('click', async e => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const url = new URL(link.href);
  if (url.origin !== location.origin) return; // solo link interni

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
  });
});
```

```css
/* Animazione di transizione pagina */
::view-transition-old(root) {
  animation: vt-out 0.25s var(--ease-inout-quart, cubic-bezier(0.76, 0, 0.24, 1)) both;
}
::view-transition-new(root) {
  animation: vt-in  0.25s var(--ease-inout-quart, cubic-bezier(0.76, 0, 0.24, 1)) both;
}

@keyframes vt-out {
  to { opacity: 0; translate: -1.5rem 0; }
}
@keyframes vt-in {
  from { opacity: 0; translate: 1.5rem 0; }
}

/* Hero element con shared transition */
.hero-image {
  view-transition-name: hero-img;
}
::view-transition-group(hero-img) {
  animation-duration: 0.4s;
  animation-timing-function: var(--ease-out-expo);
}
```

---

## Number Counter Animato

```javascript
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = parseInt(el.dataset.duration ?? '1500', 10);
  const prefix   = el.dataset.prefix ?? '';
  const suffix   = el.dataset.suffix ?? '';
  const start    = performance.now();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const value   = Math.floor(easeOutCubic(elapsed) * target);
    el.textContent = prefix + value.toLocaleString('it-IT') + suffix;
    if (elapsed < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Trigger solo quando visibile
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target); // una sola volta
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
```

```html
<!-- Uso: -->
<span data-target="12500" data-suffix="+" data-duration="2000">0</span>
<span data-target="99" data-suffix="%" data-duration="1200">0</span>
```

---

## Shimmer Skeleton — Token-Aware

```css
/* Versione aggiornata che usa i token di colore del design system */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-2, #1a1a28) 25%,
    var(--surface-3, #242438) 50%,
    var(--surface-2, #1a1a28) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* Preset tipici */
.skeleton-text   { height: 1em;   margin-bottom: 0.5em; }
.skeleton-title  { height: 1.5em; width: 60%; }
.skeleton-avatar { width: 3rem; height: 3rem; border-radius: 50%; }
.skeleton-card   { height: 180px; }
```

# Interactions & Visual Effects

Libreria di effetti visivi avanzati e micro-interazioni. Copia-incolla ready.

---

## 1. Glassmorphism — Sistema a 3 livelli di profondità

Non un flat glass layer. Usa profondità progressive per creare gerarchia visiva reale.

```css
/* Livello 1 — Card background, elementi secondari */
.glass-1 {
  background: oklch(100% 0 0 / 0.04);
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
  border: 1px solid oklch(100% 0 0 / 0.08);
  border-radius: var(--radius-lg);
}

/* Livello 2 — Modal, drawer, overlay principali */
.glass-2 {
  background: oklch(100% 0 0 / 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid oklch(100% 0 0 / 0.14);
  box-shadow: 0 8px 32px oklch(0% 0 0 / 0.25);
  border-radius: var(--radius-lg);
}

/* Livello 3 — Tooltip, popover, elementi in primo piano */
.glass-3 {
  background: oklch(100% 0 0 / 0.15);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid oklch(100% 0 0 / 0.2);
  box-shadow: 0 16px 48px oklch(0% 0 0 / 0.35);
  border-radius: var(--radius-md);
}

/* Variante dark — per sfondi chiari */
.glass-dark {
  background: oklch(0% 0 0 / 0.06);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid oklch(0% 0 0 / 0.1);
}
```

**Regola**: Mai usare glassmorphism su sfondi piatti solidi — funziona solo quando sotto c'è texture, gradiente o immagine.

---

## 2. SVG Filters — Effetti avanzati

### Gooey Effect (blob che si fondono)

```html
<!-- Metti questo SVG nascosto in fondo al body -->
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
/* Applica il filtro al container */
.goo-container {
  filter: url(#goo);
}

/* Esempio: menu con blob */
.blob-nav {
  filter: url(#goo);
  background: var(--surface-2);
  padding: 0.5rem;
  border-radius: 999px;
  display: flex;
  gap: 0;
}
.blob-nav a {
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  transition: background 0.3s;
}
.blob-nav a:hover {
  background: var(--brand);
}
```

### Frosted Glow su elementi

```css
.glow-element {
  filter: drop-shadow(0 0 12px var(--brand)) drop-shadow(0 0 24px oklch(from var(--brand) l c h / 0.4));
}

/* SVG icon glow */
.icon-glow {
  filter: drop-shadow(0 0 6px currentColor);
}
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
.field-float {
  position: relative;
}

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

.field-float input:focus {
  border-color: var(--brand);
}

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

/* Label flottante: placeholder=" " è necessario per :not(:placeholder-shown) */
.field-float input:focus ~ label,
.field-float input:not(:placeholder-shown) ~ label {
  top: 0.55rem;
  translate: 0 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--brand);
}

/* Stato errore */
.field-float.is-error input {
  border-color: oklch(60% 0.22 20);
  animation: field-shake 0.4s ease;
}
.field-float.is-error label { color: oklch(60% 0.22 20); }

.field-float .field-error-msg {
  font-size: 0.75rem;
  color: oklch(60% 0.22 20);
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Stato successo */
.field-float.is-valid input { border-color: oklch(65% 0.2 140); }

@keyframes field-shake {
  0%, 100% { translate: 0; }
  20%       { translate: -6px 0; }
  40%       { translate: 6px 0; }
  60%       { translate: -4px 0; }
  80%       { translate: 4px 0; }
}
```

### Search Input con icona animata

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

## 4. Button States — Sistema Completo

Ogni bottone deve avere: default, hover, active, focus-visible, loading, disabled.

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
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
  -webkit-user-select: none;
  user-select: none;
}

/* Ripple effect on click */
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

/* Hover lift */
.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}
.btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.08s;
}

/* Focus ring branded */
.btn:focus-visible {
  outline: 2.5px solid var(--brand);
  outline-offset: 3px;
}

/* Disabled */
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* --- Varianti --- */

.btn-primary {
  background: var(--brand);
  color: white;
  box-shadow: 0 1px 3px oklch(from var(--brand) l c h / 0.3);
}
.btn-primary:hover:not(:disabled) {
  background: color-mix(in oklch, var(--brand) 85%, black);
  box-shadow: 0 6px 20px oklch(from var(--brand) l c h / 0.35);
}

.btn-secondary {
  background: var(--surface-2);
  color: var(--text-1);
  border: 1.5px solid var(--border);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--surface-3, var(--surface-2));
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
  width: 1.1em;
  height: 1.1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
  color: white;
}
.btn-secondary[data-loading]::before,
.btn-ghost[data-loading]::before {
  color: var(--text-1);
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

/* --- Sizes --- */
.btn-sm { padding: 0.4rem 0.9rem; font-size: 0.8rem; }
.btn-lg { padding: 0.85rem 1.8rem; font-size: 1rem; }
.btn-xl { padding: 1rem 2.2rem; font-size: 1.1rem; }
```

---

## 5. Neon Glow — Sistema

```css
:root {
  --neon-brand: var(--brand, #ee5a24);
}

/* Testo neon */
.neon-text {
  color: var(--neon-brand);
  text-shadow:
    0 0 7px  var(--neon-brand),
    0 0 10px var(--neon-brand),
    0 0 21px var(--neon-brand),
    0 0 42px oklch(from var(--neon-brand) l c h / 0.6);
}

/* Bordo neon */
.neon-border {
  border: 1px solid var(--neon-brand);
  box-shadow:
    0 0 5px  oklch(from var(--neon-brand) l c h / 0.4),
    0 0 20px oklch(from var(--neon-brand) l c h / 0.25),
    inset 0 0 5px oklch(from var(--neon-brand) l c h / 0.15);
}

/* Neon pulsante */
.neon-pulse {
  animation: neon-flicker 2s ease-in-out infinite alternate;
}

@keyframes neon-flicker {
  0%, 100% {
    text-shadow:
      0 0 7px var(--neon-brand),
      0 0 21px var(--neon-brand),
      0 0 42px oklch(from var(--neon-brand) l c h / 0.6);
  }
  50% {
    text-shadow:
      0 0 4px var(--neon-brand),
      0 0 12px var(--neon-brand),
      0 0 24px oklch(from var(--neon-brand) l c h / 0.4);
  }
}
```

---

## 6. Parallax con CSS Variables

Zero layout thrash, GPU composited, passive listener.

```javascript
// Inizializza una volta
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

// Chiama al DOMContentLoaded
document.addEventListener('DOMContentLoaded', initParallax);
```

```css
/* Usa --scroll-y in CSS con moltiplicatori di velocità */
.parallax-slow  { translate: 0 calc(var(--scroll-y, 0px) * -0.15); }
.parallax-mid   { translate: 0 calc(var(--scroll-y, 0px) * -0.35); }
.parallax-fast  { translate: 0 calc(var(--scroll-y, 0px) * -0.6);  }
.parallax-bg    { translate: 0 calc(var(--scroll-y, 0px) * -0.08); } /* solo per sfondi */

/* Parallax orizzontale per decorazioni */
.parallax-x-left  { translate: calc(var(--scroll-y, 0px) * -0.1) 0; }
.parallax-x-right { translate: calc(var(--scroll-y, 0px) *  0.1) 0; }
```

---

## 7. Canvas Aurora Background

Classe JS leggera, zero dipendenze. Crea un cielo aurora animato come sfondo.

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

/* Versione CSS-only (alternativa leggera) */
.aurora-css {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%,
      oklch(62% 0.22 30 / 0.35) 0%, transparent 60%),
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
      // move
      orb.x = ((orb.x + orb.vx) + 1) % 1;
      orb.y = ((orb.y + orb.vy) + 1) % 1;

      // draw radial gradient
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
    const loop = () => {
      if (!this._running) return;
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() { this._running = false; }
}

// Utilizzo
// const aurora = new Aurora(document.querySelector('.aurora-canvas'), {
//   hues: [18, 260, 180],  // brand orange, purple, teal
//   speed: 0.0015,
// });
// aurora.start();

// Pausa quando fuori viewport (performance)
// const io = new IntersectionObserver(([e]) => e.isIntersecting ? aurora.start() : aurora.stop());
// io.observe(aurora.canvas);
```

---

## 8. Custom Cursor

Solo su desktop (`pointer: fine`). Sempre rispettare `prefers-reduced-motion`.

```html
<!-- Inserisci prima di </body> -->
<div class="cursor" aria-hidden="true"></div>
<div class="cursor-ring" aria-hidden="true"></div>
```

```css
/* Nascondi il cursore nativo solo su desktop */
@media (pointer: fine) {
  * { cursor: none !important; }

  .cursor {
    position: fixed;
    width: 9px;
    height: 9px;
    background: var(--brand);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    translate: -50% -50%;
    transition:
      transform 0.15s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
      width 0.3s ease,
      height 0.3s ease,
      opacity 0.3s ease;
  }

  .cursor-ring {
    position: fixed;
    width: 34px;
    height: 34px;
    border: 1.5px solid oklch(from var(--brand) l c h / 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    translate: -50% -50%;
    transition:
      left 0.08s linear,
      top  0.08s linear,
      width 0.3s ease,
      height 0.3s ease,
      border-color 0.3s ease,
      opacity 0.3s ease;
  }

  /* Hover su link/bottoni: il dot scompare, il ring si espande */
  body:has(a:hover) .cursor,
  body:has(button:hover) .cursor {
    opacity: 0;
    transform: scale(0);
  }
  body:has(a:hover) .cursor-ring,
  body:has(button:hover) .cursor-ring {
    width: 48px;
    height: 48px;
    border-color: var(--brand);
    background: oklch(from var(--brand) l c h / 0.08);
  }

  /* Testo: cursore linea */
  body:has(p:hover) .cursor,
  body:has(input:hover) .cursor {
    width: 2px;
    height: 1.2em;
    border-radius: 1px;
  }
}

/* Disabilita completamente con reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .cursor, .cursor-ring { display: none !important; }
}
```

```javascript
function initCursor() {
  // Solo su dispositivi con mouse preciso
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = ring.style.left = `${mouseX}px`;
    cursor.style.top  = cursor.style.top  = `${mouseY}px`;
    ring.style.top = `${mouseY}px`;
  });

  // Nascondi quando il mouse esce dalla finestra
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '';
    ring.style.opacity   = '';
  });
}

document.addEventListener('DOMContentLoaded', initCursor);
```

---

## 9. Grain Texture Overlay

Aggiunge profondità e premium feel su sfondi piatti o gradienti.

```css
/* Applica come pseudo-elemento al container */
.grain {
  position: relative;
  isolation: isolate;
}

.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.04;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  mix-blend-mode: overlay;
}

/* Intensità: regola opacity */
/* Sottile:  opacity: 0.025 */
/* Standard: opacity: 0.04  */
/* Forte:    opacity: 0.07  */
```

---

## 10. Animated Border Gradient

Bordi animati con gradiente rotante via `@property`.

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

@keyframes rotate-border {
  to { --angle: 360deg; }
}

/* Versione solo su hover */
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

# Component Patterns — Libreria Componenti

Componenti completi, copy-paste ready, con tutti gli stati necessari.

---

## Stat Card

Ideale per dashboard, metriche, dati in tempo reale (pool mining, SaaS, fintech).

```html
<div class="stat-card">
  <div class="stat-card__label">Hashrate Totale</div>
  <div class="stat-card__value" data-target="12500" data-suffix=" MH/s">
    12,500 MH/s
  </div>
  <div class="stat-card__change stat-card__change--up">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 2L10 8H2L6 2Z"/>
    </svg>
    +3.4% rispetto a ieri
  </div>
</div>
```

```css
.stat-card {
  container-type: inline-size;
  container-name: stat;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.4rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.stat-card:hover {
  border-color: var(--brand);
  box-shadow:
    0 0 0 1px var(--brand),
    0 8px 24px color-mix(in srgb, var(--brand) 20%, transparent);
}

.stat-card__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: var(--text-2);
}

.stat-card__value {
  /* Usa cqi per fluid size basata sul container, non viewport */
  font-size: clamp(1.4rem, 4cqi, 2.2rem);
  font-weight: 700;
  color: var(--text-1);
  font-variant-numeric: tabular-nums;  /* cifre a larghezza fissa — previene layout shift */
  line-height: 1.1;
  min-width: 5ch;  /* riserva spazio per evitare layout shift */
}

.stat-card__change {
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
}

.stat-card__change--up   { color: oklch(65% 0.20 145); }  /* green  */
.stat-card__change--down { color: oklch(60% 0.22 20);  }  /* red    */
.stat-card__change--flat { color: var(--text-2);        }  /* neutral */

/* Skeleton state */
.stat-card.is-loading .stat-card__value,
.stat-card.is-loading .stat-card__change {
  background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3, #242438) 50%, var(--surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
  color: transparent;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

---

## Progress Bar

```html
<div class="progress-bar" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar__fill" style="width: 72%"></div>
</div>

<!-- Con label -->
<div class="progress-labeled">
  <div class="progress-labeled__header">
    <span>Pool Filled</span>
    <span>72%</span>
  </div>
  <div class="progress-bar">
    <div class="progress-bar__fill" style="width: 72%"></div>
  </div>
</div>
```

```css
.progress-bar {
  height: 6px;
  background: var(--surface-3, color-mix(in srgb, var(--surface-2) 50%, white));
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--brand),
    color-mix(in oklch, var(--brand) 70%, white)
  );
  border-radius: 999px;
  transform-origin: left;
  transition: width 0.8s var(--spring-smooth, cubic-bezier(0.25, 0.46, 0.45, 0.94));
}

/* Variante: glow effect */
.progress-bar--glow .progress-bar__fill {
  box-shadow: 0 0 8px color-mix(in srgb, var(--brand) 60%, transparent);
}

/* Variante: striped animato */
.progress-bar--striped .progress-bar__fill {
  background-image: linear-gradient(
    45deg,
    rgba(255,255,255,0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0.15) 75%,
    transparent 75%
  );
  background-size: 1rem 1rem;
  animation: progress-stripes 0.8s linear infinite;
}

@keyframes progress-stripes {
  to { background-position: 1rem 0; }
}

.progress-labeled {
  display: grid;
  gap: 0.4rem;
}

.progress-labeled__header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--text-2);
  font-weight: 500;
}
```

---

## Badge / Tag

```html
<span class="badge">Default</span>
<span class="badge badge--success">Online</span>
<span class="badge badge--warning">Syncing</span>
<span class="badge badge--error">Offline</span>
<span class="badge badge--brand">Pro</span>
<span class="badge badge--outline">New</span>

<!-- Con dot indicatore -->
<span class="badge badge--success">
  <span class="badge__dot"></span>
  Active
</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2em 0.65em;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;

  /* Default */
  background: color-mix(in srgb, var(--text-2) 15%, transparent);
  color: var(--text-2);
}

.badge--success {
  background: oklch(65% 0.20 145 / 0.15);
  color: oklch(65% 0.20 145);
}
.badge--warning {
  background: oklch(78% 0.20 80 / 0.15);
  color: oklch(65% 0.18 75);
}
.badge--error {
  background: oklch(60% 0.22 20 / 0.15);
  color: oklch(60% 0.22 20);
}
.badge--brand {
  background: color-mix(in srgb, var(--brand) 15%, transparent);
  color: var(--brand);
}
.badge--outline {
  background: transparent;
  color: var(--text-1);
  border: 1px solid var(--border);
}

/* Dot indicatore (es. status online) */
.badge__dot {
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.badge--success .badge__dot {
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}
```

---

## Accordion — Altezza Smooth senza JS-height

Il trick `grid-template-rows: 0fr → 1fr` permette transizioni di altezza fluide senza misurare l'altezza via JS.

```html
<div class="accordion">
  <button class="accordion__trigger" aria-expanded="false" aria-controls="acc-1-body">
    <span>Come funziona il pool mining?</span>
    <svg class="accordion__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <div class="accordion__body" id="acc-1-body" role="region">
    <div class="accordion__inner">
      <p>Il pool mining combina la potenza di calcolo di più miner...</p>
    </div>
  </div>
</div>
```

```css
.accordion {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-2);
}

.accordion + .accordion {
  margin-top: -1px;
  border-radius: 0;
}
.accordion:first-child { border-radius: var(--radius-md) var(--radius-md) 0 0; }
.accordion:last-child  { border-radius: 0 0 var(--radius-md) var(--radius-md); }

.accordion__trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  color: var(--text-1);
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, color 0.2s;
}

.accordion__trigger:hover { background: var(--surface-3, rgba(255,255,255,0.04)); }
.accordion__trigger:focus-visible { outline: 2px solid var(--brand); outline-offset: -2px; }

.accordion__icon {
  flex-shrink: 0;
  color: var(--text-2);
  transition: rotate 0.3s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

/* IL TRICK: grid-template-rows per altezza smooth senza JS */
.accordion__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

.accordion__inner {
  overflow: hidden;
  padding: 0 1.25rem;
}

/* Stato aperto — JS aggiunge aria-expanded="true" al trigger */
.accordion__trigger[aria-expanded="true"] + .accordion__body {
  grid-template-rows: 1fr;
}
.accordion__trigger[aria-expanded="true"] + .accordion__body .accordion__inner {
  padding-bottom: 1rem;
}
.accordion__trigger[aria-expanded="true"] .accordion__icon {
  rotate: 180deg;
}
```

```javascript
document.querySelectorAll('.accordion__trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});
```

---

## Toast Notification

```javascript
// Sistema toast — crea container e gestisce la coda
class ToastSystem {
  constructor() {
    this.container = this._createContainer();
  }

  _createContainer() {
    const el = document.createElement('div');
    el.className = 'toast-container';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'false');
    document.body.appendChild(el);
    return el;
  }

  show(message, type = 'default', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');

    const icons = {
      success: '✓',
      error:   '✕',
      warning: '⚠',
      default: 'ℹ',
    };

    toast.innerHTML = `
      <span class="toast__icon">${icons[type] ?? icons.default}</span>
      <span class="toast__msg">${message}</span>
      <button class="toast__close" aria-label="Chiudi">✕</button>
    `;

    toast.querySelector('.toast__close').addEventListener('click', () => this._dismiss(toast));
    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    if (duration > 0) {
      setTimeout(() => this._dismiss(toast), duration);
    }

    return toast;
  }

  _dismiss(toast) {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }
}

// Uso globale
// const toasts = new ToastSystem();
// toasts.show('Operazione completata', 'success');
// toasts.show('Errore di connessione', 'error');
```

```css
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9000;
  pointer-events: none;
  max-width: 360px;
  width: calc(100vw - 3rem);
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px oklch(0% 0 0 / 0.3);
  pointer-events: all;
  font-size: 0.875rem;
  color: var(--text-1);
  translate: 100% 0;
  opacity: 0;
  transition:
    translate 0.4s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
    opacity 0.3s ease;
}

.toast--visible {
  translate: 0 0;
  opacity: 1;
}

.toast__icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.toast__msg { flex: 1; }

.toast__close {
  background: none;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 0.1rem;
  font-size: 0.75rem;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.2s;
}
.toast__close:hover { color: var(--text-1); }

/* Varianti colore */
.toast--success { border-color: oklch(65% 0.20 145 / 0.4); }
.toast--success .toast__icon { color: oklch(65% 0.20 145); }

.toast--error { border-color: oklch(60% 0.22 20 / 0.4); }
.toast--error .toast__icon { color: oklch(60% 0.22 20); }

.toast--warning { border-color: oklch(78% 0.20 80 / 0.4); }
.toast--warning .toast__icon { color: oklch(65% 0.18 75); }
```

---

## Modal con Focus Trap

```html
<dialog class="modal" id="myModal">
  <div class="modal__backdrop"></div>
  <div class="modal__box" role="document">
    <header class="modal__header">
      <h2 class="modal__title">Conferma azione</h2>
      <button class="modal__close" aria-label="Chiudi">✕</button>
    </header>
    <div class="modal__body">
      <p>Sei sicuro di voler procedere?</p>
    </div>
    <footer class="modal__footer">
      <button class="btn btn-ghost modal__close">Annulla</button>
      <button class="btn btn-primary">Conferma</button>
    </footer>
  </div>
</dialog>
```

```css
.modal {
  /* <dialog> è già in position fixed col browser default */
  padding: 0;
  border: none;
  background: transparent;
  max-width: min(560px, 95vw);
  width: 100%;
  /* Apertura con animation */
}

.modal[open] {
  animation: modal-in 0.3s var(--spring-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
}

@keyframes modal-in {
  from { opacity: 0; scale: 0.92; translate: 0 1rem; }
}

.modal::backdrop {
  background: oklch(0% 0 0 / 0.6);
  backdrop-filter: blur(4px);
  animation: backdrop-in 0.25s ease;
}

@keyframes backdrop-in {
  from { opacity: 0; }
}

.modal__box {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal__title { font-size: 1rem; font-weight: 700; }

.modal__close {
  background: none;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color 0.2s, background 0.2s;
}
.modal__close:hover { color: var(--text-1); background: var(--surface-3, rgba(255,255,255,0.06)); }

.modal__body   { padding: 1.5rem; }
.modal__footer { padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border); }
```

```javascript
// Apri/chiudi modal nativo con <dialog>
const modal = document.getElementById('myModal');

// Apri
document.querySelector('[data-modal="myModal"]').addEventListener('click', () => {
  modal.showModal();
});

// Chiudi con bottone close
modal.querySelectorAll('.modal__close').forEach(btn => {
  btn.addEventListener('click', () => modal.close());
});

// Chiudi cliccando sul backdrop
modal.addEventListener('click', e => {
  if (e.target === modal) modal.close();
});

// Focus trap nativo: <dialog> lo gestisce automaticamente!
// Escape per chiudere: <dialog> lo gestisce automaticamente!
```

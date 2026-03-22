# Color Systems — Guida Avanzata

## Principi Fondamentali

### Non usare mai colori puri
```css
/* ❌ Evita */
--bg: #ffffff;
--text: #000000;

/* ✅ Usa near-white e near-black */
--bg: #f8f7f5;        /* warm off-white */
--bg: #0d0d12;        /* cool near-black */
--text: #1a1a2e;      /* warm dark */
--text: #e8e8f0;      /* cool light */
```

## Palette Generation Method

### Metodo HSL per palette coerenti
```css
/* Definisci hue base, poi crea varianti */
:root {
  --hue: 240;          /* blue-violet */
  --sat: 70%;

  --color-50:  hsl(var(--hue), 60%, 97%);
  --color-100: hsl(var(--hue), 55%, 94%);
  --color-200: hsl(var(--hue), 50%, 86%);
  --color-300: hsl(var(--hue), var(--sat), 74%);
  --color-400: hsl(var(--hue), var(--sat), 62%);
  --color-500: hsl(var(--hue), var(--sat), 50%);  /* primary */
  --color-600: hsl(var(--hue), var(--sat), 40%);
  --color-700: hsl(var(--hue), var(--sat), 30%);
  --color-800: hsl(var(--hue), var(--sat), 20%);
  --color-900: hsl(var(--hue), 50%, 12%);
  --color-950: hsl(var(--hue), 40%, 7%);
}
```

## Palette Collaudate per Contesti

### Dark Luxury (SaaS, Tech, Portfolio)
```css
:root {
  --surface-base:    #08080e;
  --surface-raised:  #0f0f1a;
  --surface-overlay: #1a1a28;
  --border:          rgba(255, 255, 255, 0.08);
  --border-strong:   rgba(255, 255, 255, 0.15);
  --primary:         #7c6ff7;      /* soft violet */
  --primary-glow:    rgba(124, 111, 247, 0.3);
  --accent:          #f7936f;      /* warm coral */
  --text:            #e8e8f5;
  --text-muted:      #7878a0;
  --text-subtle:     #4a4a6a;
}
```

### Minimal Light (Agency, Portfolio, Corporate)
```css
:root {
  --surface-base:    #fafaf8;
  --surface-raised:  #f3f2ef;
  --surface-overlay: #eae9e4;
  --border:          rgba(0, 0, 0, 0.07);
  --border-strong:   rgba(0, 0, 0, 0.14);
  --primary:         #1a1a2e;      /* deep navy */
  --accent:          #d4541f;      /* terracotta */
  --text:            #1a1a2e;
  --text-muted:      #6b6b85;
  --text-subtle:     #a0a0b8;
}
```

### Aurora/Vibrant (Creative, Music, Art)
```css
:root {
  --surface-base:    #060610;
  --primary:         #00d4ff;      /* electric cyan */
  --secondary:       #ff006e;      /* hot pink */
  --tertiary:        #8b5cf6;      /* violet */
  --accent:          #ffd60a;      /* bright yellow */
  
  /* Mesh gradient background */
  --gradient-mesh: 
    radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 0, 110, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 60%);
}
```

### Warm Editorial (Blog, Publisher, Luxury Brand)
```css
:root {
  --surface-base:    #fdf6ec;
  --surface-raised:  #f5ead6;
  --primary:         #2d1b0e;      /* espresso */
  --accent:          #c8902a;      /* amber gold */
  --accent-2:        #8b3a3a;      /* burgundy */
  --text:            #2d1b0e;
  --text-muted:      #7a5c3e;
}
```

## Glassmorphism Recipe
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Light glassmorphism */
.glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
```

## Gradienti Moderni (non cliché)
```css
/* ✅ Gradienti sofisticati */

/* Gradient con hue shift */
.gradient-shift {
  background: linear-gradient(
    135deg,
    hsl(240, 70%, 55%) 0%,
    hsl(280, 65%, 50%) 50%,
    hsl(320, 70%, 55%) 100%
  );
}

/* Gradient mesh (usa come background layer) */
.gradient-mesh {
  background:
    radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(244, 114, 182, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 70%),
    #0a0a14;
}

/* Conic gradient per accenti */
.gradient-conic {
  background: conic-gradient(
    from 180deg at 50% 50%,
    #7c3aed 0deg,
    #2563eb 120deg,
    #059669 240deg,
    #7c3aed 360deg
  );
}

/* ❌ Gradienti da non usare MAI */
/* linear-gradient(135deg, #667eea 0%, #764ba2 100%) */
/* linear-gradient(to right, #f093fb, #f5576c) */
/* linear-gradient(to right, #4facfe 0%, #00f2fe 100%) */
```

---

## Tecniche Colore Moderne (CSS Level 4-5)

### `color-mix()` — Tints e shades automatici

Non calcolare mai manualmente le varianti di un colore. Usare `color-mix()`:

```css
:root {
  --brand: oklch(62% 0.22 30);   /* il tuo colore base */

  /* Tints (verso bianco) */
  --brand-100: color-mix(in oklch, var(--brand) 10%, white);
  --brand-200: color-mix(in oklch, var(--brand) 20%, white);
  --brand-300: color-mix(in oklch, var(--brand) 40%, white);

  /* Shades (verso nero) */
  --brand-700: color-mix(in oklch, var(--brand) 70%, black);
  --brand-800: color-mix(in oklch, var(--brand) 50%, black);
  --brand-900: color-mix(in oklch, var(--brand) 25%, black);

  /* Semi-trasparenti */
  --brand-glass:  color-mix(in srgb, var(--brand) 12%, transparent);
  --brand-subtle: color-mix(in srgb, var(--brand) 18%, transparent);
}
```

**Perché `oklch`?** Produce mix percettivamente uniformi — la luminosità rimane coerente lungo tutta la scala, senza le zone di grigio spento che si ottengono in `srgb`.

### Relative Color Syntax

Derivi varianti dal token base senza calcoli manuali:

```css
:root {
  --brand: hsl(18 85% 52%);

  /* Variante scura: stessa hue/sat, lightness -15% */
  --brand-dark:  hsl(from var(--brand) h s calc(l - 15%));

  /* Variante muted: stessa hue, saturazione ridotta */
  --brand-muted: hsl(from var(--brand) h calc(s - 30%) l);

  /* Complementare: hue ruotata di 180° */
  --brand-comp:  hsl(from var(--brand) calc(h + 180) s l);

  /* Analogo: hue ruotata di 30° */
  --brand-warm:  hsl(from var(--brand) calc(h - 30) s l);
}
```

### Palette OKLCH — Luminosità percettivamente uniforme

OKLCH è superiore a HSL per palette: lo stesso valore di `l` produce la stessa luminosità percepita tra hue diverse.

```css
/* Scale OKLCH per brand arancione (hue ≈ 30) */
:root {
  --brand-50:   oklch(96% 0.04  30);   /* quasi bianco tintato */
  --brand-100:  oklch(92% 0.08  30);
  --brand-200:  oklch(85% 0.13  30);
  --brand-300:  oklch(75% 0.17  30);
  --brand-400:  oklch(68% 0.20  30);
  --brand-500:  oklch(62% 0.22  30);   /* BASE — es. #EE5A24 */
  --brand-600:  oklch(54% 0.20  30);
  --brand-700:  oklch(45% 0.17  30);
  --brand-800:  oklch(36% 0.13  30);
  --brand-900:  oklch(26% 0.08  30);
  --brand-950:  oklch(16% 0.04  30);
}

/* Cambia solo hue per una palette completamente diversa */
/* Blu:     hue 250 | Viola:  hue 290 | Verde: hue 145 | Teal: hue 185 */
```

---

## Aurora / Mesh Gradient — Pattern CSS

```css
/* Aurora background a 3 layer — regola hue in base al brand */
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

## Grain Texture CSS-only

Aggiunge profondità e premium feel su qualsiasi sfondo. Nessun file immagine richiesto.

```css
/* Applica il grain come pseudo-elemento al container */
.grain { position: relative; isolation: isolate; }

.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  /* Intensità: 0.025 sottile | 0.04 standard | 0.07 forte */
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
/* Testo neon */
.neon-text {
  color: var(--brand);
  text-shadow:
    0 0 7px  var(--brand),
    0 0 21px var(--brand),
    0 0 42px color-mix(in srgb, var(--brand) 60%, transparent);
}

/* Bordo neon su box */
.neon-border {
  border: 1px solid var(--brand);
  box-shadow:
    0 0 5px  color-mix(in srgb, var(--brand) 40%, transparent),
    0 0 20px color-mix(in srgb, var(--brand) 25%, transparent),
    inset 0 0 5px color-mix(in srgb, var(--brand) 15%, transparent);
}

/* Neon animato (pulsante) */
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

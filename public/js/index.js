/* Index page specific JavaScript */

// Copy to clipboard function
function copy(text) {
    navigator.clipboard.writeText(text);
}

// ===== HALVING CALCULATOR =====
const HALVING_INTERVAL = 210_000;
const BLOCK_TIME_MINUTES = 2;

function formatHalvingTime(totalMinutes) {
    const d = Math.floor(totalMinutes / (60 * 24));
    const h = Math.floor((totalMinutes % (60 * 24)) / 60);
    const m = totalMinutes % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    return parts.join(' ');
}

function setHalvingValue(id, text) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('stat-loading'); el.textContent = text; }
}

function setHalvingLoading(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = '—'; el.classList.add('stat-loading'); }
}

async function fetchHalvingData() {
    ['halving-block-height', 'halving-blocks-remaining', 'halving-time-remaining'].forEach(setHalvingLoading);

    try {
        const res = await fetch(apiUrl(CONFIG.ENDPOINTS.BLOCK_HEIGHT), { headers: apiHeaders() });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const height = Number(data.block_height ?? data.height ?? data);

        const halvingNumber  = Math.floor(height / HALVING_INTERVAL) + 1;
        const nextHalving    = halvingNumber * HALVING_INTERVAL;
        const blocksRemaining = nextHalving - height;
        const minutesRemaining = blocksRemaining * BLOCK_TIME_MINUTES;
        const progressPct    = ((height % HALVING_INTERVAL) / HALVING_INTERVAL * 100).toFixed(1);
        const prevHalving    = (halvingNumber - 1) * HALVING_INTERVAL;

        setHalvingValue('halving-block-height',    height.toLocaleString());
        setHalvingValue('halving-blocks-remaining', blocksRemaining.toLocaleString());
        setHalvingValue('halving-time-remaining',   formatHalvingTime(minutesRemaining));

        const fill = document.getElementById('halving-progress-fill');
        if (fill) fill.style.width = progressPct + '%';

        const label = document.getElementById('halving-progress-label');
        if (label) label.textContent =
            `Halving #${halvingNumber} · ${progressPct}% completato · blocco ${prevHalving.toLocaleString()} → ${nextHalving.toLocaleString()}`;

    } catch (e) {
        console.error('Failed to fetch halving data:', e);
        ['halving-block-height', 'halving-blocks-remaining', 'halving-time-remaining'].forEach(id => setHalvingValue(id, 'N/A'));
    }
}

document.addEventListener('DOMContentLoaded', fetchHalvingData);
setInterval(fetchHalvingData, 60_000);

// ===== HERO ENTRANCE CHOREOGRAPHY =====
// Orchestrated with anime.js (loaded via CDN). Hero elements are visible by
// default (normal document flow), so if the CDN fails or reduced-motion is
// set, they simply render statically — no broken/invisible state.
function initHeroAnimation() {
    if (typeof anime === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = document.querySelectorAll('.hero-main [data-hero-anim]');
    if (!els.length) return;

    anime.set(els, { opacity: 0, translateY: 24 });
    anime.set('.hero-visual', { opacity: 0, scale: 0.88, translateY: 0 });

    anime.timeline({ easing: 'easeOutExpo' })
        .add({ targets: '.hero-chip', opacity: [0, 1], translateY: [24, 0], duration: 650 })
        .add({ targets: '.hero-title', opacity: [0, 1], translateY: [24, 0], duration: 850 }, '-=450')
        .add({ targets: '.hero-subtitle', opacity: [0, 1], translateY: [24, 0], duration: 700 }, '-=550')
        .add({ targets: '.hero-main .buttons', opacity: [0, 1], translateY: [24, 0], duration: 650 }, '-=450')
        .add({ targets: '.hero-visual', opacity: [0, 1], scale: [0.88, 1], duration: 900 }, '-=750');
}

document.addEventListener('DOMContentLoaded', initHeroAnimation);
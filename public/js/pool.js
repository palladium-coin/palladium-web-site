/* Pool dashboard page JavaScript */

const POOL_STATUS_URL = '/pool-data/pool/pool.status';
const AUTO_REFRESH_MS = 20_000;

const STAT_IDS = [
    'stat-runtime',
    'stat-users',
    'stat-workers',
    'stat-idle',
    'stat-disconnected',
    'stat-diff',
    'stat-accepted',
    'stat-rejected',
    'stat-total-shares',
    'stat-acceptance-rate',
    'stat-bestshare',
    'stat-hashrate1m',
    'stat-hashrate5m',
    'stat-hashrate15m',
    'stat-hashrate1hr',
    'stat-hashrate6hr',
    'stat-hashrate1d',
    'stat-hashrate7d',
    'stat-sps1m',
    'stat-sps5m',
    'stat-sps15m',
    'stat-sps1h',
];

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setAllStatsFallback(text) {
    STAT_IDS.forEach(id => setText(id, text));
}

function formatDuration(seconds) {
    const total = Number(seconds);
    if (!Number.isFinite(total) || total < 0) return null;
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    return parts.join(' ');
}

function formatDate(iso) {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString();
}

function formatNumber(value, maxFractionDigits = 0) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 'N/A';
    return n.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits });
}

function formatPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 'N/A';
    return `${n.toFixed(2)}%`;
}

function formatHashrate(raw) {
    if (raw === null || raw === undefined) return 'N/A';
    const str = String(raw).trim();
    if (!str) return 'N/A';
    if (str.endsWith('/s')) return str;
    if (str === '0') return '0 H/s';
    return `${str}H/s`;
}

function formatRate(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 'N/A';
    if (n === 0) return '0';
    if (Math.abs(n) < 0.001) return n.toExponential(2);
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function classifyPoolStatusObjects(objects) {
    const runtime = objects.find(obj => Object.prototype.hasOwnProperty.call(obj, 'runtime')) || null;
    const hashrate = objects.find(obj => Object.prototype.hasOwnProperty.call(obj, 'hashrate1m')) || null;
    const shares = objects.find(obj =>
        Object.prototype.hasOwnProperty.call(obj, 'accepted')
        || Object.prototype.hasOwnProperty.call(obj, 'rejected')
        || Object.prototype.hasOwnProperty.call(obj, 'bestshare')
    ) || null;

    return { runtime, hashrate, shares };
}

function parsePoolStatusText(rawText) {
    if (typeof rawText !== 'string' || !rawText.trim()) return null;

    const objects = rawText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(obj => obj && typeof obj === 'object');

    if (!objects.length) return null;
    return classifyPoolStatusObjects(objects);
}

function showError(message) {
    const el = document.getElementById('pool-error');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('is-hidden');
}

function hideError() {
    const el = document.getElementById('pool-error');
    if (!el) return;
    el.textContent = '';
    el.classList.add('is-hidden');
}

function showUserSearchError(message) {
    const el = document.getElementById('pool-user-search-error');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('is-hidden');
}

function hideUserSearchError() {
    const el = document.getElementById('pool-user-search-error');
    if (!el) return;
    el.textContent = '';
    el.classList.add('is-hidden');
}

function initUserSearchForm() {
    const form = document.getElementById('pool-user-search-form');
    const input = document.getElementById('pool-user-search-input');
    if (!form || !input) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = input.value.trim();

        if (!username) {
            showUserSearchError('Please enter a username.');
            return;
        }

        if (/\s/.test(username)) {
            showUserSearchError('Username cannot contain spaces.');
            return;
        }

        hideUserSearchError();
        const target = `pool-user.html?username=${encodeURIComponent(username)}`;
        window.location.href = target;
    });
}

function normalizePayload(payload, method) {
    if (!payload || typeof payload !== 'object') return null;

    const isWrapped = payload.stats && typeof payload.stats === 'object';
    const runtime = isWrapped ? (payload.stats.runtime || {}) : (payload.runtime || {});
    const hashrate = isWrapped ? (payload.stats.hashrate || {}) : (payload.hashrate || {});
    const shares = isWrapped ? (payload.stats.shares || {}) : (payload.shares || {});

    const accepted = Number(shares.accepted);
    const rejected = Number(shares.rejected);
    const total = Number.isFinite(accepted) || Number.isFinite(rejected)
        ? (Number.isFinite(accepted) ? accepted : 0) + (Number.isFinite(rejected) ? rejected : 0)
        : shares.total;

    const acceptanceRate = Number.isFinite(total) && total > 0 && Number.isFinite(accepted)
        ? (accepted / total) * 100
        : shares.acceptance_rate;

    const lastUpdateEpoch = Number(runtime.lastupdate);
    const normalizedRuntime = {
        ...runtime,
        runtime_human: runtime.runtime_human || formatDuration(runtime.runtime),
        lastupdate_iso: runtime.lastupdate_iso || (Number.isFinite(lastUpdateEpoch) ? new Date(lastUpdateEpoch * 1000).toISOString() : null),
    };

    return {
        generated_at: payload.generated_at || new Date().toISOString(),
        source: {
            ...(payload.source || {}),
            method: method || payload?.source?.method || 'unknown',
            available: true,
        },
        stats: {
            runtime: normalizedRuntime,
            hashrate: { ...hashrate },
            shares: {
                ...shares,
                total,
                acceptance_rate: acceptanceRate,
            },
        },
    };
}

async function fetchLivePoolStatusData() {
    const response = await fetch(`${POOL_STATUS_URL}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`pool.status request failed: ${response.status}`);
    }

    const text = await response.text();
    const parsed = parsePoolStatusText(text);
    if (!parsed) {
        throw new Error('pool.status payload is not parseable');
    }

    return normalizePayload({
        generated_at: new Date().toISOString(),
        stats: parsed,
    }, `pool.status live (${POOL_STATUS_URL})`);
}

function renderPoolData(payload) {
    const stats = payload?.stats;
    const runtime = stats?.runtime || {};
    const hashrate = stats?.hashrate || {};
    const shares = stats?.shares || {};

    setText('pool-generated-at', formatDate(payload?.generated_at));
    setText('pool-last-update', formatDate(runtime.lastupdate_iso));

    if (!stats) {
        setAllStatsFallback('N/A');
        showError('Pool statistics are not available. Check POOL_LOG_DIR sync into /pool-data.');
        return;
    }

    hideError();

    setText('stat-runtime', runtime.runtime_human || 'N/A');
    setText('stat-users', formatNumber(runtime.Users));
    setText('stat-workers', formatNumber(runtime.Workers));
    setText('stat-idle', formatNumber(runtime.Idle));
    setText('stat-disconnected', formatNumber(runtime.Disconnected));
    setText('stat-diff', formatNumber(shares.diff, 4));
    setText('stat-accepted', formatNumber(shares.accepted));
    setText('stat-rejected', formatNumber(shares.rejected));
    setText('stat-total-shares', formatNumber(shares.total));
    setText('stat-acceptance-rate', formatPercent(shares.acceptance_rate));
    setText('stat-bestshare', formatNumber(shares.bestshare, 2));

    setText('stat-hashrate1m', formatHashrate(hashrate.hashrate1m));
    setText('stat-hashrate5m', formatHashrate(hashrate.hashrate5m));
    setText('stat-hashrate15m', formatHashrate(hashrate.hashrate15m));
    setText('stat-hashrate1hr', formatHashrate(hashrate.hashrate1hr));
    setText('stat-hashrate6hr', formatHashrate(hashrate.hashrate6hr));
    setText('stat-hashrate1d', formatHashrate(hashrate.hashrate1d));
    setText('stat-hashrate7d', formatHashrate(hashrate.hashrate7d));

    setText('stat-sps1m', formatRate(shares.SPS1m));
    setText('stat-sps5m', formatRate(shares.SPS5m));
    setText('stat-sps15m', formatRate(shares.SPS15m));
    setText('stat-sps1h', formatRate(shares.SPS1h));
}

async function loadPoolStats() {
    try {
        const liveStatusData = await fetchLivePoolStatusData();
        renderPoolData(liveStatusData);
    } catch (finalError) {
        console.error('Failed to load pool stats:', finalError);
        setText('pool-generated-at', 'N/A');
        setText('pool-last-update', 'N/A');
        setAllStatsFallback('N/A');
        showError('Unable to load pool stats from /pool-data/pool/pool.status.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-pool-stats');
    if (refreshBtn) refreshBtn.addEventListener('click', loadPoolStats);
    initUserSearchForm();

    loadPoolStats();
    setInterval(loadPoolStats, AUTO_REFRESH_MS);
});

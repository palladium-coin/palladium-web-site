/* Pool user statistics page JavaScript */

const USER_DATA_BASE_URL = '/pool-data/users';
const AUTO_REFRESH_MS = 20_000;

const USER_STAT_IDS = [
    'user-workers',
    'user-shares',
    'user-bestshare',
    'user-bestever',
    'user-authorised',
    'user-hashrate1m',
    'user-hashrate5m',
    'user-hashrate1hr',
    'user-hashrate1d',
    'user-hashrate7d',
];

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setAllStatsFallback(text) {
    USER_STAT_IDS.forEach(id => setText(id, text));
}

function formatDate(iso) {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString();
}

function formatEpoch(epochSeconds) {
    const value = Number(epochSeconds);
    if (!Number.isFinite(value) || value <= 0) return 'N/A';
    return formatDate(new Date(value * 1000).toISOString());
}

function formatNumber(value, maxFractionDigits = 0) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 'N/A';
    return n.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits });
}

function formatHashrate(raw) {
    if (raw === null || raw === undefined) return 'N/A';
    const str = String(raw).trim();
    if (!str) return 'N/A';
    if (str.endsWith('/s')) return str;
    if (str === '0') return '0 H/s';
    return `${str}H/s`;
}

function showError(message) {
    const el = document.getElementById('user-error');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('is-hidden');
}

function hideError() {
    const el = document.getElementById('user-error');
    if (!el) return;
    el.textContent = '';
    el.classList.add('is-hidden');
}

function getUsernameFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    return username ? username.trim() : '';
}

function renderWorkerCards(workers) {
    const container = document.getElementById('user-workers-grid');
    if (!container) return;

    container.innerHTML = '';

    if (!Array.isArray(workers) || workers.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'user-workers-empty';
        empty.textContent = 'No worker details are currently available for this user.';
        container.appendChild(empty);
        return;
    }

    workers.forEach((worker) => {
        const card = document.createElement('article');
        card.className = 'user-worker-card';

        const title = document.createElement('h4');
        title.className = 'user-worker-title';
        title.textContent = worker.workername || 'Unnamed worker';
        card.appendChild(title);

        const rows = [
            ['Hashrate 1m', formatHashrate(worker.hashrate1m)],
            ['Hashrate 5m', formatHashrate(worker.hashrate5m)],
            ['Hashrate 1h', formatHashrate(worker.hashrate1hr)],
            ['Shares', formatNumber(worker.shares)],
            ['Best Share', formatNumber(worker.bestshare, 2)],
            ['Last Share', formatEpoch(worker.lastshare)],
        ];

        rows.forEach(([label, value]) => {
            const row = document.createElement('div');
            row.className = 'user-worker-row';

            const labelEl = document.createElement('span');
            labelEl.className = 'user-worker-label';
            labelEl.textContent = label;

            const valueEl = document.createElement('span');
            valueEl.className = 'user-worker-value';
            valueEl.textContent = value;

            row.appendChild(labelEl);
            row.appendChild(valueEl);
            card.appendChild(row);
        });

        container.appendChild(card);
    });
}

async function fetchUserStats(username) {
    if (!username) {
        throw new Error('Missing username in URL.');
    }

    const response = await fetch(`${USER_DATA_BASE_URL}/${encodeURIComponent(username)}?v=${Date.now()}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`User "${username}" not found.`);
        }
        throw new Error(`User stats request failed: ${response.status}`);
    }

    const text = await response.text();
    let payload;
    try {
        payload = JSON.parse(text);
    } catch {
        throw new Error('User stats payload is not valid JSON.');
    }

    if (!payload || typeof payload !== 'object') {
        throw new Error('User stats payload is empty.');
    }

    return payload;
}

function renderUserStats(username, payload) {
    document.title = `Palladium Pool User Statistics - ${username}`;
    setText('user-username', username);
    setText('user-generated-at', formatDate(new Date().toISOString()));
    setText('user-last-share', formatEpoch(payload.lastshare));

    const workerCount = Number.isFinite(Number(payload.workers))
        ? Number(payload.workers)
        : (Array.isArray(payload.worker) ? payload.worker.length : null);

    setText('user-workers', formatNumber(workerCount));
    setText('user-shares', formatNumber(payload.shares));
    setText('user-bestshare', formatNumber(payload.bestshare, 2));
    setText('user-bestever', formatNumber(payload.bestever, 2));
    setText('user-authorised', formatEpoch(payload.authorised));

    setText('user-hashrate1m', formatHashrate(payload.hashrate1m));
    setText('user-hashrate5m', formatHashrate(payload.hashrate5m));
    setText('user-hashrate1hr', formatHashrate(payload.hashrate1hr));
    setText('user-hashrate1d', formatHashrate(payload.hashrate1d));
    setText('user-hashrate7d', formatHashrate(payload.hashrate7d));

    renderWorkerCards(payload.worker);
}

async function loadUserStats() {
    const username = getUsernameFromQuery();
    setText('user-username', username || 'N/A');

    if (!username) {
        setText('user-generated-at', 'N/A');
        setText('user-last-share', 'N/A');
        setAllStatsFallback('N/A');
        renderWorkerCards([]);
        showError('Missing username. Open this page from pool dashboard search.');
        return;
    }

    try {
        const payload = await fetchUserStats(username);
        hideError();
        renderUserStats(username, payload);
    } catch (error) {
        setText('user-generated-at', 'N/A');
        setText('user-last-share', 'N/A');
        setAllStatsFallback('N/A');
        renderWorkerCards([]);
        showError(error.message || 'Unable to load user statistics.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-user-stats');
    if (refreshBtn) refreshBtn.addEventListener('click', loadUserStats);

    loadUserStats();
    setInterval(loadUserStats, AUTO_REFRESH_MS);
});

/* Mining page specific JavaScript */

function formatHashrate(hps) {
    if (hps >= 1e18) return { value: (hps / 1e18).toFixed(2), unit: 'EH/s' };
    if (hps >= 1e15) return { value: (hps / 1e15).toFixed(2), unit: 'PH/s' };
    if (hps >= 1e12) return { value: (hps / 1e12).toFixed(2), unit: 'TH/s' };
    if (hps >= 1e9)  return { value: (hps / 1e9).toFixed(2),  unit: 'GH/s' };
    if (hps >= 1e6)  return { value: (hps / 1e6).toFixed(2),  unit: 'MH/s' };
    if (hps >= 1e3)  return { value: (hps / 1e3).toFixed(2),  unit: 'KH/s' };
    return { value: hps.toFixed(2), unit: 'H/s' };
}

function formatDifficulty(diff) {
    if (diff >= 1e12) return (diff / 1e12).toFixed(2) + ' T';
    if (diff >= 1e9)  return (diff / 1e9).toFixed(2)  + ' G';
    if (diff >= 1e6)  return (diff / 1e6).toFixed(2)  + ' M';
    if (diff >= 1e3)  return (diff / 1e3).toFixed(2)  + ' K';
    if (diff < 1)     return diff.toExponential(3);
    return diff.toFixed(2);
}

function setStatLoading(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = '—'; el.classList.add('stat-loading'); }
}

function setStatValue(id, text) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('stat-loading'); el.textContent = text; }
}

async function fetchMiningStats() {
    setStatLoading('stat-block-height');
    setStatLoading('stat-hashrate');
    setStatLoading('stat-difficulty');

    const headers = apiHeaders();

    try {
        const [heightRes, hashrateRes, diffRes] = await Promise.all([
            fetch(apiUrl(CONFIG.ENDPOINTS.BLOCK_HEIGHT),     { headers }),
            fetch(apiUrl(CONFIG.ENDPOINTS.NETWORK_HASHRATE), { headers }),
            fetch(apiUrl(CONFIG.ENDPOINTS.DIFFICULTY),       { headers }),
        ]);

        if (heightRes.ok) {
            const data = await heightRes.json();
            const height = data.block_height ?? data.height ?? data;
            setStatValue('stat-block-height', Number(height).toLocaleString());
        } else {
            setStatValue('stat-block-height', 'N/A');
        }

        if (hashrateRes.ok) {
            const data = await hashrateRes.json();
            const raw = data.hashrate ?? data.network_hashrate ?? data;
            const { value, unit } = formatHashrate(Number(raw));
            setStatValue('stat-hashrate', `${value} ${unit}`);
        } else {
            setStatValue('stat-hashrate', 'N/A');
        }

        if (diffRes.ok) {
            const data = await diffRes.json();
            const diff = data.difficulty ?? data;
            setStatValue('stat-difficulty', formatDifficulty(Number(diff)));
        } else {
            setStatValue('stat-difficulty', 'N/A');
        }

    } catch (e) {
        console.error('Failed to fetch mining stats:', e);
        ['stat-block-height', 'stat-hashrate', 'stat-difficulty'].forEach(id => setStatValue(id, 'N/A'));
    }
}

document.addEventListener('DOMContentLoaded', fetchMiningStats);
setInterval(fetchMiningStats, 60_000);

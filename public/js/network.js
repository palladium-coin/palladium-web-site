/* Network page specific JavaScript */

function showSkeletons(listId) {
    const el = document.getElementById(listId);
    if (!el) return;
    el.innerHTML =
        '<div class="network-skeleton"></div>' +
        '<div class="network-skeleton"></div>' +
        '<div class="network-skeleton"></div>';
}

function showEmpty(listId, message) {
    const el = document.getElementById(listId);
    if (el) el.innerHTML = `<p class="network-empty">${message}</p>`;
}

function setBadge(id, count) {
    const el = document.getElementById(id);
    if (el) el.textContent = count + (count === 1 ? ' peer' : count === 0 ? ' peers' : ' peers');
}

function setServerBadge(id, count) {
    const el = document.getElementById(id);
    if (el) el.textContent = count + (count === 1 ? ' server' : ' servers');
}

// ---- Render peers ----
// Built with createElement/textContent (not innerHTML) — peer.addr comes from
// the P2P network and must never be treated as trusted markup.
function renderPeers(peers) {
    const el = document.getElementById('peers-list');
    if (!el) return;

    // Only show outbound peers — these are publicly reachable nodes
    const outbound = (peers || []).filter(p => p.inbound === false);

    if (outbound.length === 0) {
        showEmpty('peers-list', 'No reachable nodes found.');
        setBadge('peers-count', 0);
        return;
    }

    setBadge('peers-count', outbound.length);

    el.innerHTML = '';
    outbound.forEach(peer => {
        const row = document.createElement('div');
        row.className = 'network-row';

        const dot = document.createElement('span');
        dot.className = 'net-dot online';
        row.appendChild(dot);

        const addr = document.createElement('span');
        addr.className = 'net-addr';
        addr.title = peer.addr;
        addr.textContent = peer.addr;
        row.appendChild(addr);

        el.appendChild(row);
    });
}

// ---- Render ElectrumX servers ----
// Same rule as renderPeers: srv.host is community-submitted server data,
// never interpolated into innerHTML.
function renderServers(servers) {
    const el = document.getElementById('servers-list');
    if (!el) return;

    if (!servers || servers.length === 0) {
        showEmpty('servers-list', 'No ElectrumX servers found.');
        setServerBadge('servers-count', 0);
        return;
    }

    setServerBadge('servers-count', servers.length);

    el.innerHTML = '';
    servers.forEach(srv => {
        const alive = srv.tcp_reachable || srv.ssl_reachable;

        const row = document.createElement('div');
        row.className = 'network-row';

        const dot = document.createElement('span');
        dot.className = `net-dot ${alive ? 'online' : 'offline'}`;
        row.appendChild(dot);

        const addr = document.createElement('span');
        addr.className = 'net-addr';
        addr.title = srv.host;
        addr.textContent = srv.host;
        row.appendChild(addr);

        const ports = document.createElement('span');
        ports.className = 'net-ports';

        if (srv.tcp_port) {
            const tcpBadge = document.createElement('span');
            tcpBadge.className = `net-port ${srv.tcp_reachable ? 'tcp' : 'unreachable'}`;
            tcpBadge.title = 'TCP';
            tcpBadge.textContent = `TCP ${srv.tcp_port}`;
            ports.appendChild(tcpBadge);
        }
        if (srv.ssl_port) {
            const sslBadge = document.createElement('span');
            sslBadge.className = `net-port ${srv.ssl_reachable ? 'ssl' : 'unreachable'}`;
            sslBadge.title = 'SSL';
            sslBadge.textContent = `SSL ${srv.ssl_port}`;
            ports.appendChild(sslBadge);
        }
        row.appendChild(ports);

        el.appendChild(row);
    });
}

// ---- Main fetch ----
let _loaded = false;
let _retryTimer = null;

async function fetchNetworkData() {
    // Cancel any pending initial-load retry (e.g. if interval fires first)
    clearTimeout(_retryTimer);
    _retryTimer = null;

    const headers = apiHeaders();

    // Show timestamp immediately so it's never blank
    const ts = document.getElementById('last-updated');
    if (ts) ts.textContent = new Date().toLocaleTimeString();

    let success = false;
    try {
        const [peersRes, serversRes] = await Promise.all([
            fetch(apiUrl(CONFIG.ENDPOINTS.NETWORK_PEERS),     { headers }),
            fetch(apiUrl(CONFIG.ENDPOINTS.ELECTRUMX_SERVERS), { headers }),
        ]);

        if (peersRes.ok) {
            const data = await peersRes.json();
            renderPeers(data.peers ?? []);
            success = true;
        } else {
            showEmpty('peers-list', 'Could not load peer data.');
            setBadge('peers-count', 0);
        }

        if (serversRes.ok) {
            const data = await serversRes.json();
            renderServers(data.servers ?? []);
            success = true;
        } else {
            showEmpty('servers-list', 'Could not load server data.');
            setServerBadge('servers-count', 0);
        }

    } catch (e) {
        console.error('Failed to fetch network data:', e);
        showEmpty('peers-list',   'Connection error.');
        showEmpty('servers-list', 'Connection error.');
    }

    if (success) {
        _loaded = true;
    } else if (!_loaded) {
        // First load failed: retry every 3 s instead of waiting 15 s
        _retryTimer = setTimeout(fetchNetworkData, 3_000);
    }
}

// Scripts are after </body> so DOM is already ready — call directly
fetchNetworkData();
setInterval(fetchNetworkData, 15_000);

// Manual refresh button
const _refreshBtn = document.getElementById('refresh-btn');
if (_refreshBtn) {
    _refreshBtn.addEventListener('click', () => {
        _refreshBtn.classList.add('spinning');
        fetchNetworkData().finally(() => _refreshBtn.classList.remove('spinning'));
    });
}

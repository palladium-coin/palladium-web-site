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

    el.innerHTML = outbound.map(peer => `
        <div class="network-row">
            <span class="net-dot online"></span>
            <span class="net-addr" title="${peer.addr}">${peer.addr}</span>
        </div>`
    ).join('');
}

// ---- Render ElectrumX servers ----
function renderServers(servers) {
    const el = document.getElementById('servers-list');
    if (!el) return;

    if (!servers || servers.length === 0) {
        showEmpty('servers-list', 'No ElectrumX servers found.');
        setServerBadge('servers-count', 0);
        return;
    }

    setServerBadge('servers-count', servers.length);

    el.innerHTML = servers.map(srv => {
        const alive = srv.tcp_reachable || srv.ssl_reachable;
        const dotClass = alive ? 'online' : 'offline';

        const tcpClass = srv.tcp_reachable ? 'tcp' : 'unreachable';
        const sslClass = srv.ssl_reachable ? 'ssl' : 'unreachable';

        const tcpBadge = srv.tcp_port
            ? `<span class="net-port ${tcpClass}" title="TCP">TCP ${srv.tcp_port}</span>`
            : '';
        const sslBadge = srv.ssl_port
            ? `<span class="net-port ${sslClass}" title="SSL">SSL ${srv.ssl_port}</span>`
            : '';

        return `
        <div class="network-row">
            <span class="net-dot ${dotClass}"></span>
            <span class="net-addr" title="${srv.host}">${srv.host}</span>
            <span class="net-ports">${tcpBadge}${sslBadge}</span>
        </div>`;
    }).join('');
}

// ---- Main fetch ----
async function fetchNetworkData() {
    const headers = apiHeaders();

    // Show timestamp immediately so it's never blank
    const ts = document.getElementById('last-updated');
    if (ts) ts.textContent = new Date().toLocaleTimeString();

    try {
        const [peersRes, serversRes] = await Promise.all([
            fetch(apiUrl(CONFIG.ENDPOINTS.NETWORK_PEERS),     { headers }),
            fetch(apiUrl(CONFIG.ENDPOINTS.ELECTRUMX_SERVERS), { headers }),
        ]);

        if (peersRes.ok) {
            const data = await peersRes.json();
            renderPeers(data.peers ?? []);
        } else {
            showEmpty('peers-list', 'Could not load peer data.');
            setBadge('peers-count', 0);
        }

        if (serversRes.ok) {
            const data = await serversRes.json();
            renderServers(data.servers ?? []);
        } else {
            showEmpty('servers-list', 'Could not load server data.');
            setServerBadge('servers-count', 0);
        }

    } catch (e) {
        console.error('Failed to fetch network data:', e);
        showEmpty('peers-list',   'Connection error.');
        showEmpty('servers-list', 'Connection error.');
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

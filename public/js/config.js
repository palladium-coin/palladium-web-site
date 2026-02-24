// AUTO-GENERATED — do not edit by hand.
// Re-generate with: node scripts/generate-config.js
// Edit .env to change values.

const CONFIG = {
    // In production: '' (Caddy proxies /api/* → localhost:8080)
    // In dev:        'http://localhost:8080' (stack locale con flask-cors)
    // Iniettato da scripts/generate-config.js tramite .env
    API_BASE_URL: 'http://localhost:8080',
    API_KEY: '2OMfpa0Jxj5sgc-e9VM30D4JIfp2_q8dAfOW1EnEw6ISWhJc1jMbzsRGuhruUfu0',

    ENDPOINTS: {
        BLOCK_HEIGHT:      '/api/palladium/block-height',
        NETWORK_HASHRATE:  '/api/palladium/network-hashrate',
        DIFFICULTY:        '/api/palladium/difficulty',
        BLOCKS_RECENT:     '/api/palladium/blocks/recent',
        PALLADIUM_INFO:    '/api/palladium/info',
        ELECTRUMX_STATS:   '/api/electrumx/stats',
        HEALTH:            '/api/health',
    }
};

function apiHeaders() {
    const h = {};
    if (CONFIG.API_KEY) h['X-API-Key'] = CONFIG.API_KEY;
    return h;
}

function apiUrl(endpoint) {
    return CONFIG.API_BASE_URL + endpoint;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

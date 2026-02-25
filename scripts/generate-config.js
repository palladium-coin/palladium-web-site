#!/usr/bin/env node
/**
 * Reads .env from the project root and writes public/js/config.js
 * with API_BASE_URL and API_KEY injected.
 *
 * Usage:
 *   node scripts/generate-config.js              # reads .env
 *   node scripts/generate-config.js --prod       # forces empty API_BASE_URL (same-origin via Caddy)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const root      = path.resolve(__dirname, '..');
const envFile   = path.join(root, '.env');
const outputFile = path.join(root, 'public', 'js', 'config.js');

// ---------- parse .env ----------
function parseEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    const result = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        result[key] = val;
    }
    return result;
}

const isProd  = process.argv.includes('--prod');
const env     = parseEnv(envFile);

const apiBaseUrl = isProd ? '' : (env.API_BASE_URL || '');
const apiKey     = isProd ? '' : (env.API_KEY     || '');

// ---------- write config.js ----------
const content = `// AUTO-GENERATED — do not edit by hand.
// Re-generate with: node scripts/generate-config.js
// Edit .env to change values.

const CONFIG = {
    // In production: '' (Caddy proxies /api/* → localhost:8080)
    // In dev:        'http://localhost:8080' (stack locale con flask-cors)
    // Iniettato da scripts/generate-config.js tramite .env
    API_BASE_URL: '${apiBaseUrl}',
    API_KEY: '${apiKey}',

    ENDPOINTS: {
        BLOCK_HEIGHT:      '/api/palladium/block-height',
        NETWORK_HASHRATE:  '/api/palladium/network-hashrate',
        DIFFICULTY:        '/api/palladium/difficulty',
        BLOCKS_RECENT:     '/api/palladium/blocks/recent',
        PALLADIUM_INFO:    '/api/palladium/info',
        ELECTRUMX_STATS:   '/api/electrumx/stats',
        NETWORK_PEERS:     '/api/palladium/peers',
        ELECTRUMX_SERVERS: '/api/electrumx/servers',
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
`;

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`[generate-config] wrote ${outputFile}`);
console.log(`  API_BASE_URL = ${apiBaseUrl || '(empty — same-origin)'}`);
console.log(`  API_KEY      = ${apiKey ? apiKey.slice(0, 8) + '...' : '(empty)'}`);

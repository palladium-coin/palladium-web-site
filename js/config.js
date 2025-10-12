// Configuration file for API endpoints
// This file reads from environment variables
function loadEnvConfig() {
    // In a browser environment, we need to load .env variables differently
    // For now, we'll use a simple approach that can be extended
    const config = {
        API_BASE_URL: null,
        ENDPOINTS: {
            HALVING: '/halving',
            HEIGHT: '/height',
            DIFFICULTY: '/difficulty',
            HASHRATE: '/hashrate',
            AVG_BLOCK_TIME: '/avg-block-time'
        }
    };
    
    // Try to read from a global env object if available
    if (typeof window !== 'undefined' && window.ENV) {
        config.API_BASE_URL = window.ENV.API_BASE_URL;
        config.ENDPOINTS.HALVING = window.ENV.HALVING_ENDPOINT || '/halving';
        config.ENDPOINTS.HEIGHT = window.ENV.HEIGHT_ENDPOINT || '/height';
        config.ENDPOINTS.DIFFICULTY = window.ENV.DIFFICULTY_ENDPOINT || '/difficulty';
        config.ENDPOINTS.HASHRATE = window.ENV.HASHRATE_ENDPOINT || '/hashrate';
        config.ENDPOINTS.AVG_BLOCK_TIME = window.ENV.AVG_BLOCK_TIME_ENDPOINT || '/avg-block-time';
    }
    
    return config;
}

// Wait for environment variables to be loaded
function waitForEnv() {
    return new Promise((resolve) => {
        const checkEnv = () => {
            if (window.ENV && window.ENV.API_BASE_URL) {
                resolve();
            } else {
                // Check again after 50ms
                setTimeout(checkEnv, 50);
            }
        };
        checkEnv();
    });
}

// Initialize configuration after environment is loaded
let CONFIG = null;

waitForEnv().then(() => {
    CONFIG = loadEnvConfig();
    console.log('CONFIG initialized:', CONFIG);
});

// Function to get full API URL
function getApiUrl(endpoint) {
    if (!CONFIG || !CONFIG.API_BASE_URL) {
        throw new Error('API_BASE_URL not configured. Please check environment configuration.');
    }
    return CONFIG.API_BASE_URL + CONFIG.ENDPOINTS[endpoint];
}
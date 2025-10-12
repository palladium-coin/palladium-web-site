// Configuration for Palladium website
const CONFIG = {
    // Use local proxy to avoid CORS issues
    API_BASE_URL: '/api',
    
    // API endpoints
    ENDPOINTS: {
        'HEIGHT': '/height',
        'DIFFICULTY': '/difficulty', 
        'HASHRATE': '/hashrate',
        'AVG_BLOCK_TIME': '/avg-block-time',
        'HALVING': '/halving'
    }
};

// Function to get API URL
function getApiUrl(endpoint) {
    return CONFIG.API_BASE_URL + CONFIG.ENDPOINTS[endpoint];
}
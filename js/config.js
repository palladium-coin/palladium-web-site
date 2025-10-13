// Configuration for Palladium website
const CONFIG = {
    // Direct API URL for Palladium blockchain
    API_BASE_URL: 'http://palladiumblockchain.net:8032',
    
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
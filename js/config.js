// Configuration file for Palladium website
// This file contains basic configuration that might be needed in the future

const CONFIG = {
    // Base URLs for potential future use
    API_BASE_URL: 'https://api.palladiumcoin.org',
    
    // Reserved for future endpoints
    ENDPOINTS: {
        // Placeholder for future API endpoints
    }
};

// Utility function for potential future API calls
function getApiUrl(endpoint) {
    return `${CONFIG.API_BASE_URL}/${endpoint}`;
}

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
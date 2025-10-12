// Environment loader for browser
// This script loads .env variables and makes them available globally

async function loadEnvironmentVariables() {
    try {
        console.log('Loading environment variables from .env file...');
        
        // Fetch the .env file
        const response = await fetch('.env');
        if (!response.ok) {
            throw new Error(`Could not load .env file: ${response.status} ${response.statusText}`);
        }
        
        const envText = await response.text();
        const envVars = {};
        
        // Parse .env file
        const lines = envText.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Skip comments and empty lines
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    const cleanKey = key.trim();
                    const cleanValue = valueParts.join('=').trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    envVars[cleanKey] = cleanValue;
                }
            }
        }
        
        // Make environment variables available globally
        window.ENV = envVars;
        console.log('Environment variables loaded successfully:', Object.keys(envVars));
        console.log('API_BASE_URL:', envVars.API_BASE_URL);
        
        return envVars;
    } catch (error) {
        console.error('Error loading environment variables:', error);
        
        // Fallback: set default values for development
        const fallbackEnv = {
            API_BASE_URL: 'http://localhost:8032',
            HALVING_ENDPOINT: '/halving',
            HEIGHT_ENDPOINT: '/height',
            DIFFICULTY_ENDPOINT: '/difficulty',
            HASHRATE_ENDPOINT: '/hashrate',
            AVG_BLOCK_TIME_ENDPOINT: '/avg-block-time',
            API_HOST: 'localhost',
            API_PORT: '8032',
            API_SCHEME: 'http'
        };
        
        window.ENV = fallbackEnv;
        console.warn('Using fallback environment variables:', Object.keys(fallbackEnv));
        
        return fallbackEnv;
    }
}

// Load environment variables when script loads and make it available globally
window.loadEnvironmentVariables = loadEnvironmentVariables;
loadEnvironmentVariables();
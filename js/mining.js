/* Mining page specific JavaScript */

// Page loader animation
const pageloader = document.getElementById('loader');
bodymovin.loadAnimation({
    wrapper: pageloader,
    animType: 'svg',
    autoplay: true,
    loop: true,
    path: 'assets/animations/loader.json'
});

// Copy to clipboard function
function copy(text) {
    navigator.clipboard.writeText(text);
}

// Mining statistics update functions
class MiningStatsUpdater {
    constructor() {
        this.updateInterval = 30000; // 30 seconds
        this.lastUpdate = null;
        this.fallbackData = {
            networkHashrate: 'Loading...',
            difficulty: 'Loading...',
            blockHeight: 'Loading...',
            avgBlockTime: 'Loading...'
        };
        this.init();
    }

    init() {
        // Load fallback data immediately
        this.loadFallbackData();
        // Wait for environment to be loaded, then try to update with real data
        this.waitAndUpdate();
        setInterval(() => this.updateStats(), this.updateInterval);
    }

    async waitAndUpdate() {
        try {
            // Wait for environment variables to be loaded
            await this.waitForEnvironment();
            // Try to update with real data
            await this.updateStats();
        } catch (error) {
            console.warn('Could not load environment or update stats:', error);
        }
    }

    async waitForEnvironment() {
        // No longer needed since CONFIG is hardcoded
        console.log('CONFIG is hardcoded and ready');
        return Promise.resolve();
    }

    loadFallbackData() {
        console.log('Loading fallback mining data...');
        this.updateElement('network-hashrate', this.fallbackData.networkHashrate);
        this.updateElement('difficulty', this.fallbackData.difficulty);
        this.updateElement('block-height', this.fallbackData.blockHeight);
        this.updateElement('avg-block-time', this.fallbackData.avgBlockTime);
        
        this.lastUpdate = new Date();
        this.updateLastUpdateTime();
    }

    async fetchHeight() {
        try {
            const response = await fetch(getApiUrl('HEIGHT'), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.height;
        } catch (error) {
            console.error('Error fetching height:', error);
            throw error;
        }
    }

    async fetchDifficulty() {
        try {
            const response = await fetch(getApiUrl('DIFFICULTY'), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.difficulty;
        } catch (error) {
            console.error('Error fetching difficulty:', error);
            throw error;
        }
    }

    async fetchHashrate() {
        try {
            const response = await fetch(getApiUrl('HASHRATE'), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.hashrate;
        } catch (error) {
            console.error('Error fetching hashrate:', error);
            throw error;
        }
    }

    async fetchAvgBlockTime() {
        try {
            const response = await fetch(getApiUrl('AVG_BLOCK_TIME'), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.avg_block_time;
        } catch (error) {
            console.error('Error fetching avg block time:', error);
            throw error;
        }
    }

    formatHashrate(hashrateHps) {
        if (!hashrateHps || hashrateHps === 0) return 'N/A';
        
        // Convert hashrate to appropriate units
        const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
        let value = parseFloat(hashrateHps);
        let unitIndex = 0;
        
        while (value >= 1000 && unitIndex < units.length - 1) {
            value /= 1000;
            unitIndex++;
        }
        
        return `${value.toFixed(2)} ${units[unitIndex]}`;
    }

    formatDifficulty(difficulty) {
        if (!difficulty || difficulty === 0) return 'N/A';
        
        // Format difficulty with appropriate units
        if (difficulty >= 1000000) {
            return `${(difficulty / 1000000).toFixed(2)} M`;
        } else if (difficulty >= 1000) {
            return `${(difficulty / 1000).toFixed(2)} K`;
        } else {
            return difficulty.toFixed(2);
        }
    }

    formatBlockHeight(height) {
        if (!height || height === 0) return 'N/A';
        return height.toLocaleString();
    }

    formatAvgBlockTime(timeSeconds) {
        if (!timeSeconds || timeSeconds === 0) return 'N/A';
        
        const minutes = Math.floor(timeSeconds / 60);
        const seconds = Math.round(timeSeconds % 60);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }

    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            console.log(`Updated ${elementId}: ${value}`);
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }
    }

    async updateStats() {
        try {
            console.log('=== STARTING MINING STATS UPDATE ===');
            console.log('Checking CONFIG availability...');
            
            // Wait for CONFIG to be available
            if (!CONFIG) {
                console.log('CONFIG not ready, waiting...');
                await waitForEnv();
                // Reload config after env is ready
                CONFIG = loadEnvConfig();
                console.log('CONFIG loaded:', CONFIG);
            }
            
            console.log('Updating mining statistics from API endpoints...');
            
            // Show loading indicators
            this.showLoadingIndicators();
            
            try {
                // Fetch all data in parallel
                const [height, difficulty, hashrate, avgBlockTime] = await Promise.all([
                    this.fetchHeight(),
                    this.fetchDifficulty(),
                    this.fetchHashrate(),
                    this.fetchAvgBlockTime()
                ]);
                
                console.log('Raw data received:', { height, difficulty, hashrate, avgBlockTime });
                
                // Format and update the data
                this.updateElement('block-height', this.formatBlockHeight(height));
                this.updateElement('difficulty', this.formatDifficulty(difficulty));
                this.updateElement('network-hashrate', this.formatHashrate(hashrate));
                this.updateElement('avg-block-time', this.formatAvgBlockTime(avgBlockTime));
                
                // Update last update time
                this.lastUpdate = new Date();
                this.updateLastUpdateTime();
                console.log('Mining statistics updated successfully');
                console.log('=== UPDATE COMPLETED SUCCESSFULLY ===');
                
            } catch (fetchError) {
                console.warn('Failed to fetch mining data, using fallback:', fetchError);
                this.loadFallbackData();
            }
            
            // Hide loading indicators
            this.hideLoadingIndicators();
            
        } catch (error) {
            console.error('Error updating mining statistics:', error);
            this.hideLoadingIndicators();
        }
    }

    showLoadingIndicators() {
        const loadingElements = document.querySelectorAll('.stat-loading');
        loadingElements.forEach(element => {
            element.style.display = 'inline-block';
        });
    }

    hideLoadingIndicators() {
        const loadingElements = document.querySelectorAll('.stat-loading');
        loadingElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.querySelector('.last-update');
        if (lastUpdateElement && this.lastUpdate) {
            const timeString = this.lastUpdate.toLocaleTimeString();
            lastUpdateElement.textContent = `Last updated: ${timeString}`;
        }
    }
}

/* On page loaded */
$(window).on('load', function() {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
    $("#pageloader").fadeOut();
    
    // Initialize mining statistics updater
    const statsUpdater = new MiningStatsUpdater();
});
/* Animations */
const wavecontainer = document.getElementById('wavecontainer');
const pickaxecontainer = document.getElementById('pickaxe');
const codecontainer = document.getElementById('code');
const moneycontainer = document.getElementById('money');
const pageloader = document.getElementById('loader');

bodymovin.loadAnimation({
    wrapper: pageloader,
    animType: 'svg',
    autoplay: true,
    loop: true,
    path: 'assets/animations/loader.json'
});

bodymovin.loadAnimation({
    wrapper: wavecontainer,
    animType: 'svg',
    autoplay: true,
    loop: true,
    path: 'assets/animations/wave.json'
});

bodymovin.loadAnimation({
    wrapper: pickaxecontainer,
    animType: 'svg',
    autoplay: true,
    loop: true,
    path: 'assets/animations/pickaxe.json'
});

bodymovin.loadAnimation({
    wrapper: codecontainer,
    animType: 'svg',
    autoplay: true,
    loop: true,
    path: 'assets/animations/code.json'
});

bodymovin.loadAnimation({
    wrapper: moneycontainer,
    animType: 'svg',
    autoplay: true,
    loop: true,
    path: 'assets/animations/money.json'
});

/* Animated device names */
const devices = [
    "",
   
]

function delay(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delay);
    });
}

async function change_devices() {
    devicetext = document.getElementById("devices")
    await delay(1500);
    while (true) {
        for (element in devices) {
            devicetext.classList.add('hide');
            await delay(200);
            devicetext.innerHTML = devices[element];
            devicetext.classList.remove('hide');
            await delay(800);
        }
    }
}

change_devices();

/* Toshi's stuff */
window.dataLayer = window.dataLayer || [];

function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-142187073-69');

/* Halving Countdown Logic */
class HalvingCountdown {
    constructor() {
        console.log('HalvingCountdown constructor called');
        this.countdownInterval = null;
        this.blockUpdateInterval = null;
        this.etaSeconds = 0;
        this.blocksRemaining = 0;
        
        this.init();
    }
    
    async init() {
        console.log('HalvingCountdown init() called');
        try {
            console.log('Attempting to fetch halving data...');
            await this.fetchHalvingData();
            console.log('Halving data fetched successfully, starting countdown...');
            this.startCountdown();
        } catch (error) {
            console.error('Error initializing halving countdown:', error);
            this.showError();
        }
    }
    
    async fetchHalvingData() {
        console.log('Fetching halving data from API...');
        try {
            const url = getApiUrl('HALVING');
            console.log('API URL:', url);
            
            // Try to fetch from API first
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API data received:', data);
                
                if (data && typeof data.eta_seconds === 'number' && data.eta_seconds > 0) {
                    this.etaSeconds = data.eta_seconds;
                    this.blocksRemaining = data.blocks_remaining || 0;
                    console.log('Halving data parsed successfully:', {
                        etaSeconds: this.etaSeconds,
                        blocksRemaining: this.blocksRemaining
                    });
                    return;
                }
            } catch (apiError) {
                console.warn('API request failed, using fallback data:', apiError.message);
            }
            
            // Fallback data when API is not accessible
            console.log('Using fallback halving data...');
            this.etaSeconds = 13800600; // ~159 days
            this.blocksRemaining = 115005;
            console.log('Fallback data set:', {
                etaSeconds: this.etaSeconds,
                blocksRemaining: this.blocksRemaining
            });
            
        } catch (error) {
            console.error('Error in fetchHalvingData:', error);
            // Use fallback data
            this.etaSeconds = 13800600; // ~159 days
            this.blocksRemaining = 115005;
            console.log('Error fallback data set');
        }
    }
    
    startCountdown() {
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
        
        // Update halving data every 30 seconds to stay in sync with API
        this.blockUpdateInterval = setInterval(async () => {
            try {
                await this.fetchHalvingData();
            } catch (error) {
                console.warn('Failed to update halving data:', error);
            }
        }, 30000);
    }
    
    updateCountdown() {
        // Update blocks remaining display
        const blocksRemainingElement = document.getElementById('blocks-remaining');
        if (blocksRemainingElement) {
            blocksRemainingElement.textContent = this.blocksRemaining.toLocaleString();
            console.log('Updated blocks remaining:', this.blocksRemaining);
        } else {
            console.error('Element with ID "blocks-remaining" not found');
        }
        
        // Calculate time components from eta_seconds
        const totalSeconds = Math.max(0, this.etaSeconds);
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        
        // Update countdown display with better error handling
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) {
            daysElement.textContent = days;
            console.log('Updated days:', days);
        } else {
            console.error('Element with ID "days" not found');
        }
        
        if (hoursElement) {
            hoursElement.textContent = hours.toString().padStart(2, '0');
            console.log('Updated hours:', hours);
        } else {
            console.error('Element with ID "hours" not found');
        }
        
        if (minutesElement) {
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            console.log('Updated minutes:', minutes);
        } else {
            console.error('Element with ID "minutes" not found');
        }
        
        if (secondsElement) {
            secondsElement.textContent = seconds.toString().padStart(2, '0');
            console.log('Updated seconds:', seconds);
        } else {
            console.error('Element with ID "seconds" not found');
        }
        
        // Decrease eta_seconds by 1 for next update
        this.etaSeconds = Math.max(0, this.etaSeconds - 1);
        
        // Log for debugging
        console.log(`Countdown Update - Blocks: ${this.blocksRemaining}, ETA seconds: ${totalSeconds}, Time: ${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
    
    showError() {
        const blocksRemainingElement = document.getElementById('blocks-remaining');
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (blocksRemainingElement) blocksRemainingElement.textContent = 'Error loading';
        if (daysElement) daysElement.textContent = '--';
        if (hoursElement) hoursElement.textContent = '--';
        if (minutesElement) minutesElement.textContent = '--';
        if (secondsElement) secondsElement.textContent = '--';
        
        // Clear intervals if they exist
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.blockUpdateInterval) {
            clearInterval(this.blockUpdateInterval);
        }
    }
}

/* On page loaded */
$(window).on('load', function() {
    console.log('Window loaded, initializing page components...');
    
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
    
    // Initialize AOS only if it's available
    if (typeof AOS !== 'undefined') {
        AOS.init();
        console.log('AOS initialized');
    } else {
        console.warn('AOS library not loaded, skipping initialization');
    }
    
    // Initialize halving countdown
    console.log('Initializing HalvingCountdown...');
    new HalvingCountdown();
});
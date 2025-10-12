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
        this.countdownInterval = null;
        this.blockUpdateInterval = null;
        this.etaSeconds = 0;
        this.blocksRemaining = 0;
        
        this.init();
    }
    
    async init() {
        try {
            await this.fetchHalvingData();
            this.startCountdown();
        } catch (error) {
            console.error('Error initializing halving countdown:', error);
            this.showError();
        }
    }
    
    async fetchHalvingData() {
        try {
            // CONFIG is now hardcoded, no need to wait
            console.log('Using hardcoded CONFIG for API calls');
            
            // Fetch halving data from external API
            const response = await fetch(getApiUrl('HALVING'));
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched halving data from API:', data);
                
                // Use data directly from API - no calculations needed
                this.etaSeconds = parseFloat(data.eta_seconds);
                this.blocksRemaining = parseInt(data.blocks_remaining);
                
                return data;
            } else {
                throw new Error(`API responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching halving data from API:', error);
            throw new Error('Unable to fetch halving data from API');
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
        }
        
        // Calculate time components from eta_seconds
        const totalSeconds = Math.max(0, this.etaSeconds);
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        
        // Update countdown display
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = days;
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Decrease eta_seconds by 1 for next update
        this.etaSeconds = Math.max(0, this.etaSeconds - 1);
        
        // Log for debugging
        console.log(`Blocks remaining: ${this.blocksRemaining}, ETA seconds: ${totalSeconds}, Time: ${days}d ${hours}h ${minutes}m ${seconds}s`);
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
    AOS.init();
    
    // Initialize halving countdown
    new HalvingCountdown();
});
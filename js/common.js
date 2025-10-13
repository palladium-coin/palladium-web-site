// Common loader system for Palladium website
// Automatically loads navbar, footer, and manages page loader

class PalladiumLoader {
    constructor() {
        this.init();
    }

    init() {
        // Create and inject the mini-loader HTML immediately
        this.createMiniLoader();
        
        // Load components when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadComponents());
        } else {
            this.loadComponents();
        }
    }

    createMiniLoader() {
        // Create the mini-loader HTML structure
        const loaderHTML = `
            <div id="pageloader" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: opacity 0.5s ease-out;
            ">
                <div id="loader" style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(238, 90, 36, 0.3);
                    border-top: 4px solid #EE5A24;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                body.loading {
                    overflow: hidden;
                }
            </style>
        `;

        // Insert loader at the beginning of body
        if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', loaderHTML);
            document.body.classList.add('loading');
        } else {
            // If body is not ready, wait for it
            document.addEventListener('DOMContentLoaded', () => {
                document.body.insertAdjacentHTML('afterbegin', loaderHTML);
                document.body.classList.add('loading');
            });
        }
    }

    async loadComponents() {
        try {
            // Create containers if they don't exist
            this.createContainers();

            // Load navbar and footer in parallel
            const [navbarData, footerData] = await Promise.all([
                this.fetchComponent('navbar.html'),
                this.fetchComponent('footer.html')
            ]);

            // Inject components
            this.injectNavbar(navbarData);
            this.injectFooter(footerData);

            // Initialize navbar functionality
            this.initNavbarBurger();
            this.setActiveNavbarItem();

            // Hide loader after everything is loaded
            setTimeout(() => this.hideLoader(), 300);

        } catch (error) {
            console.error('Error loading components:', error);
            // Hide loader even if there's an error
            this.hideLoader();
        }
    }

    createContainers() {
        // Create navbar container if it doesn't exist
        if (!document.getElementById('navbar-container')) {
            const navbarContainer = document.createElement('div');
            navbarContainer.id = 'navbar-container';
            
            // Insert after the loader or at the beginning of body
            const loader = document.getElementById('pageloader');
            if (loader && loader.nextSibling) {
                document.body.insertBefore(navbarContainer, loader.nextSibling);
            } else {
                document.body.appendChild(navbarContainer);
            }
        }

        // Create footer container if it doesn't exist
        if (!document.getElementById('footer-container')) {
            const footerContainer = document.createElement('div');
            footerContainer.id = 'footer-container';
            document.body.appendChild(footerContainer);
        }
    }

    async fetchComponent(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        return await response.text();
    }

    injectNavbar(data) {
        const container = document.getElementById('navbar-container');
        if (container) {
            container.innerHTML = data;
        }
    }

    injectFooter(data) {
        const container = document.getElementById('footer-container');
        if (container) {
            container.innerHTML = data;
        }
    }

    initNavbarBurger() {
        // Get all "navbar-burger" elements
        const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        // Add a click event on each of them
        navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const targetElement = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                if (targetElement) {
                    targetElement.classList.toggle('is-active');
                }
            });
        });
    }

    setActiveNavbarItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navbarItems = document.querySelectorAll('.navbar-item');
        
        navbarItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    }

    hideLoader() {
        const loader = document.getElementById('pageloader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                document.body.classList.remove('loading');
            }, 500);
        }
    }
}

// Copy to clipboard function (manteniamo la funzionalità esistente)
function copy(text) {
    navigator.clipboard.writeText(text);
}

// Initialize the loader system
new PalladiumLoader();
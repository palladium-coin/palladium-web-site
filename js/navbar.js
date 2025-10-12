// Function to load navbar dynamically
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            
            // Initialize navbar burger functionality after loading
            initNavbarBurger();
            
            // Set active navbar item based on current page
            setActiveNavbarItem();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

// Function to initialize navbar burger menu
function initNavbarBurger() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
        });
    });
}

// Function to set active navbar item based on current page
function setActiveNavbarItem() {
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

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
});
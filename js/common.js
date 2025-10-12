/* Common JavaScript functionality shared across pages */

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
});
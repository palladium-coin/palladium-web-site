/* Get Started page specific JavaScript */

// Copy to clipboard function (specific to get started page)
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
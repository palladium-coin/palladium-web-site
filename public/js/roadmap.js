/* Roadmap page specific JavaScript */

// Initialize AOS animations
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Smooth scrolling for milestone cards
document.querySelectorAll('.milestone-card').forEach(card => {
    card.addEventListener('click', function() {
        this.scrollIntoView({ behavior: 'smooth' });
    });
});
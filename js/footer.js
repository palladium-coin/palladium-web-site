// Footer loader function
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// Load footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadFooter();
});
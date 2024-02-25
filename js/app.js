/**
 * Prevent #link from showing after clicking on an anchor link.
 */
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a');

    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
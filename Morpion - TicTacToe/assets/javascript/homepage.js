document.addEventListener('DOMContentLoaded', function() {

    let lastScroll = 0;
    let ticking = false;
    const NAVBAR = document.getElementById('navbarMove');

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const CURRENT_SCROLL = window.scrollY;
                if (CURRENT_SCROLL > lastScroll) {
                    NAVBAR.classList.add('nav-hidden');
                } else {
                    NAVBAR.classList.remove('nav-hidden');
                }
                lastScroll = CURRENT_SCROLL;
                ticking = false;
            });
            ticking = true;
        }
    }), { passive: true };
});
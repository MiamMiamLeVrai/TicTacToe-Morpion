document.addEventListener("DOMContentLoaded", function () {
    let lastScroll = 0;
    let ticking = false;
    
    const NAVBAR = document.getElementById("navbarMove");
    const START_BODY = document.getElementById("startbodyMove");
    const DOWNLOAD_ELEMENTS = document.getElementById("downloadEmntsMove");
    
    function handledScroll() {
        const CURRENT_SCROLL = window.scrollY;
        
        //Navigation navbarMove
        if (NAVBAR) {
            if (CURRENT_SCROLL > lastScroll) {
                NAVBAR.classList.add("nav-hidden");
            } else {
                NAVBAR.classList.remove("nav-hidden");
            }
        }
        
        //Start body button
        if (START_BODY) {
            if (CURRENT_SCROLL > START_BODY.offsetTop) {
                START_BODY.classList.add("start-body-hidden");
            } else {
                START_BODY.classList.remove("start-body-hidden");
            }
        }
        
        //Download elements button
        if (DOWNLOAD_ELEMENTS) {
            if (CURRENT_SCROLL > DOWNLOAD_ELEMENTS.offsetTop) {
                DOWNLOAD_ELEMENTS.classList.add("download-elements-hidden");
            } else {
                DOWNLOAD_ELEMENTS.classList.remove("download-elements-hidden");
            }
        }
        
        lastScroll = CURRENT_SCROLL;
        ticking = false;
    }
    
    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(handledScroll);
            ticking = true;
        }
    }, { passive: true });
});
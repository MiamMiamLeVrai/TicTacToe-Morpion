document.addEventListener("DOMContentLoaded", function () {
    let lastScroll = 0;
    let ticking = false;
    
    const NAVBAR = document.getElementById("navbarMove");
    const START_BODY = document.getElementById("startbodyMove");
    const dateFooter = document.getElementById("dateFooter");
    
    const NAVBAR_BUTTON = document.getElementById("menuButton");
    const navForMobile = NAVBAR ? NAVBAR.querySelector("ul") : null;
    
    function handledScroll() {
        const CURRENT_SCROLL = window.scrollY;
        if (NAVBAR) {
            if (CURRENT_SCROLL > lastScroll) {
                NAVBAR.classList.add("nav-hidden");
                if (NAVBAR_BUTTON && navForMobile) {
                    navForMobile.classList.remove("nav-open");
                    NAVBAR_BUTTON.setAttribute("aria-expanded", "false");
                    NAVBAR_BUTTON.textContent = "☰";
                }
            } else {
                NAVBAR.classList.remove("nav-hidden");
            }
        }
        if (START_BODY) {
            if (CURRENT_SCROLL > START_BODY.offsetTop) {
                START_BODY.classList.add("start-body-hidden");
            } else {
                START_BODY.classList.remove("start-body-hidden");
            }
        }
        
        lastScroll = CURRENT_SCROLL;
        ticking = false;
    }
    
    if (dateFooter) { 
        dateFooter.textContent = new Date().toLocaleDateString("fr-FR", { month: "numeric", year: "numeric" });
    }
    
    if (NAVBAR_BUTTON && navForMobile) { 
        NAVBAR_BUTTON.addEventListener("click", function () {
            const IS_OPEN = navForMobile.classList.toggle("nav-open");
            NAVBAR_BUTTON.setAttribute("aria-expanded", IS_OPEN);
            NAVBAR_BUTTON.textContent = IS_OPEN ? "✕" : "☰";
        });
        
        navForMobile.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navForMobile.classList.remove("nav-open");
                NAVBAR_BUTTON.setAttribute("aria-expanded", "false");
                NAVBAR_BUTTON.textContent = "☰";
            });
        });
    }
    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(handledScroll);
            ticking = true;
        }
    }, { passive: true });
});
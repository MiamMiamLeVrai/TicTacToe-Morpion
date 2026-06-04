document.addEventListener("DOMContentLoaded", function () {
    let lastScroll = 0;
    let ticking = false;

    const NAVBAR = document.getElementById("navbarMove");
    const START_BODY = document.getElementById("startbodyMove");
    const dateFooter = document.getElementById("dateFooter");
    const NAVBAR_BUTTON = document.getElementById("menuButton");
    const navForMobile = NAVBAR ? NAVBAR.querySelector("ul") : null;
    const THEME_COLOR_META = document.querySelector("meta[name='theme-color']");

    const NAVBAR_COLOR = "#FFEFD3";
    const BG_COLOR = "#001B2E";

    function handleScroll() {
        const CURRENT_SCROLL = window.scrollY;
        if (NAVBAR) {
            if (CURRENT_SCROLL > lastScroll) {
                NAVBAR.classList.add("nav-hidden");
                if (THEME_COLOR_META) THEME_COLOR_META.setAttribute("content", BG_COLOR);
                if (NAVBAR_BUTTON && navForMobile) {
                    navForMobile.classList.remove("nav-open");
                    NAVBAR_BUTTON.setAttribute("aria-expanded", "false");
                    NAVBAR_BUTTON.textContent = "☰";
                }
            } else {
                NAVBAR.classList.remove("nav-hidden");
                if (THEME_COLOR_META) THEME_COLOR_META.setAttribute("content", NAVBAR_COLOR);
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

    window.addEventListener("load", function () {
        if (dateFooter && dateFooter.textContent === "") {
            const documentLang = document.documentElement.lang || "en";
            const formatter = new Intl.DateTimeFormat(documentLang, {
                month: "long",
                year: "numeric"
            });
            dateFooter.textContent = formatter.format(new Date()).toLocaleUpperCase();
        }
    });

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
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });
});

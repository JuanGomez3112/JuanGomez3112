'use strict';

// Header compartido: se funde con el fondo al scroll, se oculta al bajar y
// reaparece al subir. Se carga en todas las páginas.
(function () {
    function initHeaderScroll() {
        const header = document.querySelector("header");
        if (!header) return;
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            header.classList.toggle("scrolled", y > 20);
            if (y > 120 && y > lastY) {
                header.classList.add("hidden");
            } else {
                header.classList.remove("hidden");
            }
            lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initHeaderScroll);
    } else {
        initHeaderScroll();
    }
})();

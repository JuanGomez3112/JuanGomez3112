'use strict';

// Visor del CV. El CV fisico es un triptico VERTICAL: se despliega hacia abajo
// y se lee como un scroll. Antes esto era un triptico horizontal con paneles
// que volteaban sobre el eje Y; nada de aquello aplica ya.
function iniciarSeccionCurriculum() {
    const visor = document.getElementById('cvVertical');
    if (!visor) return;

    const hojas = [...visor.querySelectorAll('.cv-hoja')];
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const contador = document.getElementById('cvActual');

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 3;
    const ZOOM_PASO = 0.5;
    let zoom = 1;

    // Posicion de una cara dentro del scroll, medida con rects: no depende de
    // quien sea el offsetParent.
    const topDe = (h) => (
        h.getBoundingClientRect().top - visor.getBoundingClientRect().top + visor.scrollTop
    );

    // Cara visible = aquella cuyo inicio queda mas cerca del borde del marco.
    const caraActual = () => {
        let idx = 0;
        let mejor = Infinity;
        hojas.forEach((h, i) => {
            const d = Math.abs(topDe(h) - visor.scrollTop);
            if (d < mejor) { mejor = d; idx = i; }
        });
        return idx;
    };

    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const irA = (i) => {
        const destino = Math.min(Math.max(i, 0), hojas.length - 1);
        const top = topDe(hojas[destino]);
        if (Math.abs(visor.scrollTop - top) < 2) return;

        const antes = visor.scrollTop;
        visor.scrollTo({ top, behavior: suave ? 'smooth' : 'auto' });
        pintarEstado(destino);

        // Algunos entornos ignoran el scroll suave y dejan el visor quieto.
        // Si a los 400 ms no se movio nada, se salta la animacion.
        if (suave) {
            setTimeout(() => {
                if (visor.scrollTop === antes) visor.scrollTop = top;
            }, 400);
        }
    };

    // Se puede forzar el indice: al navegar con boton o teclado ya sabemos el
    // destino y no hace falta esperar a que llegue un evento de scroll.
    const pintarEstado = (forzado) => {
        const i = (typeof forzado === 'number') ? forzado : caraActual();
        if (contador) contador.textContent = String(i + 1);
        if (prevBtn) prevBtn.disabled = i === 0;
        if (nextBtn) nextBtn.disabled = i === hojas.length - 1;
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    const aplicarZoom = (nuevo) => {
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        visor.style.setProperty('--cv-zoom', zoom);
        // Al volver a 1 la cara cabe entera: no queda desplazamiento que valga.
        if (zoom === ZOOM_MIN) {
            hojas.forEach((h) => { h.scrollLeft = 0; h.scrollTop = 0; });
        }
        pintarEstado();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => irA(caraActual() + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => irA(caraActual() - 1));
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => aplicarZoom(zoom + ZOOM_PASO));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => aplicarZoom(zoom - ZOOM_PASO));

    // Flechas del teclado cuando el visor tiene el foco.
    visor.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            irA(caraActual() + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            irA(caraActual() - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            irA(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            irA(hojas.length - 1);
        }
    });

    // La rueda hace scroll nativo; refrescamos el estado al terminar. La
    // navegacion por boton y teclado no depende de esto: pinta ella misma.
    let tick;
    visor.addEventListener('scroll', () => {
        clearTimeout(tick);
        tick = setTimeout(pintarEstado, 90);
    }, { passive: true });

    pintarEstado();
}

window.onload = function () {
    iniciarSeccionCurriculum();
};

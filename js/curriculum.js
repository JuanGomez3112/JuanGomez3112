'use strict';

// Visor del CV. El CV fisico es un triptico VERTICAL: la portada hace de tapa y
// los tres paneles interiores se despliegan hacia abajo, cada uno con bisagra en
// su borde superior. Antes esto era un triptico horizontal con paneles que
// volteaban sobre el eje Y; nada de aquello aplica.
function iniciarSeccionCurriculum() {
    const trifold = document.getElementById('cvTrifold');
    if (!trifold) return;

    const paneles = [...trifold.querySelectorAll('.cv-panel')];
    const interiores = paneles.slice(1);          // el panel 0 es la tapa, no se pliega
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const contador = document.getElementById('cvActual');

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 2;
    const ZOOM_PASO = 0.25;
    let zoom = 1;

    // Cuantos paneles interiores estan desplegados: 0 = solo la portada.
    let abiertos = 0;

    const pintar = () => {
        interiores.forEach((p, i) => p.classList.toggle('plegado', i >= abiertos));
        if (contador) contador.textContent = String(abiertos);
        if (prevBtn) prevBtn.disabled = abiertos === 0;
        if (nextBtn) nextBtn.disabled = abiertos === interiores.length;
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    const desplegar = (n) => {
        abiertos = Math.min(Math.max(n, 0), interiores.length);
        pintar();
        // Al desplegar, el panel recien abierto entra en cuadro.
        if (abiertos > 0) {
            const panel = interiores[abiertos - 1];
            setTimeout(() => {
                panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }, 320);
        }
    };

    const aplicarZoom = (nuevo) => {
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        trifold.style.setProperty('--cv-zoom', zoom);
        pintar();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => desplegar(abiertos + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => desplegar(abiertos - 1));
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => aplicarZoom(zoom + ZOOM_PASO));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => aplicarZoom(zoom - ZOOM_PASO));

    // Clic sobre la tapa: despliega el CV entero de una.
    paneles[0].addEventListener('click', () => {
        desplegar(abiertos === 0 ? interiores.length : 0);
    });

    trifold.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            desplegar(abiertos + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            desplegar(abiertos - 1);
        } else if (e.key === 'End') {
            e.preventDefault();
            desplegar(interiores.length);
        } else if (e.key === 'Home') {
            e.preventDefault();
            desplegar(0);
        }
    });

    pintar();
}

window.onload = function () {
    iniciarSeccionCurriculum();
};

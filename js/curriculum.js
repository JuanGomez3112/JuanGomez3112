'use strict';

// Visor del CV. Se comporta como una carta doblada en C para meterla en un
// sobre, y se abre igual que se abriria esa carta:
//
//   estado 0  doblada. La solapa de arriba esta abatida hacia abajo sobre el
//             panel del medio y ensena su dorso: la portada. Debajo de ella, la
//             solapa de abajo esta doblada hacia arriba, tambien sobre el medio.
//   estado 1  la solapa de arriba SUBE y se coloca encima; queda a la vista el
//             perfil. En el medio se ve ahora el dorso de la otra solapa: la
//             contraportada, que sigue tapando el panel central.
//   estado 2  la solapa de abajo BAJA a su sitio, ensena formacion y descubre
//             experiencia en el medio.
//
// Las dos solapas giran en sentidos OPUESTOS -- una sube, otra baja -- porque
// asi es el doblez en C. El panel del medio no se mueve nunca.
function iniciarSeccionCurriculum() {
    const carta = document.getElementById('cvCarta');
    if (!carta) return;

    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const etiqueta = document.getElementById('cvEstado');

    const ESTADOS = ['Doblada', 'Abriendo — perfil', 'Abierta — CV completo'];
    const ULTIMO = ESTADOS.length - 1;

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 2;
    const ZOOM_PASO = 0.25;
    let zoom = 1;
    let estado = 0;

    const pintar = () => {
        carta.dataset.estado = String(estado);
        if (etiqueta) etiqueta.textContent = ESTADOS[estado];
        if (prevBtn) prevBtn.disabled = estado === 0;
        if (nextBtn) nextBtn.disabled = estado === ULTIMO;
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    const irA = (n) => {
        estado = Math.min(Math.max(n, 0), ULTIMO);
        pintar();
    };

    const aplicarZoom = (nuevo) => {
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        carta.style.setProperty('--cv-zoom', zoom);
        pintar();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => irA(estado + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => irA(estado - 1));
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => aplicarZoom(zoom + ZOOM_PASO));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => aplicarZoom(zoom - ZOOM_PASO));

    // Clic en la carta: siguiente paso, y desde abierta vuelve a doblarla.
    carta.addEventListener('click', () => irA(estado < ULTIMO ? estado + 1 : 0));

    carta.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            irA(estado + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            irA(estado - 1);
        } else if (e.key === 'End') {
            e.preventDefault();
            irA(ULTIMO);
        } else if (e.key === 'Home') {
            e.preventDefault();
            irA(0);
        }
    });

    pintar();
}

window.onload = function () {
    iniciarSeccionCurriculum();
};

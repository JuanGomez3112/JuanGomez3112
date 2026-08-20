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
//   estado 3  se vuelve a doblar y se le da la vuelta al pliego: se ve el
//             reverso, que es el dorso del panel del medio (el QR).
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

    const ESTADOS = [
        'Doblada — portada',
        'Abriendo — perfil',
        'Abierta — CV completo',
        'Reverso — código QR'
    ];
    const ULTIMO = ESTADOS.length - 1;

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 2.5;
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

    let animando = false;

    const irA = (n) => {
        if (animando) return;
        const destino = Math.min(Math.max(n, 0), ULTIMO);
        if (destino === estado) return;

        // Un pliego no se dobla y se voltea a la vez: primero se cierra y
        // despues se le da la vuelta. Igual al volver del reverso.
        const REVERSO = 3;
        const entraOSaleDelReverso =
            (destino === REVERSO && estado !== 0) || (estado === REVERSO && destino !== 0);

        if (entraOSaleDelReverso) {
            animando = true;
            estado = 0;
            pintar();
            setTimeout(() => {
                estado = destino;
                pintar();
                animando = false;
            }, 620);
            return;
        }

        estado = destino;
        pintar();
    };

    const marco = carta.parentElement;

    const aplicarZoom = (nuevo) => {
        const antes = zoom;
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        carta.style.setProperty('--cv-zoom', zoom);
        // Ampliar y reducir manteniendo el centro de lo que se esta mirando.
        if (marco && antes !== zoom) {
            const centro = (marco.scrollLeft + marco.clientWidth / 2) / antes;
            marco.scrollLeft = centro * zoom - marco.clientWidth / 2;
        }
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

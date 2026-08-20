'use strict';

// Visor del CV. El CV fisico es un triptico VERTICAL plegado en C, y el visor
// reproduce como se abre de verdad:
//
//   estado 0  cerrado, solo se ve la portada.
//   estado 1  la portada sube sobre su borde superior y se voltea al perfil.
//             Debajo asoma la contraportada, que todavia tapa el panel del medio.
//   estado 2  esa se abre y quedan a la vista experiencia y formacion.
//
// Al ser plegado en C y no en Z, las dos solapas giran en el mismo sentido:
// ambas suben sobre su borde superior. Por eso las dos transiciones son el mismo
// gesto y no uno hacia arriba y otro hacia abajo.
//
// El visor horizontal anterior, con paneles que volteaban sobre el eje Y, no
// aplica en nada.
function iniciarSeccionCurriculum() {
    const trifold = document.getElementById('cvTrifold');
    if (!trifold) return;

    const paneles = [...trifold.querySelectorAll('.cv-panel')];
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const etiqueta = document.getElementById('cvEstado');

    const ESTADOS = ['Cerrado', 'Abriendo — perfil', 'Abierto — CV completo'];
    const ULTIMO = ESTADOS.length - 1;

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 2;
    const ZOOM_PASO = 0.25;
    let zoom = 1;

    let estado = 0;
    let animando = false;

    const pintar = () => {
        trifold.dataset.estado = String(estado);
        // El panel del medio aparece a partir del estado 1; el ultimo, en el 2.
        paneles[1].classList.toggle('plegado', estado < 1);
        paneles[2].classList.toggle('plegado', estado < 2);
        if (etiqueta) etiqueta.textContent = ESTADOS[estado];
        if (prevBtn) prevBtn.disabled = estado === 0;
        if (nextBtn) nextBtn.disabled = estado === ULTIMO;
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    // Cada paso voltea la solapa de arriba: sube sobre su borde superior y en
    // mitad del giro se cambia la imagen, para no ver la cara espejada. Al
    // avanzar voltea el panel que se abre; al retroceder, el que se cierra.
    const irA = (n) => {
        const destino = Math.min(Math.max(n, 0), ULTIMO);
        if (destino === estado || animando) return;

        const solapa = paneles[destino > estado ? estado : destino];

        animando = true;
        solapa.classList.add('volteando');
        trifold.classList.add('en-giro');   // enciende la sombra proyectada
        setTimeout(() => {
            estado = destino;
            pintar();
            solapa.classList.remove('volteando');
            animando = false;
            // La sombra se apaga un poco despues, cuando el papel ya asento.
            setTimeout(() => trifold.classList.remove('en-giro'), 220);
        }, 275);
    };

    const aplicarZoom = (nuevo) => {
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        trifold.style.setProperty('--cv-zoom', zoom);
        pintar();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => irA(estado + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => irA(estado - 1));
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => aplicarZoom(zoom + ZOOM_PASO));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => aplicarZoom(zoom - ZOOM_PASO));

    // Clic sobre el CV: abre del todo, o lo cierra si ya estaba abierto.
    trifold.addEventListener('click', () => irA(estado === 0 ? 1 : (estado < ULTIMO ? estado + 1 : 0)));

    trifold.addEventListener('keydown', (e) => {
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

'use strict';

// Visor del CV. El CV fisico es un triptico VERTICAL de 3 paneles por cara:
//   cara A (interior): perfil / experiencia+habilidades / formacion+referencias
//   cara B (exterior): portada / sobre mi / contraportada con QR
// Se despliega hacia abajo, cada panel con bisagra en su borde superior. El
// visor horizontal anterior, con paneles que volteaban sobre el eje Y, ya no
// aplica en nada.
function iniciarSeccionCurriculum() {
    const trifold = document.getElementById('cvTrifold');
    if (!trifold) return;

    const paneles = [...trifold.querySelectorAll('.cv-panel')];
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const flipBtn = document.querySelector('.flip-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const contador = document.getElementById('cvActual');
    const etiquetaCara = document.getElementById('cvCara');

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 2;
    const ZOOM_PASO = 0.25;
    let zoom = 1;

    // Paneles a la vista: 1 = plegado del todo, 3 = desplegado del todo.
    let visibles = 1;

    const pintar = () => {
        paneles.forEach((p, i) => p.classList.toggle('plegado', i >= visibles));
        if (contador) contador.textContent = String(visibles);
        if (etiquetaCara) {
            etiquetaCara.textContent = trifold.dataset.cara === 'a'
                ? 'cara interior'
                : 'cara exterior';
        }
        if (prevBtn) prevBtn.disabled = visibles === 1;
        if (nextBtn) nextBtn.disabled = visibles === paneles.length;
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    const desplegar = (n) => {
        visibles = Math.min(Math.max(n, 1), paneles.length);
        pintar();
        if (visibles > 1) {
            const panel = paneles[visibles - 1];
            setTimeout(() => {
                panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }, 320);
        }
    };

    const voltear = () => {
        trifold.dataset.cara = trifold.dataset.cara === 'a' ? 'b' : 'a';
        pintar();
    };

    const aplicarZoom = (nuevo) => {
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        trifold.style.setProperty('--cv-zoom', zoom);
        pintar();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => desplegar(visibles + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => desplegar(visibles - 1));
    if (flipBtn) flipBtn.addEventListener('click', voltear);
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => aplicarZoom(zoom + ZOOM_PASO));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => aplicarZoom(zoom - ZOOM_PASO));

    // Clic en el primer panel: despliega o pliega el CV entero.
    paneles[0].addEventListener('click', () => {
        desplegar(visibles === 1 ? paneles.length : 1);
    });

    trifold.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            desplegar(visibles + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            desplegar(visibles - 1);
        } else if (e.key === 'End') {
            e.preventDefault();
            desplegar(paneles.length);
        } else if (e.key === 'Home') {
            e.preventDefault();
            desplegar(1);
        } else if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
            voltear();
        }
    });

    pintar();
}

window.onload = function () {
    iniciarSeccionCurriculum();
};

'use strict';

// Visor del CV. Se comporta como una carta doblada en C para meterla en un
// sobre, y se abre igual que se abriria esa carta:
//
//   estado 0  doblada. La solapa de arriba esta abatida hacia abajo sobre el
//             panel del medio y ensena su dorso: la portada. Debajo de ella, la
//             solapa de abajo esta doblada hacia arriba, tambien sobre el medio.
//   estado 1  la solapa de arriba SUBE y se coloca encima; queda a la vista el
//             perfil. En el medio se ve ahora el dorso de la otra solapa:
//             sobre mi, que sigue tapando el panel central.
//   estado 2  la solapa de abajo BAJA a su sitio, ensena formacion y descubre
//             experiencia en el medio.
//   estado 3  el pliego doblado, visto por detras: el dorso del panel del
//             medio, o sea el QR.
//
// Cerrar recorre esos estados al reves, plegando las solapas de ABAJO hacia
// ARRIBA una a una, y al llegar a doblada da un paso mas y se voltea.
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

    // Secuencia lineal del pliego. Cerrar recorre las solapas de abajo hacia
    // arriba, una a una, y al terminar le da la vuelta:
    //
    //   abierta  --cerrar-->  se pliega la de ABAJO
    //            --cerrar-->  se pliega la de ARRIBA (queda la portada)
    //            --cerrar-->  se voltea y se ve el reverso con el QR
    //
    // Abrir hace el camino inverso. Por eso el reverso va al principio del
    // array: es el paso anterior a "doblada", no un estado suelto.
    const SECUENCIA = [3, 0, 1, 2];
    const ETIQUETAS = {
        3: 'Reverso — código QR',
        0: 'Doblada — portada',
        1: 'Abriendo — perfil',
        2: 'Abierta — CV completo'
    };

    let paso = 1;                       // arranca doblada, ensenando la portada
    const estadoActual = () => SECUENCIA[paso];

    const pintar = () => {
        const estado = estadoActual();
        carta.dataset.estado = String(estado);
        if (etiqueta) etiqueta.textContent = ETIQUETAS[estado];
        if (prevBtn) prevBtn.disabled = paso === 0;
        if (nextBtn) nextBtn.disabled = paso === SECUENCIA.length - 1;
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    const irA = (n) => {
        const destino = Math.min(Math.max(n, 0), SECUENCIA.length - 1);
        if (destino === paso) return;
        paso = destino;
        pintar();
        marcarGiro();
    };

    // Enciende el sombreado del papel mientras dura el giro.
    let temporizadorGiro;
    const marcarGiro = () => {
        clearTimeout(temporizadorGiro);
        carta.classList.remove('girando');
        // Reinicia la animacion aunque se encadenen dos pasos seguidos.
        void carta.offsetWidth;
        carta.classList.add('girando');
        temporizadorGiro = setTimeout(() => carta.classList.remove('girando'), 640);
    };

    const aplicarZoom = (nuevo) => {
        const antes = zoom;
        zoom = Math.min(Math.max(nuevo, ZOOM_MIN), ZOOM_MAX);
        (document.getElementById('cvEscena') || carta).style.setProperty('--cv-zoom', zoom);
        // Ampliar y reducir manteniendo el centro de lo que se esta mirando.
        if (marco && antes !== zoom) {
            const centro = (marco.scrollLeft + marco.clientWidth / 2) / antes;
            marco.scrollLeft = centro * zoom - marco.clientWidth / 2;
        }
        pintar();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => irA(paso + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => irA(paso - 1));
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => aplicarZoom(zoom + ZOOM_PASO));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => aplicarZoom(zoom - ZOOM_PASO));

    // Clic en la carta: siguiente paso, y desde abierta vuelve al principio.
    carta.addEventListener('click', () => {
        irA(paso < SECUENCIA.length - 1 ? paso + 1 : 0);
    });

    carta.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            irA(paso + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            irA(paso - 1);
        } else if (e.key === 'End') {
            e.preventDefault();
            irA(SECUENCIA.length - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            irA(0);
        }
    });

    iniciarInclinacion(carta);
    pintar();
}

// Inclinacion con el raton: la escena gira siguiendo al puntero y un brillo se
// desplaza por encima. Es lo que da la sensacion de papel en 3D y no de imagen
// plana. Se apaga en pantallas tactiles y con movimiento reducido.
function iniciarInclinacion(carta) {
    const escena = document.getElementById('cvEscena');
    const marco = escena && escena.parentElement;
    if (!escena || !marco) return;

    const finoDePuntero = window.matchMedia('(pointer: fine)').matches;
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finoDePuntero || menosMovimiento) return;

    const GIRO_MAX = 9;      // grados
    let pendiente = false;
    let ultimo = null;

    const aplicar = () => {
        pendiente = false;
        if (!ultimo) return;
        const caja = marco.getBoundingClientRect();
        // -1..1 desde el centro del marco
        const px = (ultimo.clientX - caja.left) / caja.width * 2 - 1;
        const py = (ultimo.clientY - caja.top) / caja.height * 2 - 1;
        const x = Math.max(-1, Math.min(1, px));
        const y = Math.max(-1, Math.min(1, py));

        // El eje vertical del raton inclina en X, y al reves: se sigue el puntero.
        escena.style.setProperty('--giro-y', (x * GIRO_MAX).toFixed(2) + 'deg');
        escena.style.setProperty('--giro-x', (-y * GIRO_MAX).toFixed(2) + 'deg');
    };

    marco.addEventListener('pointermove', (e) => {
        ultimo = e;
        escena.classList.remove('quieta');
        if (!pendiente) {
            pendiente = true;
            requestAnimationFrame(aplicar);
        }
    });

    const reposar = () => {
        escena.classList.add('quieta');
        escena.style.setProperty('--giro-x', '0deg');
        escena.style.setProperty('--giro-y', '0deg');
    };

    marco.addEventListener('pointerleave', reposar);
    // Al plegar o desplegar, la carta vuelve a su reposo para no sumar giros.
    carta.addEventListener('click', reposar);
}

window.onload = function () {
    iniciarSeccionCurriculum();
};

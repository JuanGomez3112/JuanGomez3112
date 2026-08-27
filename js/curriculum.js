'use strict';

// Visor del CV. Se comporta como una carta doblada en C para meterla en un
// sobre, y se abre igual que se abriria esa carta:
//
// Son DOS dobleces encadenados sobre el mismo pliego:
//
//   ABRIR   el panel del medio no se mueve. La parte 1 esta abatida sobre el y
//           la 3 doblada sobre el; se van levantando hasta dejarlo abierto.
//   CERRAR  si se sigue bajando, el pliego se recoge del otro modo: sube la 3
//           sobre la 2, y despues el grupo 2+3 entero sobre la 1. Ahi la cara
//           que queda mirando afuera es el QR, y un paso mas lo voltea.
//
// Por eso la parte 1 es HERMANA del grupo 2+3 en el marcado y no su padre: con
// la 1 de raiz no se puede abatir sobre la 2 sin arrastrarla.

function iniciarSeccionCurriculum() {
    const carta = document.getElementById('cvCarta');
    if (!carta) return;

    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const etiqueta = document.getElementById('cvEstado');

    // Un solo recorrido de ida y vuelta con el boton de bajar:
    //
    //   0  cerrada          se ve la portada
    //   1  abriendo         sube la tapa: perfil arriba, sobre mi en el medio
    //   2  abierta          las tres partes a la vista
    //   3  recogiendo       vuelve a subir la 3 sobre la 2
    //   4  cerrada del otro modo   sube el grupo 2+3 sobre la 1: se ve el QR
    //                       y con el la tarjeta metida en su hueco
    //   5  la tarjeta sale del troquel
    //   6  la tarjeta se voltea y ensena su dorso
    //   7  volteada         se le da la vuelta al pliego: se ve la portada
    //
    // Los estados 1 y 3 se ven igual: uno abriendo y otro recogiendo. Por eso
    // la secuencia es una lista de estados y no un contador, y el mismo estado
    // puede aparecer dos veces con distinto sentido.
    const SECUENCIA = [0, 1, 2, 3, 4, 5, 6, 7];
    const ETIQUETAS = {
        0: 'Doblada — portada',
        1: 'Abriendo — perfil',
        2: 'Abierta — CV completo',
        3: 'Plegando — sube la parte 3',
        4: 'Plegada — la tarjeta en su hueco',
        5: 'La tarjeta sale',
        6: 'La tarjeta por detrás',
        7: 'Del revés — portada'
    };

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 3;
    const ZOOM_PASO = 0.25;
    let zoom = 1;

    // El marco es el que hace scroll cuando se amplia. Estaba declarado dentro
    // de iniciarInclinacion, asi que aplicarZoom lanzaba ReferenceError en cada
    // clic y el zoom no llegaba a pintar el estado de los botones.
    const marco = carta.closest('.cv-marco');

    let paso = 0;
    const estadoActual = () => SECUENCIA[paso];

    const pintar = () => {
        const estado = estadoActual();
        carta.dataset.estado = String(estado);
        if (etiqueta) etiqueta.textContent = ETIQUETAS[estado];
        // El recorrido es un bucle: del ultimo paso se vuelve al primero, asi
        // que ninguna de las dos flechas se agota nunca.
        if (zoomOutBtn) zoomOutBtn.disabled = zoom <= ZOOM_MIN;
        if (zoomInBtn) zoomInBtn.disabled = zoom >= ZOOM_MAX;
    };

    // Da la vuelta por los dos lados: -1 lleva al ultimo, y uno mas alla del
    // ultimo vuelve al primero.
    const irA = (n) => {
        const total = SECUENCIA.length;
        const destino = ((n % total) + total) % total;
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

    // Clic en la carta: avanza un paso, dando la vuelta al llegar al final.
    carta.addEventListener('click', () => irA(paso + 1));

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

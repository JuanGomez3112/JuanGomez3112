'use strict';

function iniciarSlide() {
    const wrapper = document.querySelector(".wrapper");
    if (!wrapper) {
        console.error("No se encontró ningún elemento con la clase '.wrapper'");
        return;
    }

    // Carrusel infinito por banda transportadora: sin duplicar iconos.
    // Corre siempre al mismo lado; cuando un icono sale por la izquierda se
    // recicla al final, sin salto visual.
    const speed = 0.8; // px por frame
    let offset = 0;
    let paused = false;

    wrapper.addEventListener("mouseenter", () => (paused = true));
    wrapper.addEventListener("mouseleave", () => (paused = false));

    const anchoDe = (el) => {
        const cs = getComputedStyle(el);
        return el.getBoundingClientRect().width +
            parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    };

    const step = () => {
        if (!paused) {
            offset -= speed;
            const first = wrapper.firstElementChild;
            if (first && -offset >= anchoDe(first)) {
                offset += anchoDe(first);
                wrapper.appendChild(first); // recicla al final
            }
            wrapper.style.transform = `translateX(${offset}px)`;
        }
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// proyectosRecientes.js

function cargarProyectos() {
    fetch('src/data/proyectos.json?_=' + Date.now())
        .then(response => response.json())
        .then(data => {
            // Obtener la referencia al contenedor de proyectos recientes
            var contenedorProyectos = document.querySelector('#proyectos-recientes');

            // Limpiar el contenedor antes de agregar nuevos proyectos
            contenedorProyectos.innerHTML = '';

            // Iterar sobre los proyectos y agregarlos al HTML
            data.slice(0, 2).forEach(proyecto => {
                var cardProyecto = document.createElement('article');
                cardProyecto.classList.add('card-proyect');

                // Contenido del proyecto
                var contenidoProyecto = `
                    <div class="imagen-card">
                        <img src="${proyecto.imagen}" alt="${proyecto.nombre}" loading="lazy">
                    </div>
                    <div class="card-info">
                        <div class="info-proyect">
                            <h4>${proyecto.nombre}</h4>
                            <div class="valoracion">
                                ${'<i class="fa-solid fa-star"></i>'.repeat(proyecto.valoracion)}
                            </div>
                            <p>${proyecto.tecnologias}</p>
                            <div class="tags">
                                ${proyecto.tags.map(tag => `<div class="btn btn-pq btn-tags">${tag}</div>`).join('')}
                            </div>
                        </div>
                        <div class="botones">
                            ${proyecto.repositorio && proyecto.repositorio !== '#' ? `
                            <a href="${proyecto.repositorio}" class="btn btn-bd" target="_blank">
                                <i class="fa-brands fa-github"></i>
                                Repositorio
                            </a>` : ''}
                            <a href="proyecto.html?id=${proyecto.slug}" class="btn btn-pq btn-bd">
                                <i class="fa-solid fa-eye"></i>
                                Ver Proyecto
                            </a>
                        </div>
                    </div>
                `;

                cardProyecto.innerHTML = contenidoProyecto;
                contenedorProyectos.appendChild(cardProyecto);
            });

            // Agregar la tercera caja diferente
            var cardMasProyectos = document.createElement('article');
            cardMasProyectos.classList.add('card-proyect', 'card-more');
            cardMasProyectos.innerHTML = `
                <a href="portafolio.html">
                    <i class="fa-solid fa-plus"></i>
                    Ver más proyectos
                </a>
            `;
            contenedorProyectos.appendChild(cardMasProyectos);
        })
        .catch(error => {
            console.error(error.message);
        });
}

function iniciarContacto() {
    const form = document.getElementById('contacto-form');
    if (!form) return;
    const estado = document.getElementById('form-estado');
    const boton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const action = form.getAttribute('action') || '';

        // Fallback: si Formspree aun no esta configurado, abre el correo
        if (!action || action.includes('TU_ID')) {
            const cuerpo = `Nombre: ${form.nombre.value}%0D%0ACorreo: ${form.correo.value}%0D%0A%0D%0A${form.mensaje.value}`;
            window.location.href = `mailto:GomezRodriguez3112@gmail.com?subject=Contacto desde la web&body=${cuerpo}`;
            return;
        }

        const original = boton.innerHTML;
        boton.disabled = true;
        boton.innerHTML = 'Enviando…';
        if (estado) { estado.textContent = ''; estado.className = 'form-estado'; }

        try {
            const resp = await fetch(action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (!resp.ok) throw new Error('fallo');
            form.reset();
            if (estado) { estado.textContent = '¡Mensaje enviado! Te responderé pronto.'; estado.classList.add('ok'); }
        } catch (err) {
            if (estado) { estado.textContent = 'No se pudo enviar. Escríbeme a GomezRodriguez3112@gmail.com'; estado.classList.add('error'); }
        } finally {
            boton.disabled = false;
            boton.innerHTML = original;
        }
    });
}

function iniciarRoles() {
    const el = document.querySelector(".hero-roles .typed");
    if (!el) return;

    const palabras = ["Técnico de Soporte", "Redes & TI", "Videovigilancia CCTV", "Desarrollador Web"];
    const velEscribe = 95;   // ms por letra al escribir
    const velBorra = 45;     // ms por letra al borrar
    const pausaLlena = 1700; // ms con la palabra completa
    const pausaVacia = 400;  // ms antes de la siguiente palabra

    let iPalabra = 0;
    let nChars = 0;
    let borrando = false;

    function tick() {
        const palabra = palabras[iPalabra];

        if (!borrando) {
            nChars++;
            el.textContent = palabra.slice(0, nChars);
            if (nChars === palabra.length) {
                borrando = true;
                return setTimeout(tick, pausaLlena);
            }
            return setTimeout(tick, velEscribe);
        } else {
            nChars--;
            el.textContent = palabra.slice(0, nChars);
            if (nChars === 0) {
                borrando = false;
                iPalabra = (iPalabra + 1) % palabras.length;
                return setTimeout(tick, pausaVacia);
            }
            return setTimeout(tick, velBorra);
        }
    }

    tick();
}

function iniciarReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('is-visible'));
        return;
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    els.forEach(e => obs.observe(e));
}

// El CV de la home es el mismo pliego de la pagina del curriculum, pero aqui
// se ve SIEMPRE abierto y no lo mueven botones: lo mueve el scroll. Al entrar
// en la seccion sale de su columna, se endereza y crece hacia el centro; al
// salir vuelve a inclinarse y a su sitio. El plegado se queda para la pagina
// del CV, que es donde tiene sentido manejarlo.
//
// El paralaje sale del propio 3D: las tres partes estan separadas en Z, asi
// que al inclinarse la escena cada una se desplaza a distinto ritmo.
function iniciarCvZoom() {
    const track = document.querySelector('.cta-curriculum');
    const frame = track && track.querySelector('.cv-frame');
    const escena = frame && frame.querySelector('.cv-escena');
    if (!frame || !escena) return;

    const FILL = 0.62;      // cuanto del ancho de pantalla llena al estar grande

    // Tramos del recorrido, en fraccion de la seccion.
    const SALE_INI = 0.06;  // hasta aqui descansa en su columna
    const SALE_FIN = 0.26;  // ya esta en el centro y a tamano grande
    const DE_FRENTE = 0.52; // aqui esta enderezado del todo
    const VUELVE = 0.82;    // empieza a volver
    const FIN = 0.96;       // en su columna otra vez

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const suave = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const entre = (v, a, b) => clamp01((v - a) / (b - a));
    const esDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let pendiente = false;
    let centroReposo = 0;   // centro horizontal del pliego quieto, cacheado

    // Se mide sin transform, para no leer un rect a medio animar.
    const medir = () => {
        const previo = frame.style.transform;
        frame.style.transform = 'none';
        const caja = frame.getBoundingClientRect();
        centroReposo = caja.left + caja.width / 2;
        frame.style.transform = previo;
    };

    const pintar = () => {
        pendiente = false;
        const vw = window.innerWidth;
        const anchoBase = frame.offsetWidth;
        if (!anchoBase) return;

        const caja = track.getBoundingClientRect();
        const recorrido = track.offsetHeight - window.innerHeight;
        const p = clamp01(recorrido > 0 ? (-caja.top) / recorrido : 0);

        if (!esDesktop() || menosMovimiento) {
            frame.style.transform = '';
            escena.style.removeProperty('--giro-x');
            escena.style.removeProperty('--giro-y');
            return;
        }

        // Camara: sale de su columna, crece y se centra; al final deshace.
        const grande = Math.max(1, (FILL * vw) / anchoBase);
        let escala = 1;
        if (p >= SALE_INI && p < SALE_FIN) {
            escala = 1 + (grande - 1) * suave(entre(p, SALE_INI, SALE_FIN));
        } else if (p >= SALE_FIN && p < VUELVE) {
            escala = grande;
        } else if (p >= VUELVE && p < FIN) {
            escala = grande - (grande - 1) * suave(entre(p, VUELVE, FIN));
        }
        const haciaCentro = (escala - 1) / (grande - 1 || 1);
        const tx = (vw / 2 - centroReposo) * haciaCentro;
        frame.style.transform = `translateX(${tx.toFixed(1)}px) scale(${escala.toFixed(3)})`;

        // Paralaje: llega escorzado, se endereza al llegar al centro y al
        // marcharse se inclina hacia el otro lado.
        const enderezando = entre(p, SALE_INI, DE_FRENTE);
        const yendose = entre(p, VUELVE, FIN);
        const giroX = 16 * (1 - suave(enderezando)) + 12 * suave(yendose);
        const giroY = 11 * (1 - suave(enderezando)) - 8 * suave(yendose);
        escena.style.setProperty('--giro-x', giroX.toFixed(2) + 'deg');
        escena.style.setProperty('--giro-y', giroY.toFixed(2) + 'deg');
    };

    const alScroll = () => {
        if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
    };
    const alRedimensionar = () => { medir(); alScroll(); };

    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alRedimensionar, { passive: true });
    medir();
    pintar();
}

window.onload = function () {
    iniciarSlide();
    cargarProyectos();
    iniciarContacto();
    iniciarRoles();
    iniciarReveal();
    iniciarCvZoom();
};

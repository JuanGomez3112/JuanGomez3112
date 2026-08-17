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

// dropdown.js

function iniciarDropdown() {
    const boton = document.querySelector(".candy-box");
    boton.querySelector(".candy-item");
    const contOlas = document.querySelector(".contenedor-olas");
    const menuCont = document.querySelector(".menu-container");
    const header = document.querySelector("header");

    let timerId;

    const dropDown = () => {
        clearTimeout(timerId);
        contOlas.classList.add("active");
        menuCont.style.display = "flex";

        timerId = setTimeout(() => {
            menuCont.style.opacity = "1";
        }, 300);
    };

    const dropUp = () => {
        clearTimeout(timerId);
        menuCont.style.opacity = "0";

        timerId = setTimeout(() => {
            menuCont.style.display = "none";
            setTimeout(() => {
                contOlas.classList.remove("active");
            }, 100);
        }, 600);
    };

    boton.addEventListener("click", () => {
        if (contOlas.classList.contains("active")) {
            dropUp();
        } else {
            dropDown();
        }
    });

    // Agregar evento de escucha para cerrar el menú cuando se hace clic fuera del encabezado
    document.addEventListener("click", (event) => {
        const targetElement = event.target; // Elemento en el que se hizo clic

        // Verificar si el clic no ocurrió dentro del encabezado o el menú desplegable
        if (!header.contains(targetElement) && !menuCont.contains(targetElement)) {
            dropUp(); // Cerrar el menú
        }
    });
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

// Efecto "cámara": el CV descansa en su columna (al lado). Al activarse el
// efecto SALE de su posición, pasa al centro para verse completo (pan hoja x
// hoja) y al terminar VUELVE a su lugar. Todo con transición suave.
function iniciarCvZoom() {
    const track = document.querySelector('.cta-curriculum');
    const frame = track && track.querySelector('.cv-frame');
    const img = frame && frame.querySelector('img');
    const backdrop = track && track.querySelector('.cv-backdrop');
    if (!img) return;

    const FILL = 0.72;    // zoom (llena 72% del ancho, sin recorte)
    const HOJAS = 3;      // PERFIL / EXPERIENCIA / FORMACION
    const REST_IN = 0.07; // reposo inicial: el CV se queda en su lugar
    const IN_END = 0.28;  // fin del "sale al centro"
    const OUT_START = 0.78; // inicio del "vuelve"
    const REST_OUT = 0.95;  // reposo final

    const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const esDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

    // Pan con paradas: recorre las hojas 1 a 1. Devuelve 0..1 exacto (0=arriba,
    // 1=abajo). Hay HOJAS paradas => HOJAS-1 viajes entre ellas.
    const panEscalonado = (f) => {
        const cells = HOJAS - 1;            // viajes entre hojas
        const cellW = 1 / cells;
        const idx = Math.min(cells - 1, Math.floor(f / cellW));
        const local = (f - idx * cellW) / cellW; // 0..1 dentro del viaje
        const dwell = 0.22;                 // pausa corta en la hoja antes de viajar
        const viaje = local < dwell ? 0 : easeInOut((local - dwell) / (1 - dwell));
        return (idx + viaje) / cells;       // 0..1
    };

    let ticking = false;
    let restCenterX = 0; // centro horizontal del CV en reposo (viewport), cacheado

    // Mide el centro en reposo sin transform (evita el temblor de leer el rect animado)
    const medir = () => {
        const prev = frame.style.transform;
        frame.style.transform = 'none';
        const rect = frame.getBoundingClientRect();
        restCenterX = rect.left + rect.width / 2;
        frame.style.transform = prev;
    };

    const update = () => {
        ticking = false;
        const vh = window.innerHeight, vw = window.innerWidth;
        const W0 = img.offsetWidth, H0 = img.offsetHeight;
        const GRANDE = W0 > 0 ? Math.max(1, (FILL * vw) / W0) : 1;

        let scale = 1, ty = 0, tx = 0;

        if (esDesktop()) {
            // Modo pista: la fila está fija (sticky) y el scroll dentro de la
            // sección de 300vh controla salir -> centro -> pan -> volver.
            const r = track.getBoundingClientRect();
            const total = track.offsetHeight - vh;
            const prog = clamp01(total > 0 ? (-r.top) / total : 0);
            // sobrante vertical cuando está a tamaño completo (para el pan)
            const O = Math.max(0, H0 * GRANDE - vh);

            if (prog < REST_IN) {
                scale = 1; ty = 0;                       // en su lugar (columna)
            } else if (prog < IN_END) {
                const t = easeInOut((prog - REST_IN) / (IN_END - REST_IN));
                scale = 1 + (GRANDE - 1) * t;            // sale y crece
                ty = (O / 2) * t;                        // de centrado (0) a borde arriba, sincronizado
            } else if (prog < OUT_START) {
                scale = GRANDE;                          // pan hoja por hoja
                const f = (prog - IN_END) / (OUT_START - IN_END);
                ty = (O / 2) - panEscalonado(f) * O;     // arriba (O/2) -> abajo (-O/2)
            } else if (prog < REST_OUT) {
                const t = easeInOut((prog - OUT_START) / (REST_OUT - OUT_START));
                scale = GRANDE - (GRANDE - 1) * t;       // vuelve
                ty = -(O / 2) * (1 - t);                 // de abajo (-O/2) a centrado (0), sincronizado
            } else {
                scale = 1; ty = 0;                       // reposo final
            }

        } else {
            // Móvil: proximidad. Al centrarse la sección, crece para verse grande.
            const r = track.getBoundingClientRect();
            const elCenter = r.top + r.height / 2;
            const d = Math.abs(elCenter - vh / 2) / (vh / 2 + r.height / 2);
            const c = clamp01(1 - d);                    // 1 = centrado
            scale = 1 + (GRANDE - 1) * easeInOut(c);
            ty = 0;
        }

        // pop: 0 en reposo -> 1 a tamaño completo. Maneja tx (desktop) y el fondo.
        const pop = GRANDE > 1 ? clamp01((scale - 1) / (GRANDE - 1)) : 0;
        if (esDesktop()) tx = (vw / 2 - restCenterX) * pop; // de la columna al centro
        if (backdrop) backdrop.style.opacity = pop.toFixed(3);

        frame.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(3)})`;
    };

    const onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    const onResize = () => { medir(); onScroll(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // mide tras cargar imagen/layout
    if (img.complete) medir(); else img.addEventListener('load', () => { medir(); update(); });
    medir();
    update();
}

window.onload = function () {
    iniciarSlide();
    // iniciarDropdown(); // ahora en menu.js (accesible)
    cargarProyectos();
    iniciarContacto();
    iniciarRoles();
    iniciarReveal();
    iniciarCvZoom();
};

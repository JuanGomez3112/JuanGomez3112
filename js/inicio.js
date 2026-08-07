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
                        <img src="${proyecto.imagen}" alt="${proyecto.nombre}">
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
                            <a href="${proyecto.repositorio}" class="btn btn-bd" target="_blank">
                                <i class="fa-brands fa-github"></i>
                                Repositorio
                            </a>
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
            window.location.href = `mailto:gomezrodriguez3112@gmail.com?subject=Contacto desde la web&body=${cuerpo}`;
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
            if (estado) { estado.textContent = 'No se pudo enviar. Escríbeme a gomezrodriguez3112@gmail.com'; estado.classList.add('error'); }
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

function iniciarCvZoom() {
    const cont = document.querySelector('.cta-curriculum_img');
    const img = cont && cont.querySelector('.cv-zoom');
    if (!img) return;

    const minS = 0.78;
    const maxS = 1.6;
    let ticking = false;

    const update = () => {
        ticking = false;
        const r = cont.getBoundingClientRect(); // contenedor no escala -> estable
        const vh = window.innerHeight;
        const elCenter = r.top + r.height / 2;
        const dist = Math.abs(elCenter - vh / 2);
        const maxDist = vh / 2 + r.height / 2;
        let prog = 1 - dist / maxDist; // 1 = centrado, 0 = en los bordes
        prog = Math.max(0, Math.min(1, prog));
        const scale = minS + (maxS - minS) * prog;
        img.style.transform = `scale(${scale.toFixed(3)})`;
    };

    const onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
}

window.onload = function () {
    iniciarSlide();
    iniciarDropdown();
    cargarProyectos();
    iniciarContacto();
    iniciarRoles();
    iniciarReveal();
    iniciarCvZoom();
};

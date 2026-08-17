'use strict';

function iniciarSlide() {
    const wrapper = document.querySelector(".wrapper");
    if (!wrapper) {
        console.error("No se encontró ningún elemento con la clase '.wrapper'");
        return;
    }

    // Carrusel infinito por banda transportadora (translateX + reciclado):
    // el elemento que sale por la izquierda se manda al final, sin salto.
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

// cargarCertificados.js

function cargarCertificados(callback) {
    fetch('src/data/formacion.json?_=' + Date.now())
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => console.error('Error al cargar los certificados:', error));
}

function cargarYManejarCertificados() {
    cargarCertificados(data => {
        manejarTabs(data);
    });
}

function manejarTabs(data) {
    const tabButtons = document.getElementById('tab-buttons-certific');
    const tabContent = document.querySelector('#tab-content-certific');

    if (!tabContent) {
        console.error("El elemento con el ID 'tab-content-certific' no se encontró en el DOM.");
        return;
    }

    tabButtons.innerHTML = "";

    const categorias = obtenerCategoriasUnicas(data);

    categorias.forEach(categoria => {
        const button = crearBotonCategoria(categoria);
        tabButtons.appendChild(button);
    });

    const todosLosCertificadosContainer = document.createElement("div");
    todosLosCertificadosContainer.classList.add("certificado-card");
    todosLosCertificadosContainer.id = "todos-los-certificados";
    tabContent.appendChild(todosLosCertificadosContainer);

    showTabContent("Todos", todosLosCertificadosContainer);

    function showTabContent(categoria, container) {
        container.innerHTML = "";
        data.forEach(certificado => {
            if (categoria === "Todos" || certificado.categorias.includes(categoria)) {
                const cardCertific = crearCardCertificado(certificado);
                container.appendChild(cardCertific);
            }
        });
    }

    function obtenerCategoriasUnicas(data) {
        const categoriasSet = new Set();
        data.forEach(certificado => {
            if (Array.isArray(certificado.categorias)) {
                certificado.categorias.forEach(categoria => {
                    categoriasSet.add(categoria);
                });
            } else if (typeof certificado.categorias === 'string') {
                categoriasSet.add(certificado.categorias);
            }
        });
        return ['Todos', ...categoriasSet];
    }

    function crearBotonCategoria(categoria) {
        const button = document.createElement("button");
        button.innerHTML = categoria === "Todos" ? '<i class="fa-solid fa-list-ul"></i> Todos' : categoria.charAt(0).toUpperCase() + categoria.slice(1);
        button.classList.add("tablinks");
        button.dataset.category = categoria;
        button.addEventListener("click", function () {
            document.querySelectorAll(".tablinks").forEach(tabButton => {
                tabButton.classList.remove("active");
            });
            button.classList.add("active");
            showTabContent(categoria, todosLosCertificadosContainer);
        });
        // Agregar la clase 'active' al botón "Todos" por defecto
        if (categoria === "Todos") {
            button.classList.add("active");
        }
        return button;
    }

    function crearCardCertificado(certificado) {
        const cardCertific = document.createElement("div");
        cardCertific.classList.add("card-certific");
        // "Ir al Curso" solo si hay link real (los placeholders enlace-cursoN.html dan 404)
        const cursoValido = certificado.cursoLink &&
            !/^enlace-curso/i.test(certificado.cursoLink) &&
            certificado.cursoLink !== '#';
        const btnCurso = cursoValido ? `
                        <a href="${certificado.cursoLink}" class="btn btn-pq btn-bd bd-gradient" target="_blank" rel="noopener">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            Ir al Curso
                        </a>` : '';
        const contenidoCertificado = `
            <img src="${certificado.imagen}" alt="${certificado.nombre}" loading="lazy">
            <span class="tipo-certificado">${certificado.tipo}</span>
            <div class="info-certificado">
                <h3>${certificado.nombre}</h3>
                <div class="info-hidden">
                    <span>${certificado.proveedor}</span>
                    <div class="botones">
                        <a href="${certificado.certificadoLink}" class="btn btn-pq btn-bd bd-gradient" download>
                            <i class="fa-solid fa-certificate"></i>
                            Certificado
                        </a>${btnCurso}
                    </div>
                </div>
            </div>
        `;
        cardCertific.innerHTML = contenidoCertificado;
        return cardCertific;
    }
}

window.onload = function () {
    iniciarSlide();
    cargarYManejarCertificados();
};

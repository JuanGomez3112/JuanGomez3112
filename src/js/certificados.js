import { cargarCertificados } from './cargarCertificados.js';

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
        const contenidoCertificado = `
            <img src="${certificado.imagen}" alt="${certificado.nombre}">
            <span class="tipo-certificado">${certificado.tipo}</span>
            <div class="info-certificado">
                <h3>${certificado.nombre}</h3>
                <div class="info-hidden">
                    <span>${certificado.proveedor}</span>
                    <div class="botones">
                        <a href="${certificado.certificadoLink}" class="btn btn-pq btn-bd" target="_blank">
                            <i class="fa-solid fa-certificate"></i>
                            Certificado
                        </a>
                        <a href="${certificado.cursoLink}" class="btn btn-pq btn-bd" target="_blank">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            Ir al Curso
                        </a>
                    </div>
                </div>
            </div>
        `;
        cardCertific.innerHTML = contenidoCertificado;
        return cardCertific;
    }
}

export { cargarYManejarCertificados };

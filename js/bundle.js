'use strict';

function iniciarSlide() {
    const wrapper = document.querySelector(".wrapper");

    if (wrapper) {
        let intervalo = null;
        let step = 1;
        let maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

        const start = () => {
            intervalo = setInterval(() => {
                wrapper.scrollLeft = wrapper.scrollLeft + step;

                if (wrapper.scrollLeft === maxScrollLeft) {
                    step = step * -1;
                } else if (wrapper.scrollLeft === 0) {
                    step = step * -1;
                }
            }, 10);
        };

        const stop = () => {
            clearInterval(intervalo);
        };

        wrapper.addEventListener("mouseover", () => {
            stop();
        });

        wrapper.addEventListener("mouseout", () => {
            start();
        });

        start();
    } else {
        console.error("No se encontró ningún elemento con la clase '.wrapper'");
    }
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

// cargarProyectos.js

function cargarProyectos$1(callback) {
    fetch('src/data/proyectos.json')
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => console.error('Error al cargar los proyectos:', error));
}

// Función para cargar los datos de los proyectos y manejar los tabs y la vista previa
function cargarYManejarProyectos() {
    cargarProyectos$1(data => {
        manejarTabs$1(data);
        manejarVistaPrevia(data);
    });
}

// Función para manejar la vista previa de los proyectos
function manejarVistaPrevia(proyectos) {
    const vistaPrevia = document.querySelector('.vista-previa');
    let indiceActual = 0;

    // Mostrar el primer proyecto por defecto al cargar la página
    mostrarProyecto(indiceActual);

    // Función para mostrar un proyecto en la vista previa
    function mostrarProyecto(indice) {
        const proyecto = proyectos[indice];
        const imgPrevias = document.querySelectorAll('.img-previa');

        // Actualizar la imagen del proyecto en la vista previa
        imgPrevias.forEach((imgPrevia, index) => {
            if (index === indice) {
                imgPrevia.classList.add('active');
            } else {
                imgPrevia.classList.remove('active');
            }
        });

        // Resaltar la tarjeta activa con un borde
        const proyectosCards = document.querySelectorAll('.card-proyect');
        proyectosCards.forEach((card, index) => {
            if (index === indice) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Actualizar la información del proyecto en la vista previa
        const info = vistaPrevia.querySelector('.info');
        info.querySelector('h4').textContent = proyecto.nombre;

        // Actualizar la valoración del proyecto en la vista previa
        const valoracion = info.querySelector('.valoracion');
        valoracion.innerHTML = '';
        for (let i = 0; i < proyecto.valoracion; i++) {
            const iconoEstrella = document.createElement('i');
            iconoEstrella.classList.add('fa-solid', 'fa-star');
            valoracion.appendChild(iconoEstrella);
        }

        // Actualizar las etiquetas del proyecto en la vista previa
        const tags = info.querySelector('.tags');
        tags.innerHTML = '';
        proyecto.tags.forEach(tag => {
            const spanTag = document.createElement('span');
            spanTag.textContent = tag;
            tags.appendChild(spanTag);
        });

        // Actualizar la imagen de la tarjeta en la vista previa
        const imagenPrev = vistaPrevia.querySelector('.img-previa img');
        imagenPrev.src = proyecto.imagen;
        imagenPrev.alt = proyecto.nombre;
    }

    // Actualizar la información cada 5 segundos
    setInterval(() => {
        indiceActual = (indiceActual + 1) % proyectos.length;
        mostrarProyecto(indiceActual);
    }, 5000);

    // Añadir funcionalidad de desplazamiento en dispositivos móviles
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const btnAnterior = vistaPrevia.querySelector('.fa-circle-chevron-left');
        const btnSiguiente = vistaPrevia.querySelector('.fa-circle-chevron-right');
        btnAnterior.style.display = 'none';
        btnSiguiente.style.display = 'none';

        let startTouchX;
        let endTouchX;

        vistaPrevia.addEventListener('touchstart', e => {
            startTouchX = e.touches[0].clientX;
        });

        vistaPrevia.addEventListener('touchend', e => {
            endTouchX = e.changedTouches[0].clientX;
            const deltaX = endTouchX - startTouchX;
            if (deltaX > 0) {
                // Desplazamiento hacia la izquierda
                indiceActual = (indiceActual - 1 + proyectos.length) % proyectos.length;
            } else {
                // Desplazamiento hacia la derecha
                indiceActual = (indiceActual + 1) % proyectos.length;
            }
            mostrarProyecto(indiceActual);
        });
    } else {
        // Agregar funcionalidad para botones en escritorios
        const btnAnterior = vistaPrevia.querySelector('.fa-circle-chevron-left');
        const btnSiguiente = vistaPrevia.querySelector('.fa-circle-chevron-right');

        btnAnterior.addEventListener('click', () => {
            indiceActual = (indiceActual - 1 + proyectos.length) % proyectos.length;
            mostrarProyecto(indiceActual);
        });

        btnSiguiente.addEventListener('click', () => {
            indiceActual = (indiceActual + 1) % proyectos.length;
            mostrarProyecto(indiceActual);
        });
    }
}


// Función para manejar los tabs y mostrar proyectos
function manejarTabs$1(data) {
    var tabButtons = document.getElementById('tab-buttons');
    if (tabButtons) {
        var tabContent = document.querySelector('#todos-los-proyectos');

        if (!tabContent) {
            console.error("El elemento con el ID 'todos-los-proyectos' no se encontró en el DOM.");
        }
    } else {
        console.error("El elemento con el ID 'tab-buttons' no se encontró en el DOM.");
    }

    // Obtener todas las categorías únicas de los proyectos
    var categorias = [...new Set(data.flatMap(proyecto => proyecto.categoria))];

    // Crear botón para mostrar todos los proyectos
    var buttonTodos = document.createElement("button");
    buttonTodos.innerHTML = '<i class="fa-solid fa-list-ul"></i> Todos'; // Icono añadido aquí
    buttonTodos.classList.add("tablinks");
    buttonTodos.dataset.category = "todos";
    buttonTodos.addEventListener("click", function () {
        showTabContent("todos");
        // Resaltar el botón de la pestaña activa
        var tabButtons = document.getElementsByClassName("tablinks");
        for (var i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove("active");
        }
        buttonTodos.classList.add("active");
    });
    // Agregar la clase 'active' al botón de Todos al cargar por defecto
    buttonTodos.classList.add("active");
    tabButtons.appendChild(buttonTodos);

    // Crear botones de pestañas para cada categoría
    categorias.forEach(function (categoria) {
        var button = document.createElement("button");
        button.innerHTML = categoria.charAt(0).toUpperCase() + categoria.slice(1); // Convertir la primera letra en mayúscula
        button.classList.add("tablinks");
        button.dataset.category = categoria;
        button.addEventListener("click", function () {
            showTabContent(categoria);
            // Resaltar el botón de la pestaña activa
            var tabButtons = document.getElementsByClassName("tablinks");
            for (var i = 0; i < tabButtons.length; i++) {
                tabButtons[i].classList.remove("active");
            }
            button.classList.add("active");
        });
        tabButtons.appendChild(button);
    });

    // Mostrar proyectos de la primera categoría por defecto
    showTabContent("todos");

    // Mostrar los proyectos según la categoría seleccionada
    function showTabContent(categoria) {
        tabContent.innerHTML = "";

        data.forEach(function (proyecto) {
            if (categoria === "todos" || proyecto.categoria.includes(categoria)) {
                var card = document.createElement("article");
                card.classList.add("card-proyect");

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
                            <a href="${proyecto.repositorio}" class="btn btn-pq btn-bd" target="_blank">
                                <i class="fa-brands fa-github"></i>
                                Repositorio
                            </a>
                            <a href="${proyecto.verProyecto}" class="btn btn-pq btn-bd" target="_blank">
                                <i class="fa-solid fa-eye"></i>
                                Ver Proyecto
                            </a>
                        </div>
                    </div>
                `;

                card.innerHTML = contenidoProyecto;
                tabContent.appendChild(card);
            }
        });

        // Calcular el ancho del contenedor según el número de tarjetas
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var proyectosCards = tabContent.querySelectorAll('.card-proyect');
            proyectosCards.length;
            var numColumnas = Math.floor(tabContent.offsetWidth / 320); // Ancho de tarjeta deseado (320px)
            var anchoTarjeta = (tabContent.offsetWidth / numColumnas) - (1.5 * (numColumnas - 1)); // Se resta el espacio entre tarjetas
            proyectosCards.forEach(card => {
                card.style.width = anchoTarjeta + 'px';
            });
        }

    }
}

// Cargar los proyectos al cargar la página
window.onload = function () {
    cargarYManejarProyectos();
};

// proyectosRecientes.js

function cargarProyectos() {
    fetch('src/data/proyectos.json')
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
                            <a href="${proyecto.verProyecto}" class="btn btn-pq btn-bd" target="_blank">
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

// cargarCertificados.js

function cargarCertificados(callback) {
    fetch('src/data/formacion.json')
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
        const contenidoCertificado = `
            <img src="${certificado.imagen}" alt="${certificado.nombre}">
            <span class="tipo-certificado">${certificado.tipo}</span>
            <div class="info-certificado">
                <h3>${certificado.nombre}</h3>
                <div class="info-hidden">
                    <span>${certificado.proveedor}</span>
                    <div class="botones">
                        <a href="${certificado.certificadoLink}" class="btn btn-pq btn-bd bd-gradient" download>
                            <i class="fa-solid fa-certificate"></i>
                            Certificado
                        </a>
                        <a href="${certificado.cursoLink}" class="btn btn-pq btn-bd bd-gradient">
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

function iniciarSeccionCurriculum() {
    const p1 = document.getElementById('p1');
    document.getElementById('p2');
    const p3 = document.getElementById('p3');
    const triptych = document.querySelector('.cont-triptych');

    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');

    let clickCount = 0;
    let scaleLevel = 1;

    // Función para manejar el clic en el botón de siguiente
    nextBtn.addEventListener('click', function() {
        clickCount++;

        // Agregar clase al primer panel en el primer clic
        if (clickCount === 1) {
            p1.classList.add('flip-neg');
        }

        // Agregar clase al tercer panel en el segundo clic
        if (clickCount === 2) {
            p3.classList.add('flip-pos');
        }

        // Hacer scroll al siguiente panel
        triptych.scrollLeft += triptych.offsetWidth * 2;
    });

    // Función para manejar el clic en el botón de anterior
    prevBtn.addEventListener('click', function() {
        // Retroceder una página si es que ya se avanzó
        if (clickCount > 0) {
            clickCount--;

            // Quitar clase del tercer panel en el primer clic
            if (clickCount === 1) {
                p3.classList.remove('flip-pos');
            }

            // Quitar clase del primer panel en el segundo clic
            if (clickCount === 0) {
                p1.classList.remove('flip-neg');
            }

            // Hacer scroll al panel anterior
            triptych.scrollLeft -= triptych.offsetWidth * 2;
        }
    });

    // Función para manejar el clic en el botón de zoom in
    zoomInBtn.addEventListener('click', function() {
        scaleLevel += 0.5; // Aumentar el nivel de zoom
        updateZoom();
    });

    // Función para manejar el clic en el botón de zoom out
    zoomOutBtn.addEventListener('click', function() {
        if (scaleLevel > 0.5) { // Limitar el zoom mínimo
            scaleLevel -= 0.5; // Disminuir el nivel de zoom
            updateZoom();
        }
    });

    // Función para actualizar el nivel de zoom
    function updateZoom() {
        triptych.style.transform = `scale(${scaleLevel})`;
    }

    // Event listener para hacer scroll con el mouse o el dedo
    triptych.addEventListener('wheel', function(event) {
        event.preventDefault();
        const scrollDistance = triptych.offsetWidth * 2;
        triptych.scrollLeft += event.deltaY > 0 ? scrollDistance : -scrollDistance;
    });
}

function formulario() {
    const btnProyecto = document.querySelector('.btn-proyecto');
    const btnContratacion = document.querySelector('.btn-contratacion');
    const formProyecto = document.querySelector('.cont_form-proyect');
    const formContratacion = document.querySelector('.cont_form-contact');

    // Agregar eventos de clic a los botones del CTA
    btnProyecto.addEventListener('click', function() {
        // Mostrar el formulario de iniciar un proyecto
        formProyecto.style.display = 'block';
        // Ocultar el formulario de contratación
        formContratacion.style.display = 'none';
    });

    btnContratacion.addEventListener('click', function() {
        // Mostrar el formulario de contratación
        formContratacion.style.display = 'block';
        // Ocultar el formulario de iniciar un proyecto
        formProyecto.style.display = 'none';
    });
}

window.onload = function () {
    iniciarSlide();
    iniciarDropdown();
    cargarProyectos();
    cargarYManejarProyectos();
    cargarYManejarCertificados();
    iniciarSeccionCurriculum();
    formulario();
};

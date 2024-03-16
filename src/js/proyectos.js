import { cargarProyectos } from './cargarProyectos.js';

// Función para cargar los datos de los proyectos y manejar los tabs y la vista previa
function cargarYManejarProyectos() {
    cargarProyectos(data => {
        manejarTabs(data);
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
    }
}


// Función para manejar los tabs y mostrar proyectos
function manejarTabs(data) {
    var tabButtons = document.getElementById('tab-buttons');
    if (tabButtons) {
        var tabContent = document.querySelector('#todos-los-proyectos');

        if (!tabContent) {
            console.error("El elemento con el ID 'todos-los-proyectos' no se encontró en el DOM.");
        } else {
            // Resto del código para agregar botones de pestañas al elemento tabButtons
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

                card.innerHTML = contenidoProyecto;
                tabContent.appendChild(card);
            }
        });

        // Calcular el ancho del contenedor según el número de tarjetas
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var proyectosCards = tabContent.querySelectorAll('.card-proyect');
            var numProyectos = proyectosCards.length;
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

export { cargarYManejarProyectos };

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

function formulario() {
    const proyecto = document.getElementById('btn-proyecto');
    const contratacion = document.getElementById('btn-contratacion');
    const formProyecto = document.getElementById('form-proyecto');
    const formContacto = document.getElementById('form-contacto');

    proyecto.addEventListener("click", () => {
        if (!formProyecto.classList.contains('visible')) {
            formProyecto.classList.add('visible');
            formContacto.classList.remove('visible');
            formProyecto.scrollIntoView({ behavior: "smooth" });
            formProyecto.querySelector('input').focus();
        }
    });

    contratacion.addEventListener("click", () => {
        if (!formContacto.classList.contains('visible')) {
            formContacto.classList.add('visible');
            formProyecto.classList.remove('visible');
            formContacto.scrollIntoView({ behavior: "smooth" });
            formContacto.querySelector('input').focus();
        }
    });

    // Agregar controlador de eventos para el envío del formulario de proyectos
    formProyecto.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe por defecto

        // Comprobación de validez de los campos del formulario
        if (this.checkValidity()) {
            // Obtener los valores de los campos del formulario
            const nombre = this.querySelector('input[name="nombre"]').value;
            const correo = this.querySelector('input[name="correo"]').value;
            const telefono = this.querySelector('input[name="telefono"]').value;
            const fecha = new Date(this.querySelector('input[name="fecha"]').value);
            const presupuesto = this.querySelector('input[name="presupuesto"]').value;
            const descripcion = this.querySelector('textarea[name="descripcion"]').value;

            // Validar el número de teléfono
            const telefonoValido = /^\d{3}-\d{3}-\d{4}$/.test(telefono);

            // Validar el correo electrónico
            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

            // Obtener la fecha actual
            const fechaActual = new Date();
            // Agregar un mes a la fecha actual
            const fechaMinima = new Date(fechaActual);
            fechaMinima.setMonth(fechaActual.getMonth() + 1);

            // Validar la fecha estimada
            const fechaValida = fecha.getTime() >= fechaMinima.getTime();

            if (telefonoValido && correoValido && fechaValida) {
                // Aquí puedes realizar cualquier acción que desees con los datos del formulario
                console.log("Nombre:", nombre);
                console.log("Correo:", correo);
                console.log("Teléfono:", telefono);
                console.log("Fecha estimada:", fecha.toLocaleDateString());
                console.log("Presupuesto:", presupuesto);
                console.log("Descripción:", descripcion);

                // Por ejemplo, puedes enviar los datos a través de una solicitud HTTP
                // utilizando fetch() o cualquier otra biblioteca de HTTP
            } else {
                // Mostrar mensajes de error según las validaciones
                let mensajeError = "Por favor, corrige los siguientes errores:\n";
                if (!telefonoValido) mensajeError += "- El número de teléfono no es válido.\n";
                if (!correoValido) mensajeError += "- La dirección de correo electrónico no es válida.\n";
                if (!fechaValida) mensajeError += "- La fecha estimada debe ser al menos un mes después de la fecha actual.\n";
                alert(mensajeError);
            }
        } else {
            // Si el formulario no es válido según las reglas HTML5, muestra un mensaje de error
            alert("Por favor, completa todos los campos correctamente.");
        }
    });
}

window.onload = function () {
    iniciarSlide();
    iniciarDropdown();
    cargarProyectos();
    formulario();
};

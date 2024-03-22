'use strict';

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

window.onload = function () {
    iniciarDropdown();
    iniciarSeccionCurriculum();
};

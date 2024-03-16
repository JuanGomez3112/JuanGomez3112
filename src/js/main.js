import { iniciarSlide } from './slide.js';
import { iniciarDropdown } from './dropdown-menu.js';
import { cargarProyectos } from './cargarProyectos.js';
import { cargarYManejarProyectos } from './proyectos.js';

// Iniciar funcionalidades al cargar la página
window.onload = function () {
    iniciarSlide();
    iniciarDropdown();

    // Llamar a cargarProyectos sin argumentos y manejar los proyectos dentro de la función de devolución de llamada
    cargarProyectos(function(data) {
        // Lógica para manejar los proyectos cargados
        cargarYManejarProyectos(data);
    });
};

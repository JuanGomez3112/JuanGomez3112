import { iniciarSlide } from './slide.js';
import { iniciarDropdown } from './dropdown-menu.js';
import { cargarYManejarProyectos } from './proyectos.js';
import { cargarProyectos } from './proyectosRecientes.js'; // Importar la función cargarProyectos desde proyectosRecientes.js

// Iniciar funcionalidades al cargar la página
window.onload = function () {
    iniciarSlide();
    iniciarDropdown();

    // Llamar a cargarProyectos al cargar la página
    cargarProyectos();
    cargarYManejarProyectos();
};

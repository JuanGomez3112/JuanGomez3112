// main.js
import { iniciarSlide } from './slide.js';
import { iniciarDropdown } from './dropdown-menu.js';
import { cargarYManejarProyectos } from './proyectos.js';
import { cargarProyectos } from './proyectosRecientes.js';
import { cargarYManejarCertificados } from './certificados.js'; // Importar la función

window.onload = function () {
    iniciarSlide();
    iniciarDropdown();
    cargarProyectos();
    cargarYManejarProyectos();
    cargarYManejarCertificados(); // Llamar la función para cargar y manejar los certificados
};

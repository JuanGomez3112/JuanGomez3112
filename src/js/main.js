import { iniciarSlide } from './slide.js';
import { iniciarDropdown } from './dropdown-menu.js';
import { formulario } from './formulario.js';
import { cargarYManejarProyectos } from './proyectos.js';
import { cargarProyectos } from './proyectosRecientes.js';
import { cargarYManejarCertificados } from './certificados.js';
import { iniciarSeccionCurriculum } from './seccionCurriculum.js';

window.onload = function () {
    iniciarSlide();
    iniciarDropdown();
    formulario();
    cargarProyectos();
    cargarYManejarProyectos();
    cargarYManejarCertificados();
    iniciarSeccionCurriculum();
};

import { iniciarSlide } from './slide.js';
import { iniciarDropdown } from './dropdown-menu.js';
import { cargarYManejarProyectos } from './formacion.js';
import { cargarProyectos } from './proyectosRecientes.js';
import { cargarYManejarCertificados } from './formacion.js';
import { iniciarSeccionCurriculum } from './seccionCurriculum.js';
import { formulario } from './formulario.js';

window.onload = function () {
    iniciarSlide();
    iniciarDropdown();
    cargarProyectos();
    cargarYManejarProyectos();
    cargarYManejarCertificados();
    iniciarSeccionCurriculum();
    formulario();
};
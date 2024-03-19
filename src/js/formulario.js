export function formulario() {
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

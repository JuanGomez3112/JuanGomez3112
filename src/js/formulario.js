export function formulario() {
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
}

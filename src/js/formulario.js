export default function formulario() {
    const tabs = document.querySelectorAll(".botones a");

    tabs.forEach(tab => {
        tab.addEventListener("click", function(event) {
            event.preventDefault();
            const target = this.dataset.target;

            // Ocultar todos los formularios
            document.querySelectorAll(".cont_form-proyect, .cont_form-contact").forEach(form => {
                form.classList.remove("visible");
                form.classList.add("invisible");
            });

            // Mostrar el formulario correspondiente al botón clickeado
            document.getElementById(target).classList.remove("invisible");
            document.getElementById(target).classList.add("visible");

            // Remover la clase "active" de todos los botones
            tabs.forEach(tab => {
                tab.classList.remove("active");
            });

            // Agregar la clase "active" al botón clickeado
            this.classList.add("active");
        });
    });
}
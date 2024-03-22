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

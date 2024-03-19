// dropdown.js

function iniciarDropdown() {
    const boton = document.querySelector(".candy-box");
    const circleBoton = boton.querySelector(".candy-item");
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
            }, 100)
        }, 600);
    };

    circleBoton.addEventListener("click", () => {
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

export { iniciarDropdown };

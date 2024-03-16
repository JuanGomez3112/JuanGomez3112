// dropdown.js

function iniciarDropdown() {
    const boton = document.querySelector(".candy-box");
    const circleBoton = boton.querySelector(".candy-item");
    const contOlas = document.querySelector(".olas");
    const menuCont = document.querySelector(".menu-container");

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
            contOlas.classList.remove("active");
        }, 300);
    };

    circleBoton.addEventListener("click", () => {
        if (contOlas.classList.contains("active")) {
            dropUp();
        } else {
            dropDown();
        }
    });
}

export { iniciarDropdown };

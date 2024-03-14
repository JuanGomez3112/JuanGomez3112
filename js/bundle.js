'use strict';

document.addEventListener("DOMContentLoaded", function() {
    const wrapper = document.querySelector(".wrapper");

    let intervalo = null;
    let step = 1;
    let maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

    const start = () => {
        intervalo = setInterval(() => {
            wrapper.scrollLeft = wrapper.scrollLeft + step;

            if (wrapper.scrollLeft === maxScrollLeft) {
                step = step * -1;
            } else if (wrapper.scrollLeft === 0) {
                step = step * -1;
            }

        }, 10);
    };

    const stop = () => {
        clearInterval(intervalo);
    };

    wrapper.addEventListener("mouseover", () => {
        stop();
    });

    wrapper.addEventListener("mouseout", () => {
        start();
    });

    start();
});

document.addEventListener("DOMContentLoaded", function() {
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
        }, 800);
    };

    const dropUp = () => {
        clearTimeout(timerId);
        menuCont.style.opacity = "0";

        timerId = setTimeout(() => {
            menuCont.style.display = "none";
            contOlas.classList.remove("active");
        }, 800);
    };

    circleBoton.addEventListener("click", () => {
        if (contOlas.classList.contains("active")) {
            dropUp();
        } else {
            dropDown();
        }
    });
});

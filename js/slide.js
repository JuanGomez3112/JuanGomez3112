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

export function iniciarSeccionCurriculum() {
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const p3 = document.getElementById('p3');
    const triptych = document.querySelector('.cont-triptych');

    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');

    let clickCount = 0;
    let scaleLevel = 1;

    // Función para manejar el clic en el botón de siguiente
    nextBtn.addEventListener('click', function() {
        clickCount++;

        // Agregar clase al primer panel en el primer clic
        if (clickCount === 1) {
            p1.classList.add('flip-neg');
        }

        // Agregar clase al tercer panel en el segundo clic
        if (clickCount === 2) {
            p3.classList.add('flip-pos');
        }

        // Hacer scroll al siguiente panel
        triptych.scrollLeft += triptych.offsetWidth * 2;
    });

    // Función para manejar el clic en el botón de anterior
    prevBtn.addEventListener('click', function() {
        // Retroceder una página si es que ya se avanzó
        if (clickCount > 0) {
            clickCount--;

            // Quitar clase del tercer panel en el primer clic
            if (clickCount === 1) {
                p3.classList.remove('flip-pos');
            }

            // Quitar clase del primer panel en el segundo clic
            if (clickCount === 0) {
                p1.classList.remove('flip-neg');
            }

            // Hacer scroll al panel anterior
            triptych.scrollLeft -= triptych.offsetWidth * 2;
        }
    });

    // Función para manejar el clic en el botón de zoom in
    zoomInBtn.addEventListener('click', function() {
        scaleLevel += 0.2; // Aumentar el nivel de zoom
        updateZoom();
    });

    // Función para manejar el clic en el botón de zoom out
    zoomOutBtn.addEventListener('click', function() {
        if (scaleLevel > 0.2) { // Limitar el zoom mínimo
            scaleLevel -= 0.2; // Disminuir el nivel de zoom
            updateZoom();
        }
    });

    // Función para actualizar el nivel de zoom
    function updateZoom() {
        triptych.style.transform = `scale(${scaleLevel})`;
    }

    // Event listener para hacer scroll con el mouse o el dedo
    triptych.addEventListener('wheel', function(event) {
        event.preventDefault();
        const scrollDistance = triptych.offsetWidth * 2;
        triptych.scrollLeft += event.deltaY > 0 ? scrollDistance : -scrollDistance;
    });
}

// Función para cargar los datos de los proyectos desde el archivo JSON
function cargarProyectos() {
    fetch('/src/data/proyectos.json')
        .then(response => response.json())
        .then(data => {
            // Obtener las referencias a los elementos HTML
            var contenedorProyectos = document.querySelector('.contenedor-proyectos');
            var proyectosCard = contenedorProyectos.querySelector('.proyectos-card');

            // Iterar sobre los primeros dos proyectos y agregarlos al HTML
            data.slice(0, 2).forEach(proyecto => {
                var cardProyecto = document.createElement('article');
                cardProyecto.classList.add('card-proyect');

                // Contenido del proyecto
                var contenidoProyecto = `
                    <div class="imagen-card">
                        <img src="${proyecto.imagen}" alt="${proyecto.nombre}">
                    </div>
                    <div class="card-info">
                        <div class="info-proyect">
                            <h4>${proyecto.nombre}</h4>
                            <div class="valoracion">
                                ${'<i class="fa-solid fa-star"></i>'.repeat(proyecto.valoracion)}
                            </div>
                            <p>${proyecto.tecnologias}</p>
                            <div class="tags">
                                ${proyecto.tags.map(tag => `<div class="btn btn-pq btn-tags">${tag}</div>`).join('')}
                            </div>
                        </div>
                        <div class="botones">
                            <a href="${proyecto.repositorio}" class="btn btn-bd" target="_blank">
                                <i class="fa-brands fa-github"></i>
                                Repositorio
                            </a>
                            <a href="${proyecto.verProyecto}" class="btn btn-pq btn-bd" target="_blank">
                                <i class="fa-solid fa-eye"></i>
                                Ver Proyecto
                            </a>
                        </div>
                    </div>
                `;

                cardProyecto.innerHTML = contenidoProyecto;
                proyectosCard.appendChild(cardProyecto);
            });

            // Mostrar el enlace para ver más proyectos
            var cardMasProyectos = document.createElement('article');
            cardMasProyectos.classList.add('card-proyect', 'card-more');
            cardMasProyectos.innerHTML = `
                <a href="/portafolio.html">
                    <i class="fa-solid fa-plus"></i>
                    Ver más proyectos
                </a>
            `;
            proyectosCard.appendChild(cardMasProyectos);
        })
        .catch(error => console.error('Error al cargar los proyectos:', error));
}

// Cargar los proyectos al cargar la página
window.onload = function() {
    cargarProyectos();
};

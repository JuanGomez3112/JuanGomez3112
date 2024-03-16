// cargarProyectos.js

export function cargarProyectos(callback) {
    fetch('src/data/proyectos.json')
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => console.error('Error al cargar los proyectos:', error));
}

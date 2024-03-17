// cargarCertificados.js

export function cargarCertificados(callback) {
    fetch('src/data/formacion.json')
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => console.error('Error al cargar los certificados:', error));
}

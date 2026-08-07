'use strict';

// Pagina de detalle de proyecto: lee ?id=<slug> y renderiza desde proyectos.json
(function () {
    const cont = document.getElementById('proyecto-detalle');
    if (!cont) return;

    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const chip = (t) => `<span class="pd-tag">${esc(t)}</span>`;

    fetch('src/data/proyectos.json?_=' + Date.now())
        .then(r => r.json())
        .then(data => {
            const p = data.find(x => x.slug === id) || (!id ? null : null);
            if (!p) {
                cont.innerHTML = `
                    <div class="pd-notfound">
                        <p class="section-eyebrow">Proyecto</p>
                        <h2>No encontramos ese proyecto</h2>
                        <a href="portafolio.html" class="btn btn-bd"><span class="ctn-btn"><i class="fa-solid fa-arrow-left"></i> Volver al portafolio</span></a>
                    </div>`;
                return;
            }

            document.title = `Juan Gomez | ${p.nombre}`;

            const tags = Array.isArray(p.tags) ? p.tags.map(chip).join('') : '';
            const mockups = (Array.isArray(p.mockups) ? p.mockups : [p.imagen]).filter(Boolean);
            const galeria = mockups.map(src =>
                `<figure class="pd-shot"><img src="${esc(src)}" alt="${esc(p.nombre)}" loading="lazy"></figure>`
            ).join('');
            const resultados = Array.isArray(p.resultados)
                ? `<ul class="pd-lista">${p.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : '';

            const live = p.verProyecto && p.verProyecto !== '#'
                ? `<a href="${esc(p.verProyecto)}" target="_blank" class="btn btn-bd"><span class="ctn-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ver en vivo</span></a>` : '';
            const repo = p.repositorio && p.repositorio !== '#'
                ? `<a href="${esc(p.repositorio)}" target="_blank" class="btn btn-bd"><span class="ctn-btn"><i class="fa-brands fa-github"></i> Repositorio</span></a>` : '';

            cont.innerHTML = `
                <a href="portafolio.html" class="pd-volver"><i class="fa-solid fa-arrow-left"></i> Portafolio</a>

                <header class="pd-hero">
                    <p class="section-eyebrow">Proyecto</p>
                    <h1 class="pd-titulo">${esc(p.nombre)}</h1>
                    <p class="pd-tech">${esc(p.tecnologias || '')}</p>
                    <div class="pd-tags">${tags}</div>
                </header>

                <section class="pd-galeria">${galeria}</section>

                <section class="pd-info">
                    <div class="pd-col">
                        <p class="section-eyebrow">Sobre el proyecto</p>
                        <p class="pd-desc">${esc(p.descripcion)}</p>
                    </div>
                    <div class="pd-col">
                        <p class="section-eyebrow">Mi rol</p>
                        <p class="pd-desc">${esc(p.rol)}</p>
                        ${resultados ? `<p class="section-eyebrow pd-mt">Resultados</p>${resultados}` : ''}
                    </div>
                </section>

                <div class="pd-acciones">${live}${repo}</div>
            `;
        })
        .catch(() => {
            cont.innerHTML = `<div class="pd-notfound"><h2>Error cargando el proyecto</h2></div>`;
        });
})();

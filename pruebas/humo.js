'use strict';

// Prueba de humo del sitio. NO se carga en produccion.
// Se pega al final de js/header.js, se corre, y se deshace.
// Instrucciones y resultado esperado en LEEME.md, en esta misma carpeta.

addEventListener('load', () => setTimeout(async () => {
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const R = [];
  const ok = (n, c) => R.push((c ? 'ok ' : 'FALLA ') + n);

  // --- comun a todas ---
  const rotas = [...document.images].filter(i => i.complete && i.naturalWidth === 0);
  ok('imagenes(' + document.images.length + ')', rotas.length === 0);

  const boton = document.querySelector('.candy-box');
  const menu = document.querySelector('.menu-container');
  if (boton && menu) {
    const antes = getComputedStyle(menu).display;
    boton.click(); await espera(450);
    const abierto = getComputedStyle(menu).display;
    boton.click(); await espera(800);
    const cerrado = getComputedStyle(menu).display;
    // en escritorio el nav esta siempre visible: eso tambien es correcto
    ok('menu', (abierto === 'flex' && cerrado === 'none') || antes === 'flex');
  }

  const pdf = document.querySelector('a[href$=".pdf"]');
  if (pdf) {
    try { const r = await fetch(pdf.getAttribute('href'), {method:'HEAD'}); ok('pdf', r.ok); }
    catch (e) { ok('pdf', false); }
  }

  const pag = location.pathname.split('/').pop() || 'index.html';

  if (pag === 'curriculum.html') {
    const carta = document.getElementById('cvCarta');
    const esc = document.getElementById('cvEscena');

    // zoom primero, en frio
    const w0 = esc.getBoundingClientRect().width;
    document.querySelector('.zoom-in').click(); await espera(900);
    const w1 = esc.getBoundingClientRect().width;
    ok('zoom(' + w0.toFixed(0) + '->' + w1.toFixed(0) + ')', w1 > w0 + 10);
    document.querySelector('.zoom-out').click(); await espera(900);
    ok('zoom-vuelve', Math.abs(esc.getBoundingClientRect().width - w0) < 12);

    // 8 pasos: se recorren todos y se vuelve al punto de partida
    const sig = document.querySelector('.next-btn');
    const vistos = new Set([carta.dataset.estado]);
    for (let i = 0; i < 8; i++) { sig.click(); await espera(140); vistos.add(carta.dataset.estado); }
    ok('estados(' + [...vistos].sort().join(',') + ')', vistos.size === 7);
    ok('ciclo-cierra', carta.dataset.estado === '0');
    ok('tarjeta', !!document.querySelector('.cv-tarjeta img'));
  }

  if (pag === 'index.html') {
    ok('pliego-home', !!document.querySelector('.cv-pliego--home .cv-carta'));
    ok('abierto', document.querySelector('.cv-pliego--home .cv-carta').dataset.estado === '2');
    ok('form', !!document.querySelector('form'));
    let n = 0;
    for (let i = 0; i < 12 && n !== 3; i++) {
      n = document.querySelectorAll('a[href^="proyecto.html?"]').length;
      if (n !== 3) await espera(250);
    }
    ok('proyectos(' + n + ')', n === 3);
  }

  if (pag === 'formacion.html') {
    ok('certificados', document.querySelectorAll('[class*=certific]').length > 5);
  }

  if (pag === 'portafolio.html') {
    ok('proyectos', document.querySelectorAll('a[href^="proyecto.html?"]').length === 3);
  }

  document.title = pag + ' >> ' + R.join(' | ');
}, 900));

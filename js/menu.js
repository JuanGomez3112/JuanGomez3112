'use strict';

// Menú desplegable accesible, compartido en todas las páginas.
// Reemplaza las copias de iniciarDropdown() dispersas por página y añade
// soporte de teclado (Enter/Espacio/Escape) y estado ARIA (aria-expanded).
(function () {
    function initMenu() {
        const boton = document.querySelector('.candy-box');
        const menuCont = document.querySelector('.menu-container');
        const header = document.querySelector('header');
        if (!boton || !menuCont) return;

        // El div del hamburguesa pasa a comportarse como botón accesible.
        boton.setAttribute('role', 'button');
        boton.setAttribute('tabindex', '0');
        boton.setAttribute('aria-label', 'Abrir menú');
        boton.setAttribute('aria-expanded', 'false');
        if (!menuCont.id) menuCont.id = 'menu-nav';
        boton.setAttribute('aria-controls', menuCont.id);

        let timerId;
        // El estado vivía en la clase .active de .contenedor-olas (markup de las
        // olas, ya eliminado). Ahora es una variable interna que cambia en los
        // mismos instantes: true al abrir, false al terminar el cierre.
        let estaAbierto = false;
        const abierto = () => estaAbierto;

        const dropDown = () => {
            clearTimeout(timerId);
            estaAbierto = true;
            menuCont.style.display = 'flex';
            boton.setAttribute('aria-expanded', 'true');
            boton.setAttribute('aria-label', 'Cerrar menú');
            timerId = setTimeout(() => { menuCont.style.opacity = '1'; }, 300);
        };

        const dropUp = () => {
            clearTimeout(timerId);
            menuCont.style.opacity = '0';
            boton.setAttribute('aria-expanded', 'false');
            boton.setAttribute('aria-label', 'Abrir menú');
            timerId = setTimeout(() => {
                menuCont.style.display = 'none';
                setTimeout(() => { estaAbierto = false; }, 100);
            }, 600);
        };

        const toggle = () => (abierto() ? dropUp() : dropDown());

        boton.addEventListener('click', toggle);
        boton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                toggle();
            } else if (e.key === 'Escape' && abierto()) {
                dropUp();
            }
        });

        // Clic fuera del header cierra (solo si está abierto).
        document.addEventListener('click', (e) => {
            if (abierto() && header && !header.contains(e.target)) dropUp();
        });

        // Escape global cierra y devuelve el foco al botón.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && abierto()) {
                dropUp();
                boton.focus();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
})();

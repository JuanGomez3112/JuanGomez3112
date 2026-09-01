# Prueba de humo del sitio

Batería que **ejecuta la página y comprueba el resultado**, no que el código
compile. Nació porque el zoom del visor se rompió **dos veces** por la misma
causa y `node --check` no lo detectaba: era un `ReferenceError` en tiempo de
ejecución, no un error de sintaxis.

## Cómo se corre

1. Servir el sitio: `python -m http.server 8777 --bind 127.0.0.1`
2. Pegar `humo.js` al final de `js/header.js` — lo cargan las 6 páginas.
3. **Desactivar las transiciones** mientras se mide, añadiendo al final de
   `css/style.css`:
   ```css
   .cv-pliego, .cv-pliego * { transition: none !important; }
   ```
4. Por cada página:
   ```
   chrome --headless --disable-gpu --window-size=1280,1000 \
     --virtual-time-budget=14000 --dump-dom \
     "http://127.0.0.1:8777/curriculum.html" | grep -o "<title>[^<]*</title>"
   ```
   El resultado sale en el `<title>`.
5. **Deshacer los pasos 2 y 3.** Nada de esto va a producción.

## Por qué hay que apagar las transiciones

`--virtual-time-budget` acelera los temporizadores, pero las transiciones CSS no
avanzan de forma fiable con ese reloj. Sin apagarlas, el ancho se mide a medias
y el zoom da falsos negativos: la variable `--cv-zoom` cambia pero el ancho
medido sigue igual. Pasó varias veces y no era un fallo del sitio.

## Resultado esperado (2026-09-01)

```
index.html      ok imagenes(10) | ok menu | ok pdf | ok pliego-home |
                ok abierto | ok form | ok recientes(2)
curriculum.html ok imagenes(8) | ok menu | ok pdf | ok zoom(308->385) |
                ok zoom-vuelve | ok estados(0,1,2,3,4,5,6) | ok ciclo-cierra |
                ok tarjeta
formacion.html  ok imagenes(14) | ok menu | ok pdf | ok certificados
portafolio.html ok imagenes(4)  | ok menu | ok pdf | ok proyectos
sobreMi.html    ok imagenes(1)  | ok menu | ok pdf
proyecto.html   ok imagenes(0)  | ok menu
```

Verificado también a 390×844: zoom 255->318 y el resto igual.

## Dos cosas que NO son fallos

- **La home muestra 2 proyectos**, no 3. Es deliberado: `inicio.js` hace
  `data.slice(0, 2)`. El portafolio sí muestra los 3.
- **En escritorio el menú está siempre visible** (`display:flex` por media
  query) y el botón hamburguesa oculto. La prueba lo contempla.

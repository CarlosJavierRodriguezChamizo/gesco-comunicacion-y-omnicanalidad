/* =========================================================================
   deck.js — Inicialización común de los mazos RevealJS.
   Reveal y su CSS se importan por npm (offline: ningún CDN en ejecución).
   Cada deck HTML solo necesita su markup .reveal/.slides y este módulo.
   ========================================================================= */
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "../styles/deck.css";

const deck = new Reveal({
  hash: true,            // el hash de slide en la URL funciona también offline
  controls: true,
  progress: true,
  slideNumber: "c/t",
  center: true,
  transition: "slide",
  width: 1280,           // lienzo 16:9; Reveal lo escala a la pantalla del aula
  height: 720,
  margin: 0.07,
});

/** Cambia el logo (blanco/azul) según el fondo de la slide actual. */
function sincronizarLogo() {
  const actual = deck.getCurrentSlide();
  const esClara = !!actual && actual.classList.contains("slide--light");
  document.body.classList.toggle("light-slide", esClara);
}

deck.initialize().then(sincronizarLogo);
deck.addEventListener("slidechanged", sincronizarLogo);

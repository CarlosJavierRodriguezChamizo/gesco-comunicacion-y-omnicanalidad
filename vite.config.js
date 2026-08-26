// Configuración de Vite — proyecto multipágina, offline-first.
// base:'./' => rutas relativas: sirve igual desde la raíz de un dominio,
// desde una subcarpeta (GitHub Pages de proyecto) o abriendo /dist en local.
import { defineConfig } from 'vite';
import { resolve } from 'path';

const r = (p) => resolve(__dirname, p);

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Todas las páginas declaradas como entradas.
      // (No existe ninguna página de profesor: ese material se gestiona fuera.)
      input: {
        // Hub / escaleta viva de las 4 sesiones
        index: r('index.html'),
        // Deck de apertura
        intro: r('decks/intro.html'),
        // Mazos de teoría (RevealJS)
        m1: r('decks/m1.html'),
        m2: r('decks/m2.html'),
        m3: r('decks/m3.html'),
        // Herramientas interactivas (prácticas del taller)
        buyerPersona: r('tools/buyer-persona.html'),
        keywords: r('tools/keywords.html'),
        funnel: r('tools/funnel.html'),
        nurturing: r('tools/nurturing.html'),
        calendario: r('tools/calendario.html'),
        pitch: r('tools/pitch.html'),
        kahoot: r('tools/kahoot.html'),
        // Guía de estilo (no enlazada en la navegación)
        styleguide: r('tools/_styleguide.html'),
      },
    },
  },
});

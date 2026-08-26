/* =========================================================================
   index.js — Barrel de componentes. Importa desde aquí:
     import { Header, Section, Card, Chip, Kpi, Button, Badge } from "../components/index.js";
   Todos los de presentación son funciones puras que devuelven HTML.
   Los de comportamiento (StatePanel, AskAI, RevealMoment) exponen además
   una función para conectarlos al DOM.
   Recuerda enlazar src/styles/components.css en la página.
   ========================================================================= */
export { Header, Breadcrumb } from "./header.js";
export { Section } from "./section.js";
export { Card } from "./card.js";
export { Chip } from "./chip.js";
export { Kpi } from "./kpi.js";
export { Button } from "./button.js";
export { Badge } from "./badge.js";
export { createStatePanel } from "./statePanel.js";
export { AskAIButton, wireAskAI } from "./askAI.js";
export { RevealMoment, updateRevealMoment } from "./revealMoment.js";
export { escapeHtml, cx, attrs, appUrl, slug, num, descargar, copiar } from "./_util.js";

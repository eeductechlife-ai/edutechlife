import { createPortal } from "react-dom";
import PropTypes from "prop-types";

/**
 * ModalPortal — renderiza sus hijos directamente en `document.body`.
 *
 * ¿Por qué? Los modales usan `position: fixed`. Si se montan dentro de un
 * ancestro que aplica `transform` (p. ej. el `<aside>` del sidebar, animado por
 * Framer Motion) o que recorta con `overflow: hidden`, el `fixed` queda
 * contenido por ese ancestro y el modal aparece como una franja dentro del
 * sidebar en lugar de cubrir la pantalla.
 *
 * Al portarlos a `document.body` se garantiza que se rendericen a nivel de
 * viewport, por encima de todo, sin recortes ni desplazamientos.
 */
const ModalPortal = ({ children }) => {
  // En prerender/build no existe `document`; los modales están cerrados en ese
  // momento, así que devolver null es seguro.
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

ModalPortal.propTypes = {
  children: PropTypes.node,
};

export default ModalPortal;

// NeuroEntornoPage lo carga con `lazy(() => import("../neuroEntorno"))`, y lazy()
// exige una exportación por defecto: sin ella React lanza el error #306 y la
// página /neuroentorno mostraba «Algo salió mal». Se conserva también la
// exportación con nombre por si algo más la importa así.
export { default, default as NeuroEntorno } from "./NeuroEntorno";

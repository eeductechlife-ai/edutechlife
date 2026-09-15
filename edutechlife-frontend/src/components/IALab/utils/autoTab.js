/**
 * "Tab inteligente" del IALab: al abrir un módulo sin sección activa, se
 * redirige a Actividades SOLO cuando el contenido ya está completo y el examen
 * sigue pendiente (el estudiante ya sabe el camino y el siguiente paso lógico
 * es el examen).
 *
 * Los módulos con chrome inmersivo (M2/M3/M4) abren SIEMPRE en Inicio para que
 * el estudiante vea la pantalla de bienvenida de su herramienta.
 */
export const AUTO_TAB_MODULES = [1, 5];

export function shouldAutoOpenActivities({ moduleId, resourcesCompleted, exam }) {
  return (
    AUTO_TAB_MODULES.includes(Number(moduleId)) &&
    Boolean(resourcesCompleted) &&
    !exam
  );
}

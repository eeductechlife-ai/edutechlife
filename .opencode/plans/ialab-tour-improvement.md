# Plan: Mejora del Tour para Nuevos Estudiantes en IALab

## Objetivo

Ampliar el recorrido guiado (tour) de 3 a 7 pasos, explicando cada sección clave de la plataforma con textos cortos y concisos, manteniendo el estilo premium tipo dashboard.

---

## Estado Actual

Actualmente el tour (`IALabTour.jsx`) tiene 3 pasos:

| # | Target `data-tour` | Componente |
|---|-------------------|------------|
| 1 | `tour-ruta` | TuRutaDeHoy |
| 2 | `tour-temas` | ModuleOverviewCard |
| 3 | `tour-actividades` | ModuleActions |

---

## Nuevo Tour (7 pasos)

| # | Nombre | Target | Componente | Descripción |
|---|--------|--------|------------|-------------|
| 1 | **Sidebar** | `tour-sidebar` | IALabSidebar (aside) | "Panel de navegación. Aquí controlas tu progreso, accedes a los módulos, recursos adicionales y activas el modo oscuro." |
| 2 | **Menú de Secciones** | `tour-tabs` | TAB PILLS en IALab.jsx | "Filtra el contenido del módulo: Objetivos, Contenido, Actividades y Herramientas. Úsalos para navegar rápidamente." |
| 3 | **Tu Ruta de Hoy** | `tour-ruta` | TuRutaDeHoy | "Tu próxima acción recomendada. Sigue esta ruta para avanzar sin perderte." (ya existe) |
| 4 | **Objetivos del Módulo** | `tour-objetivos` | ModuleInfoSection | "Cada módulo tiene un objetivo claro. Revisa qué aprenderás y cómo se compone tu nota (Comunidad 5%, Desafío 30%, Examen 35%, Recursos 30%)." |
| 5 | **Temas del Módulo** | `tour-temas` | ModuleOverviewCard | "Cada tema contiene recursos multimedia. Expande y completa todos para avanzar." (ya existe) |
| 6 | **Actividades** | `tour-actividades` | ModuleActions | "Completa Comunidad, Desafío y Examen. Necesitas 80% para aprobar el módulo." (ya existe) |
| 7 | **Herramientas** | `tour-herramientas` | ToolTutorAccordion | "Accede al Sintetizador de Prompts, Advisor IA y Tutorías Virtuales. Herramientas para potenciar tu aprendizaje." |

---

## Archivos a modificar

### 1. `src/components/IALab/IALabTour.jsx` — Reemplazar STEPS array

```js
const STEPS = [
  {
    target: 'tour-sidebar',
    title: 'Panel de navegación',
    description: 'Tu centro de control. Monitorea tu progreso, navega entre módulos, accede a recursos y personaliza tu experiencia con el modo oscuro.',
  },
  {
    target: 'tour-tabs',
    title: 'Menú de secciones',
    description: 'Filtra el contenido del módulo activo: Objetivos, Contenido, Actividades y Herramientas. Cada pestaña muestra información específica.',
  },
  {
    target: 'tour-ruta',
    title: 'Tu ruta de hoy',
    description: 'Aquí encontrarás la próxima acción recomendada para avanzar en tu módulo. Sigue la ruta y no te detengas.',
  },
  {
    target: 'tour-objetivos',
    title: 'Objetivos del módulo',
    description: 'Cada módulo tiene un objetivo claro de aprendizaje. La nota se compone de: Comunidad (5%), Desafío (30%), Examen (35%) y Recursos (30%).',
  },
  {
    target: 'tour-temas',
    title: 'Temas del módulo',
    description: 'Cada tema contiene recursos multimedia (videos, PDFs, OVAs). Expande un tema y completa todos los recursos para avanzar.',
  },
  {
    target: 'tour-actividades',
    title: 'Actividades del módulo',
    description: 'Completa las 3 actividades (Comunidad, Desafío, Examen) para aprobar el módulo con 80% o más.',
  },
  {
    target: 'tour-herramientas',
    title: 'Herramientas + Tutorías',
    description: 'Sintetizador de Prompts, Advisor IA y Tutorías Virtuales. Potencia tu aprendizaje con estas herramientas interactivas.',
  },
];
```

### 2. `src/components/IALab/IALab.jsx` — Agregar `data-tour`

| Línea actual | Elemento | Agregar |
|-------------|----------|---------|
| 196 (sidebar contenedor) | `<div className="hidden lg:flex">` | `data-tour="tour-sidebar"` |
| 254 (tabs container) | `<div className="flex items-center gap-1.5...">` | `data-tour="tour-tabs"` |
| 295 (ModuleInfoSection wrapper) | `<div className="mt-4">` | `data-tour="tour-objetivos"` |
| 360 (ToolTutorAccordion wrapper) | `<div className="mt-5">` | `data-tour="tour-herramientas"` |

### 3. `src/components/IALab/IALabSidebar.jsx` — Sin cambios (el contenedor `aside` se envuelve en IALab.jsx)

---

## Resumen de cambios

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `IALabTour.jsx` | 4-19 | Reemplazar STEPS array con 7 pasos |
| `IALab.jsx` | 196 | Agregar `data-tour="tour-sidebar"` al contenedor del sidebar |
| `IALab.jsx` | 254 | Agregar `data-tour="tour-tabs"` al contenedor de tabs |
| `IALab.jsx` | 295 | Agregar `data-tour="tour-objetivos"` al contenedor de ModuleInfoSection |
| `IALab.jsx` | 360 | Agregar `data-tour="tour-herramientas"` al contenedor de ToolTutorAccordion |

## Funcionalidad preservada

- ✅ Tour se muestra 1 sola vez por usuario (localStorage `ialab_tour_completed`)
- ✅ Animación de spotlight sobre el elemento objetivo
- ✅ Tooltip con navegación "Siguiente / Saltar"
- ✅ Dismiss al hacer clic fuera
- ✅ Responsive (tooltip se re-posiciona si desborda la ventana)

# Fase 2 — Dashboard Mis Cursos

## Objetivo

Crear un dashboard "Mis Cursos y Certificados" accesible desde el item existente "Mis Certificados" en `UserDropdownMenuPremium`. Sin nuevos botones de navegación.

## Arquitectura

### Integración en Undermenu
- El item "Mis Certificados" existente abre un modal (Dialog shadcn/ui) con contenido de cursos + certificados
- No se agregan nuevos items al menú
- El modal reutiliza estilos de los modales existentes (Mi Perfil, Plan de Estudio)

### Componentes
1. **`UserCoursesDashboard.jsx`** (nuevo) — Componente principal del dashboard
   - Tabs: Todos / En Progreso / Completados
   - Grid de cards de cursos con datos del store
   - Sección de certificados
2. **Modificación de `UserDropdownMenuPremium.jsx`** — `handleCertificates` abre el modal
3. **Adaptación de `CourseCard.jsx`** existente — aceptar datos desde store en lugar de hardcoded

### Datos
- Cursos desde `landingPageData.js` (8 cursos, solo 1 activo por ahora)
- Progreso desde `useIALabStore` (gamificationSlice: xp, level, streaks, badges para el curso activo)
- Certificados desde store (storedCertificate o similar)
- Para cursos multi-curso futuro: store extiende `courseProgress` por courseId

## Mockup

```
┌─────────────────────────────────────────────────┐
│  Mis Cursos y Certificados                    ✕ │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ Todos ] [ En Progreso ] [ Completados ]      │
│                                                 │
│  ┌────────────────┐ ┌────────────────┐          │
│  │ IA Generativa  │ │ Prompt Eng.    │          │
│  │ ████████░░ 80% │ │ Coming Soon    │          │
│  │ XP: 1,250      │ │                │          │
│  │ Nivel 4        │ │                │          │
│  │ [Reanudar]     │ │ [Explorar]     │          │
│  └────────────────┘ └────────────────┘          │
│                                                 │
│  ─── Certificados Obtenidos ───                 │
│  ✓ Completaste: Introducción a la IA            │
│    [Ver Certificado]  [Compartir]               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Archivos

### Modificar
- `src/components/UserDropdownMenuPremium.jsx` — `handleCertificates` abre modal en lugar de navegar
- `src/components/IALab/CourseCard.jsx` — aceptar datos desde props/store (ya mayormente listo)

### Crear
- `src/components/IALab/UserCoursesDashboard.jsx` — componente principal del dashboard modal
- `src/components/IALab/CourseProgressCard.jsx` — card de curso con progreso (enhanced CourseCard)

## Criterios
- Build pasa sin errores
- Modal se abre desde "Mis Certificados" en undermenu
- Tabs filtran correctamente
- Curso activo muestra progreso real del store
- Cursos "coming-soon" muestran estado correspondiente
- Responsive (375px → 1440px)
- Sin nuevos botones en navegación

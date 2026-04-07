---
name: recipe-create-classroom-course
description: Creación de cursos en Google Classroom e invitación de estudiantes. Ideal para plataformas educativas y gestión de cursos.
license: MIT
compatibility: opencode
metadata:
  audience: educators
  workflow: education
  triggers:
    - classroom
    - google classroom
    - curso
    - educacion
    - estudiantes
  version: "0.22.5"
  openclaw:
    category: "recipe"
    domain: "education"
    requires:
      bins:
        - gws
      skills:
        - gws-classroom
---

# recipe-create-classroom-course

Create a Google Classroom course and invite students.

## When to use

Utiliza esta skill cuando necesites:

- **Crear un curso:** Establecer un nuevo curso en Google Classroom
- **Invitar estudiantes:** Agregar estudiantes al curso
- **Gestionar participantes:** Listar y administrar usuarios inscritos
- **Configurar secciones:** Definir períodos, salones, horarios

**Palabras clave que activan esta skill:** `classroom`, `google classroom`, `curso`, `educacion`, `estudiantes`

> **PREREQUISITO:** Esta skill requiere cargar primero la skill `gws-classroom` (Google Workspace) para ejecutar los comandos.

## Instructions

### Pasos para Crear un Curso

1. **Crear el curso:**
```bash
gws classroom courses create --json '{
  "name": "Introducción a la Programación",
  "section": "Período 1",
  "room": "Salón 101",
  "ownerId": "me"
}'
```

2. **Invitar un estudiante:**
```bash
gws classroom invitations create --json '{
  "courseId": "COURSE_ID",
  "userId": "estudiante@escuela.edu",
  "role": "STUDENT"
}'
```

3. **Listar estudiantes inscritos:**
```bash
gws classroom courses students list --params '{
  "courseId": "COURSE_ID"
}' --format table
```

### Configuración Adicional

| Campo | Descripción |
|-------|-------------|
| `name` | Nombre del curso |
| `section` | Sección o período |
| `room` | Número de salón |
| `descriptionHeading` | Encabezado de descripción |
| `description` | Descripción del curso |
| `room` | Ubicación física |

## Errores Comunes

| Problema | Solución |
|----------|----------|
| GWS no instalado | Verificar que `gws` CLI esté disponible |
| Permisos insuficientes | Verificar que la cuenta tenga permisos de docente |
| Curso no creado | Verificar formato JSON correcto |

## Véase También

- [Google Classroom API](https://developers.google.com/classroom)
- [GWS CLI Documentation](https://github.com/googleworkspace/cli)
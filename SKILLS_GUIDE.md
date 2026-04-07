# Edutechlife Skills - Guía de Referencia

## Descripción General

Este proyecto cuenta con **6 skills** configuradas para asistir en diferentes aspectos del desarrollo:

| # | Skill | Categoría | Prioridad |
|---|-------|-----------|-----------|
| 1 | `frontend-design` | Frontend | Alta |
| 2 | `shadcn-ui-setup` | Frontend | Alta |
| 3 | `clerk-setup` | Backend | Alta |
| 4 | `stripe-setup` | Pagos | Media |
| 5 | `ai-rag-pipeline` | IA | Media |
| 6 | `recipe-create-classroom-course` | Educación | Baja |

---

## Cómo Usar las Skills

Las skills se activan automáticamente cuando el agente detecta palabras clave en tu solicitud. También puedes cargarlas manualmente usando el comando:

```bash
skill({ name: "nombre-de-skill" })
```

---

## Lista de Skills con Triggers

### 1. frontend-design
**Uso:** Diseño de interfaces premium con Tailwind CSS, corrección de layouts y espacios muertos

**Triggers:** `ui`, `diseño`, `tailwind`, `estilos`, `layout`, `css`, `interfaz`

**Ejemplo:**
> "Diseña un botón premium con tailwind" → activa frontend-design
> "Corrige el espacio muerto en la tarjeta" → activa frontend-design

---

### 2. shadcn-ui-setup
**Uso:** Configuración de componentes Shadcn UI con soporte dark mode

**Triggers:** `shadcn`, `componentes`, `ui components`, `dark mode`, `tema`, `theme`

**Ejemplo:**
> "Agrega autenticación con Clerk" → activa clerk-setup
> "Configura pagos con Stripe" → activa stripe-setup

---

### 3. clerk-setup
**Uso:** Autenticación Clerk para proyectos web

**Triggers:** `auth`, `clerk`, `autenticacion`, `login`, `signup`, `usuario`

**Ejemplo:**
> "Agrega autenticación con Clerk" → activa clerk-setup

---

### 4. stripe-setup
**Uso:** Configuración de pagos Stripe para e-commerce

**Triggers:** `stripe`, `pago`, `payments`, `checkout`, `precio`, `producto`

**Ejemplo:**
> "Configura pagos con Stripe" → activa stripe-setup

---

### 5. ai-rag-pipeline
**Uso:** Pipelines RAG para investigación y fact-checking con IA

**Triggers:** `rag`, `research`, `busqueda`, `investigacion`, `pipeline`, `sources`, `ia`

**Ejemplo:**
> "Investiga sobre las últimas tendencias en IA" → activa ai-rag-pipeline

---

### 6. recipe-create-classroom-course
**Uso:** Creación de cursos en Google Classroom

**Triggers:** `classroom`, `google classroom`, `curso`, `educacion`, `estudiantes`

**Ejemplo:**
> "Crea un curso en Google Classroom" → activa recipe-create-classroom-course

---

## Ubicación de las Skills

Las skills están ubicadas en:
- **Local del proyecto:** `.agents/skills/<nombre>/SKILL.md`
- **Global (home):** `~/.agents/skills/<nombre>/SKILL.md`

---

## Configuración

El archivo `.opencode/skills-config.json` contiene la configuración centralizada de todas las skills con sus triggers, prioridades y categorías.

---

## Ejemplos de Uso por Proyecto

### Edutechlife Frontend
```bash
# Diseño de componente
"Diseña una Card premium con Tailwind" → frontend-design

# Componentes UI
"Agrega un Dialog con shadcn" → shadcn-ui-setup

# Autenticación
"Implementa login con Clerk" → clerk-setup

# Pagos
"Configura Stripe para cursos" → stripe-setup
```

### Investigación
```bash
# RAG Pipeline
"Investiga sobre tendencias en educación 2024" → ai-rag-pipeline
```

### Educación
```bash
# Google Classroom
"Crea un curso de programación" → recipe-create-classroom-course
```

---

## Notas Importantes

1. **Prioridad Alta:** Skills de uso frecuente en desarrollo diario
2. **Prioridad Media:** Skills para funcionalidades específicas
3. **Prioridad Baja:** Skills con dependencias externas o uso ocasional

---

## Recursos Adicionales

- [Documentación OpenCode Skills](https://open-code.ai/en/docs/skills)
- [Shadcn UI](https://ui.shadcn.com)
- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)
# Plan: Correcciones botones de temas - "Domina las Instrucciones"

## Problemas identificados

1. **Tema 3 icono vacio**: `fa-layer-group` no existe en el mapeo de iconos (iconMapping.jsx). No se renderiza.
2. **Eliminar Tema 4**: "Técnicas de Refinamiento" debe eliminarse del menu
3. **Quitar badge dificultad**: Eliminar badges de "Principiante/Intermedio"

## Cambios requeridos

### Archivo: ModuleOverviewCard.jsx

**Cambio 1: Actualizar moduleData.topics (lineas 36-61)**
- Cambiar icono del tema 3: `fa-layer-group` → `fa-sitemap`
- Eliminar tema 4 ("Técnicas de Refinamiento")
- Eliminar propiedad `difficulty` de todos los temas
- Actualizar stats: "4 Lecciones" → "3 Lecciones"

Nuevo array topics:
```javascript
topics: [
  { 
    title: "Introducción a la Inteligencia Artificial Generativa", 
    icon: "fa-brain", 
    resources: 2 
  },
  { 
    title: "¿Qué es un Prompt?", 
    icon: "fa-comments", 
    resources: 3 
  },
  { 
    title: "Estructura Básica de un Prompt Efectivo", 
    icon: "fa-sitemap", 
    resources: 3 
  }
]
```

**Cambio 2: Eliminar badge de dificultad del JSX (lineas 138-145)**
Eliminar este bloque:
```jsx
<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full...`}>
  <Icon name="fa-signal" className="w-3 h-3" />
  {tema.difficulty}
</span>
```

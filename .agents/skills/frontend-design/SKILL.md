---
name: frontend-design
description: Diseño de interfaces premium con Tailwind CSS, corrección de layouts y espacios muertos, aplicación de estilos corporativos Edutechlife (#004B63, #00BCD4). Útil para optimizar la UI de componentes React.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: frontend
  triggers:
    - ui
    - diseño
    - tailwind
    - estilos
    - layout
    - css
    - interfaz
---

# frontend-design

Especialista en UI/UX con Tailwind CSS y React para proyectos Edutechlife.

## When to use

Utiliza esta skill cuando necesites:

- **Diseño de componentes:** Crear botones, tarjetas, modales, formularios con estilos premium
- **Corrección de espacios:** Eliminar espacios muertos (white space) en layouts usando `h-fit`, `max-h-[500px]`, `items-start`
- **Aplicación de marca:** Usar colores corporativos Edutechlife (#004B63 Azul Petróleo, #00BCD4 Cyan)
- **Optimización de CSS:** Reemplazar clases de altura fija (`h-full`) porheight dinámica
- **Mejora visual:** Aplicar gradientes, glassmorphism, sombras y transiciones

**Palabras clave que activan esta skill:** `ui`, `diseño`, `tailwind`, `estilos`, `layout`, `css`, `interfaz`

## Instructions

### 1. Optimización de Altura

Localiza en el archivo `.jsx` las clases de altura fija que generen espacios vacíos:

```jsx
// ❌ Problema: espacios vacíos
<Card className="h-full flex flex-col">

// ✅ Solución: altura dinámica
<Card className="h-fit">
```

### 2. Corrección de Espacios Muertos

Aplica scroll dinámico en zonas de contenido:

```jsx
<div className="max-h-[500px] overflow-y-auto h-fit">
```

### 3. Alineación de Grid

Usa `items-start` para evitar que las tarjetas se estiren artificialmente:

```jsx
<div className="grid grid-cols-3 gap-6 items-start">
```

### 4. Branding Corporativo

- **Azul Petróleo (#004B63):** Bordes de énfasis, títulos, elementos principales
- **Cyan (#00BCD4):** Elementos interactivos, iconos, badges

```jsx
// Borde de énfasis corporativo
<Card className="border-t-4 border-[#004B63]">

// Iconos interactivos
<Icon name="fa-download" className="text-[#00BCD4]" />
```

## Ejemplo de Uso

**Solicitud:** "Corrige el espacio muerto en la Zona 2"

1. Localizar `h-full` → cambiar a `h-fit`
2. Agregar `max-h-[500px]` con `overflow-y-auto`
3. Verificar que el grid padre tenga `items-start`
4. Aplicar borde superior `#004B63` para consistencia

## Errores Comunes

| Problema | Solución |
|----------|----------|
| Tarjetas estiradas | Cambiar `h-full` por `h-fit` |
| Espacio vertical vacío | Usar `items-start` en el grid padre |
| Scroll too short | Aumentar `max-h-[500px]` |
| Colores inconsistentes | Usar `#004B63` para énfasis, `#00BCD4` para interactivos |
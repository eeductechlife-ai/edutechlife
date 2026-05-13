# Plan: Mejorar Sintetizador de Prompts - Acordeon cerrado por defecto

## Analisis del estado actual

El sintetizador de prompts esta en `ReactivePromptStation.jsx` y YA tiene un sistema de acordeon implementado:

- Linea 26: `const [isOpen, setIsOpen] = useState(true);` - Estado inicial: ABIERTO
- Linea 138-158: Header clickeable con toggle
- Linea 160: `{isOpen && (<>...</>)}` - Contenido condicional

El problema es que el estado inicial es `true` (abierto). El usuario quiere que este cerrado por defecto.

## Cambios requeridos

### 1. Cambiar estado inicial del acordeon principal
**Archivo:** ReactivePromptStation.jsx - Linea 26

**Antes:**
```javascript
const [isOpen, setIsOpen] = useState(true);
```

**Despues:**
```javascript
const [isOpen, setIsOpen] = useState(false);
```

### 2. Mejorar el header para indicar que es expandible
**Archivo:** ReactivePromptStation.jsx - Lineas 138-158

El header actual ya tiene un buen diseño con chevron que cambia. Solo necesitamos asegurarnos de que visualmente invite al usuario a hacer clic. Podemos agregar:
- Un badge indicador "Haz clic para expandir" cuando esta cerrado
- Mejorar el hover effect para indicar interactividad

### 3. Mantener el sub-acordeon de resultados
El sub-acordeon de resultados (linea 25, 335-416) ya funciona correctamente y se abre automaticamente cuando hay resultados generados. Esto debe mantenerse asi.

## Resultado esperado

- Sintetizador aparece como tarjeta compacta con solo el titulo y descripcion
- Usuario hace clic para expandir y ver el area de input
- Cuando genera un prompt, el sub-acordeon de resultados se abre automaticamente
- Estilo y diseno se mantienen identicos al actual

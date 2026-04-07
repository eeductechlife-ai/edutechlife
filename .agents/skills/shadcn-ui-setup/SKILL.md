---
name: shadcn-ui-setup
description: Configuración de componentes Shadcn UI con soporte dark mode, theme provider y variables CSS. Creación de componentes premium (Card, Button, Dialog) para proyectos React/Next.js.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: frontend
  triggers:
    - shadcn
    - componentes
    - ui components
    - dark mode
    - tema
    - theme
---

# shadcn-ui-setup

Configuración completa de Shadcn UI con soporte para dark mode y sistema de diseño corporativo.

## When to use

Utiliza esta skill cuando necesites:

- **Instalar componentes:** Agregar Button, Card, Dialog, Input, etc.
- **Configurar temas:** Implementar dark mode con next-themes
- **Definir variables CSS:** Crear tokens de diseño corporativo
- **Personalizar componentes:** Modificar estilos de componentes shadcn
- **Configurar Tailwind:** Integrar con tailwind.config.js

**Palabras clave que activan esta skill:** `shadcn`, `componentes`, `ui components`, `dark mode`, `tema`, `theme`

## Instructions

### 1. Instalación de Componentes

```bash
# Instalar componentes individually
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input

# O todos los componentes básicos
npx shadcn@latest init
```

### 2. Configuración de Theme Provider

Crea el archivo de configuración del tema:

```tsx
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 3. Variables CSS Corporativas

Define los tokens de diseño en tu CSS:

```css
/* styles/globals.css */
@layer base {
  :root {
    /* Colores Corporativos Edutechlife */
    --color-petroleum: #004B63;
    --color-corporate: #00BCD4;
    --color-mint: #66CCCC;
    
    /* Variables shadcn */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --primary: 195 100% 24%; /* #004B63 */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 187 100% 40%; /* #00BCD4 */
    --secondary-foreground: 0 0% 100%;
    
    --radius: 0.75rem;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

### 4. Integración en tailwind.config.js

```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petroleum: "#004B63",
        corporate: "#00BCD4",
        mint: "#66CCCC",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 5. Componentes Premium Card

Para crear un Card premium estilo Edutechlife:

```tsx
// components/ui/card.tsx
import { cn } from "@/lib/utils"

const Card = ({ className, children, ...props }) => (
  <div 
    className={cn(
      "rounded-2xl border border-slate-200 bg-white shadow-lg",
      "hover:shadow-xl transition-all duration-300",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export { Card }
```

## Errores Comunes

| Problema | Solución |
|----------|----------|
| Dark mode no funciona | Agregar `darkMode: ["class"]` en tailwind.config |
| Variables no se aplican | Importar CSS en `globals.css` antes de @tailwind |
| Componentes no responden | Verificar que `content` incluya todos los archivos |
| ThemeProvider error | Asegurar que sea `"use client"` |

## Véase También

- [Documentación Shadcn](https://ui.shadcn.com)
- [next-themes](https://github.com/pacocoursey/next-themes)
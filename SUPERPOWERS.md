# Superpowers - Guía de Uso para edutechlife

**Superpowers** es un conjunto de skills y metodologías que potencian Claude Code para desarrollo de software mediante subagentes coordinados, planificación inteligente y TDD.

## 🚀 Quick Start

Superpowers está instalado y configurado. Para activarlo en tus sesiones:

```bash
# Verificar que está instalado
claude plugin list | grep superpowers

# Los skills se activarán automáticamente según el contexto
```

---

## 📋 Metodología SPARC

Superpowers implementa la metodología **SPARC** (Specification → Pseudocode → Refinement → Code):

### 1. **Specification** - Entender requerimientos
- Hacer preguntas claras antes de codificar
- Documentar el "qué" antes del "cómo"
- Validar requisitos con el usuario

### 2. **Pseudocode** - Diseño del algoritmo
- Escribir lógica en pseudocódigo legible
- Dividir en pasos claros
- Validar enfoque antes de código

### 3. **Refinement** - Mejora iterativa
- Optimizar rendimiento
- Refactorizar duplicación
- Mejorar legibilidad

### 4. **Code** - Implementación con TDD
- Test-Driven Development (Red → Green → Refactor)
- Escribir tests primero
- Implementar funcionalidad mínima

---

## 🎯 Skills Disponibles

### `/sparc` - Metodología SPARC completa
Usa esto para tareas complejas que requieren diseño arquitectónico:

```
/sparc [descripción de la tarea]
```

**Ejemplo:**
```
/sparc Implementar autenticación con Supabase en la plataforma
```

### `/review` - Code Review automático
Revisa cambios antes de commit:

```
/review [opciones]
```

**Opciones:**
- `--fix` - Aplicar mejoras automáticamente
- `--comment` - Comentar hallazgos en PR

### `/qa` - Quality Assurance y Testing
Ejecuta tests y validaciones:

```
/qa [módulo o archivo]
```

### `/ship` - Deploy y Release
Prepara y despliega cambios:

```
/ship [descripción del release]
```

### `/browse` - Navegación y verificación
Navega a sitios web y extrae información:

```
/browse [URL]
```

---

## 🤖 Subagentes Coordinados

Superpowers coordina múltiples agentes automáticamente:

| Agente | Rol | Cuándo |
|--------|-----|--------|
| **researcher** | Explore codebase | Inicio de tarea compleja |
| **architect** | Diseña solución | Después de research |
| **coder** | Implementa | Arquitectura aprobada |
| **tester** | Escribe tests | Después de código |
| **reviewer** | Revisa calidad | Pre-commit |

**Los agentes se comunican automáticamente sin intervención del usuario.**

---

## 💡 Best Practices para edutechlife

### 1. **Para Nuevas Features**
```
Describe la feature → /sparc activará automáticamente
Se ejecutará: Specification → Design → Implementation → Tests → Review
```

### 2. **Para Bug Fixes**
```
Describe el bug → /review ayudará a identificar raíz
/qa validará la solución
```

### 3. **Para Refactoring**
```
/sparc [descripción del refactor]
Ejecutará validación de tests en cada paso
```

### 4. **Antes de Commits**
```
/review          # Revisa cambios
npm run build    # Verifica build
npm test         # Tests pasan
git commit       # Commitea con confianza
```

### 5. **Antes de Deployments**
```
/ship [versión o descripción]
Ejecutará smoke tests y validaciones
Preparará release notes
```

---

## 🔧 Configuración del Proyecto

La configuración de Superpowers está en:

```
.claude/superpowers.json
```

**Secciones principales:**

- **skills** - Qué skills están habilitados
- **workflow** - Flujo de trabajo (subagent-driven-development)
- **subagents** - Configuración de agentes
- **methodologyPhases** - Fases de SPARC

---

## 🎓 Workflow Recomendado para edutechlife

### Desarrollo de Nuevas Features

```
1. Usuario describe feature
   ↓
2. /sparc - Inicia especificación y diseño
   ├─ researcher: analiza contexto
   ├─ architect: diseña solución
   └─ Valida con usuario
   ↓
3. Implementación con TDD
   ├─ coder: escribe tests
   ├─ coder: implementa función mínima
   └─ refinement: optimiza
   ↓
4. /review - Revisa cambios
   ├─ reviewer: checkea calidad
   ├─ reviewer: seguridad
   └─ reviewer: performance
   ↓
5. Commit + Push
   ├─ npm run build
   ├─ npm test
   └─ git commit
   ↓
6. /ship - Deploy
   ├─ Validaciones finales
   ├─ Deploy a staging
   └─ Smoke tests
```

---

## 📊 Monitoreo y Logs

Para ver qué skills se ejecutan:

```bash
# Ver logs de la última sesión
tail -f /tmp/superpowers-session.log

# Ver ejecuciones de skills
tail -f ~/.claude/superpowers-activity.log
```

---

## 🐛 Troubleshooting

### Skills no se activan automáticamente
```bash
# Verificar que está instalado
claude plugin list | grep superpowers

# Reinicia la sesión
# (new session)
```

### Subagentes no se comunican
```bash
# Verificar que el daemon de Claude Flow está activo
npx @claude-flow/cli@latest daemon status

# Iniciar si no está
npx @claude-flow/cli@latest daemon start
```

### Performance lento
```bash
# Limpia cache de memoria
npx @claude-flow/cli@latest memory clear

# Limpia cache de hooks
rm ~/.claude/.hooks.cache
```

---

## 📚 Recursos Adicionales

- **Repositorio oficial:** https://github.com/obra/superpowers
- **Documentación:** https://github.com/obra/superpowers#readme
- **Comunidad:** https://github.com/obra/superpowers/discussions

---

## 🔗 Integración con edutechlife

Superpowers está especialmente configurado para:

- ✅ Desarrollo de features en **React** (frontend)
- ✅ APIs en **Node.js** (backend)
- ✅ Bases de datos con **Supabase**
- ✅ Deployments a **Vercel** + **Render**
- ✅ Testing con **Vitest** + **Jest**
- ✅ Code review con **ESLint** + **Prettier**

---

**Última actualización:** 2026-09-15  
**Superpowers Version:** latest (superpowers-marketplace)  
**Proyecto:** edutechlife

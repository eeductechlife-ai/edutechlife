# Superpowers Hooks - Automatización de Skills

Este archivo documenta los hooks que activan automáticamente skills de Superpowers según el contexto.

## 🎯 Hooks Configurados

### 1. **Session Start** - Inicializar Superpowers
**Cuándo:** Al comenzar una nueva sesión
**Acción:** Cargar configuración de Superpowers y mostrar status

```
- Verificar que Superpowers está instalado
- Cargar .claude/superpowers.json
- Inicializar subagentes coordinadores
- Mostrar skills disponibles
```

### 2. **UserPromptSubmit** - Detectar contexto de tarea
**Cuándo:** Antes de procesar mensaje del usuario
**Acciones automáticas:**

#### Detecta keywords: "design", "architecture", "how should"
→ **Activa `/sparc`** - Metodología SPARC completa
- researcher investiga
- architect diseña
- Valida con usuario

#### Detecta keywords: "bug", "issue", "broken", "error"
→ **Activa `/review`** - Code review y debugging
- Identifica raíz del problema
- Sugiere fixes
- Valida solución

#### Detecta keywords: "test", "coverage", "qa"
→ **Activa `/qa`** - Quality assurance
- Ejecuta test suite
- Verifica coverage
- Reporta issues

### 3. **PreEdit** - Antes de editar código
**Cuándo:** Antes de usar Edit o Write
**Acciones:**

```
- Verificar si es código de test
  → Aplicar SPARC si es nueva feature
  → Aplicar TDD si es bug fix

- Verificar si es código de producción
  → Ejecutar type check
  → Ejecutar lint pre-flight
```

### 4. **PostEdit** - Después de editar código
**Cuándo:** Después de Write o Edit
**Acciones:**

```
- Ejecutar npm run lint (auto-fix)
- Ejecutar npm run format
- Ejecutar tests locales si existe
- Reportar cambios a tester subagent
```

### 5. **PreCompact/SessionEnd** - Antes de finalizar
**Cuándo:** Antes de compactar o cerrar sesión
**Acciones:**

```
- reviewer: revisa cambios finales
- Genera ADR si cambios son significativos
- Sugiere commit message
- Valida todo está testeado
```

### 6. **Bash** - Antes de comando de shell
**Cuándo:** Antes de ejecutar comando bash
**Acciones:**

```
Detecta patrones:

- npm run build
  → Verifica build success
  → Reporta errores

- npm test
  → Verifica coverage
  → Reporta test failures

- git commit
  → Valida cambios con /review
  → Verifica tests pasen
  → Sugiere mensaje descriptivo

- npm run dev
  → Verifica puerto disponible
  → Inicia con live reload
```

---

## 🚀 Triggering Skills Manualmente

Aunque los hooks activan skills automáticamente, puedes invocarlos manualmente:

### SPARC Completo
```bash
/sparc [descripción de tarea compleja]
```
Ejecuta: Specification → Pseudocode → Refinement → Code

### Code Review
```bash
/review [--fix] [--comment]
```
Revisa cambios actuales

### Quality Assurance
```bash
/qa [módulo]
```
Ejecuta tests y validaciones

### Deploy/Ship
```bash
/ship [versión o descripción]
```
Prepara y despliega

### Browse/Navigate
```bash
/browse [URL]
```
Navega y extrae información

---

## 🔄 Workflow Automático Completo

Para una **nueva feature**:

```
1. User: "Quiero agregar login con Google"
   ↓
2. Hook detecta keywords → Activa /sparc
   ├─ researcher analiza codebase
   ├─ architect diseña con Supabase + Google OAuth
   ├─ Muestra plan para validación
   └─ User aprueba
   ↓
3. User: "Adelante con la implementación"
   ↓
4. Pre-Edit hook → Activa TDD
   ├─ tester: escribe tests de login
   ├─ coder: implementa función mínima
   ├─ Ejecuta npm test
   └─ Refactor: optimiza código
   ↓
5. Post-Edit hook → Lint + Format
   ├─ Auto-fix ESLint issues
   ├─ Auto-format con Prettier
   ├─ Ejecuta npm test nuevamente
   └─ Reporta éxito
   ↓
6. Pre-Commit hook → Code Review
   ├─ /review ejecuta
   ├─ reviewer identifica issues
   ├─ Aplica mejoras menores
   └─ Valida todo
   ↓
7. User: "git commit"
   ↓
8. Hook genera commit message descriptivo
   └─ ✓ Feature: Google OAuth login con tests completos
```

---

## 📊 Monitoreo de Hooks

Para ver qué hooks se ejecutan:

```bash
# Ver logs de hooks
tail -f ~/.claude/hooks.log

# Ver última ejecución de /sparc
tail -f ~/.claude/superpowers-sparc.log

# Ver hooks activos
cat .claude/superpowers-hooks.md
```

---

## ⚙️ Configuración de Hooks

Los hooks están integrados en:

```
.claude/settings.json → hooks section
.claude/superpowers.json → triggers
```

Para modificar triggers, edita `.claude/superpowers.json`:

```json
{
  "skills": {
    "sparc": {
      "triggerPatterns": ["design", "architecture", "how should we"],
      "enabled": true
    }
  }
}
```

---

## 🎯 Casos de Uso Específicos para edutechlife

### 1. Agregar Nueva Ruta API
```
Contexto: "Quiero agregar POST /api/assessment/submit"
→ Automáticamente ejecuta:
   - /sparc para diseño
   - TDD para tests
   - /review para validación
```

### 2. Hacer Bug Fix
```
Contexto: "El auth está fallando en mobile"
→ Automáticamente ejecuta:
   - /review para debug
   - /qa para tests
   - Validación post-fix
```

### 3. Refactor de Componente
```
Contexto: "Refactorizar VAKDiagnostico.jsx para mejor performance"
→ Automáticamente ejecuta:
   - /sparc para planificación
   - TDD con tests existentes
   - Performance benchmarks
   - /review final
```

### 4. Deploy a Producción
```
Contexto: "Hacer release v2.5"
→ Automáticamente ejecuta:
   - Validación completa
   - /ship con smoke tests
   - Release notes generation
```

---

## 🔧 Desactivar/Activar Hooks

Para desactivar un hook temporalmente:

```bash
# Editar .claude/superpowers.json
# Cambiar "enabled": true → "enabled": false
```

Para desactivar todos los hooks de Superpowers:

```bash
# En .claude/superpowers.json
"autoTriggerSkills": false
```

---

**Última actualización:** 2026-09-15  
**Estado:** Configurado y listo para usar  
**Proyecto:** edutechlife

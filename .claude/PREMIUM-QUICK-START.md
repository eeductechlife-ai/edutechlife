# 🚀 EdutechLife Premium - Quick Start Guide

## ✅ Lo Que Acabas de Instalar

### 1. **3 MCP Connectors** (Requieren autenticación)
- **Supabase** → Administración de base de datos, migraciones, SQL
- **Stripe** → Testing de pagos, facturas
- **GitHub** → PRs, issues, workflows

**Para autorizar (en terminal interactiva):**
```bash
claude mcp auth supabase
claude mcp auth stripe  
claude mcp auth github
```

### 2. **10+ Agent Skills**
Skills disponibles (úsalos con `/`):

| Skill | Comando | Para qué |
|-------|---------|----------|
| **Code Review** | `/code-review` | Revisiones de código multi-dimensional |
| **Performance** | *Agent* | Auditorías de Core Web Vitals |
| **Security** | *Agent* | Auditorías de seguridad |
| **Tests** | *Agent* | Estrategia de testing |
| **UI Engineering** | *Agent* | Accesibilidad & responsive design |

### 3. **6 Agentes Coordinados**
Para usar en tareas complejas:

```javascript
// Ejemplo: Auditoría de seguridad
Agent({
  subagent_type: "agent-skills:security-auditor",
  name: "security-lead",
  prompt: "Audita seguridad de OAuth. Busca: tokens en logs, validación de entrada, CORS."
})
```

## 🎯 Workflows Comunes

### Feature Nueva (Premium)
```
1. Especifica el requerimiento
2. /code-review especificación
3. Architect diseña
4. Coder implementa
5. Tester valida
6. Reviewer aprueba
7. /ship deploy
```
**Tiempo:** 1-2 horas

### Bug en Producción (Hotfix)
```
1. Diagnosticar
2. Coder fix
3. Tester valida
4. /ship deploy  
5. Security-audit post-deploy
```
**Tiempo:** 30-60 minutos

### Optimizar Dashboard
```
1. Architect (diseño caché)
2. Coder (implementar)
3. Perf-Lead (validar CWV)
4. /ship deploy
```
**Tiempo:** 2-3 horas

### Auditoría de Seguridad
```
1. Security-Lead (escaneo completo)
2. Revisar hallazgos
3. Coder (fix críticos)
4. Commit + deploy
```
**Tiempo:** 2-4 horas

## 📋 Comandos Rápidos

### Revisión de Código
```bash
/code-review                    # Revisar diff actual
/code-review --level ultra      # Deep review (cloud)
/code-review --fix              # Auto-fix issues
```

### Agentes
```bash
# Auditoría de seguridad
Agent({
  subagent_type: "agent-skills:security-auditor",
  prompt: "Audita [ARCHIVO]"
})

# Optimización de performance
Agent({
  subagent_type: "agent-skills:web-performance-auditor",
  prompt: "Audita performance de [COMPONENTE]"
})

# Tests
Agent({
  subagent_type: "agent-skills:test-engineer",
  prompt: "Escribe tests para [FEATURE]"
})
```

### Deploy Seguro
```bash
/ship                           # Deploy con verificación
npm run build && npm test       # Build + tests
```

## 🎓 Casos de Uso Reales

### Caso 1: OAuth Login Roto (Lo que acabamos de hacer)
```
✓ Diagnosticado problema de redirect_uri
✓ Corregido en backend (auth.js)
✓ Configurado en Google Cloud Console
✓ Resultado: Login funciona ✅

Próximo: Security-audit para validar tokens
```

### Caso 2: Dashboard IALab Lento
```
1. /code-review performance → identifica renders innecesarios
2. Agent web-perf-auditor → mide Core Web Vitals
3. Coder → implementa memoización + lazy loading
4. Deploy → verifica CWV mejorados
```

### Caso 3: Integrar Stripe
```
1. Architect → API design
2. Coder → implementar endpoints
3. Security-audit → validar PCI compliance
4. Tester → edge cases (rechazos, retries)
5. Deploy con smoke tests
```

## 📊 Gates de Calidad (Automáticos)

Cada cambio debe pasar:

```
✓ TypeScript (sin errores)
✓ ESLint (0 warnings)
✓ Tests (75%+ cobertura)
✓ Code Review (multi-dimensional)
✓ Security Scan (zero críticos)
✓ Performance Budgets:
  - Bundle < 200KB
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1
✓ Accessibility (WCAG 2.1 AA)
```

## 🚦 Cuándo Usar Qué

| Situación | Usa | Tiempo |
|-----------|-----|--------|
| Feature nueva clara | Architect + Coder | 1-2h |
| Bug en prod | Coder directo | 15-30m |
| Dashboard lento | Perf-Lead | 2h |
| Vulnerability | Security-Lead | 30m-1h |
| Baja cobertura tests | QA-Lead | 2-4h |
| Refactor grande | Squad (Arch+Code+Test+Review) | 4-8h |
| Cambio auth/seguridad | Security-Lead + Code-Review ultra | 1-2h |

## 💡 Tips para Máximo Impacto

### 1. **Especifica Bien**
Bueno:
```
"Implementar 2FA en login. Soportar TOTP, enviar emails. 
Usuarios pueden disablitar. Tomar <2 segundos."
```

Malo:
```
"Agregar 2FA"
```

### 2. **Usa el Agente Correcto**
- Performance lento? → `web-performance-auditor`
- Vulnerabilidad? → `security-auditor`
- Tests faltando? → `test-engineer`

### 3. **Revisa Siempre**
Incluso con agentes, `/code-review` antes de merge

### 4. **Mide Resultados**
Antes:
```
LCP: 3.2s, INP: 250ms, CLS: 0.15
```

Después:
```
LCP: 1.8s (-44%), INP: 120ms (-52%), CLS: 0.08 (-47%)
```

## 📞 Soporte

### MCPs (requieren autenticación)
```bash
# Terminal interactiva
claude mcp auth supabase
claude mcp auth stripe
claude mcp auth github
```

### Skills (ya disponibles)
```bash
# Ver documentación
/code-review --help
# O lee: ~/.claude/skills/agent-skills/*/README.md
```

### Agentes (úsalos directamente)
```javascript
Agent({
  subagent_type: "agent-skills:security-auditor",
  prompt: "...",
  name: "security-lead"
})
```

## 🎯 Tu Próximo Paso

**Elige una de estas opciones:**

### Opción A: Probar Agentes Ahora
```javascript
// Copia esto y ejecuta en próximo cambio:
Agent({
  subagent_type: "agent-skills:security-auditor",
  name: "security-audit",
  prompt: "Audita la seguridad de edutechlife-backend/src/routes/auth.js",
  run_in_background: true
})
```

### Opción B: Revisar Configuración
```bash
cat .claude/agents-config.md
```

### Opción C: Testear Performance
```bash
npm run build
# Luego: /code-review --performance
```

---

**¿Listo para nivel premium?** Usa estos tools en tu próxima tarea. 🚀

# EdutechLife - Agentes Coordinados Premium

## 🚀 Agentes Disponibles

### 1. **Equipo de Desarrollo (Development Squad)**
Para features nuevas con especificación clara:

```bash
# Usar cuando: Necesitas implementar una feature completa (front + back)
# Tiempo: 30-60 min por feature

SendMessage({
  to: "architect",
  message: "Diseña la arquitectura para [FEATURE]"
})
```

**Flujo:**
1. Arquitecto diseña → envía a coder
2. Coder implementa → envía a tester
3. Tester valida → envía a reviewer
4. Reviewer aprueba → ready to merge

### 2. **Equipo de Seguridad (Security Audit Squad)**
Para auditorías de seguridad post-cambios OAuth/auth:

```bash
# Usar cuando: Cambios en autenticación, datos sensibles, APIs
# Tiempo: 15-30 min

Agent({
  subagent_type: "agent-skills:security-auditor",
  name: "security-lead",
  prompt: "Audita la seguridad de [ARCHIVO]. Busca: inyección SQL, XSS, tokens en logs, CORS, validación de entrada."
})
```

### 3. **Equipo de Performance (Performance Optimization Squad)**
Para optimizaciones de dashboard/frontend:

```bash
# Usar cuando: Dashboard lento, bundle size alto, CWV malos
# Tiempo: 20-45 min

Agent({
  subagent_type: "agent-skills:web-performance-auditor",
  name: "perf-lead",
  prompt: "Audita performance de IALab Dashboard. Core Web Vitals, bundle size, renders innecesarios, lazy loading."
})
```

### 4. **Equipo de Pruebas (QA Squad)**
Para estrategia de tests y cobertura:

```bash
# Usar cuando: Nueva feature sin tests, baja cobertura
# Tiempo: 25-40 min

Agent({
  subagent_type: "agent-skills:test-engineer",
  name: "qa-lead",
  prompt: "Diseña tests para [FEATURE]. Cubre: happy path, edge cases, errores. Apunta a 75%+ cobertura."
})
```

## 📋 **Workflows Recomendados**

### Workflow A: Feature Completa (Premium)
```
Especificación → Arquitecto → Coder → Tester → Reviewer → Deploy
```
**Cuándo usar:** Features estratégicas, cambios en auth, APIs nuevas

### Workflow B: Bug Fix Rápido
```
Diagnóstico → Coder → Tester → Deploy
```
**Cuándo usar:** Bugs en producción, hotfixes

### Workflow C: Refactor Grande
```
Architect → Coder → Tester → Reviewer → Perf-Lead → Deploy
```
**Cuándo usar:** Reescrituras, optimizaciones, deuda técnica

### Workflow D: Audit Post-Deploy
```
Security-Lead → Perf-Lead → QA-Lead → Report
```
**Cuándo usar:** Después de despliegues en prod, cambios sensibles

## 🎯 **Casos de Uso Específicos**

### OAuth Login Roto (Lo que acabamos de hacer)
```
Investigación → Coder (fix) → Security-Lead (validar tokens) → Deploy
Tiempo: 45 min
```

### Optimizar Dashboard IALab
```
Architect (diseño caché) → Coder (implementar) → Perf-Lead (validar CWV) → Deploy
Tiempo: 2-3 horas
```

### Integrar Stripe Pagos
```
Architect (API design) → Coder (implementar) → Security-Lead (PCI compliance) → Tester (edge cases) → Deploy
Tiempo: 4-6 horas
```

### Migración Clerk → Supabase JWT (Completada)
```
Architect (estrategia) → Coder (implementar) → Security-Lead (validar) → Tester (cobertura) → Deploy
Tiempo: 6-8 horas
```

## 🔧 **Comandos Rápidos**

### Iniciar Squad de Desarrollo
```bash
/spawn-dev-squad "feature_name"
```

### Auditoría de Seguridad Rápida
```bash
/code-review --security --level ultra
```

### Verificar Performance
```bash
/code-review --performance --level high
```

### Deploy Seguro con Verificación
```bash
/ship --verify --smoke-test
```

## 📊 **Métricas de Calidad a Mantener**

| Métrica | Target | Status |
|---------|--------|--------|
| Test Coverage | ≥ 75% | ✓ Implementar |
| Bundle Size | < 200KB gzipped | ✓ Monitorear |
| LCP | ≤ 2.5s | ⚠️ Optimizar |
| INP | ≤ 200ms | ✓ Bien |
| CLS | ≤ 0.1 | ✓ Bien |
| Security Audit | Monthly | ✓ Implementar |
| Type Coverage | 100% | ✓ Mantener |

## 🚦 **Gate de Calidad Pre-Merge**

Todos los cambios deben pasar:

1. ✓ TypeScript/ESLint (sin errores)
2. ✓ Tests (75%+ cobertura)
3. ✓ Code Review (multi-dimensional)
4. ✓ Security Scan (zero critical)
5. ✓ Performance Check (budgets OK)
6. ✓ Accessibility (WCAG 2.1 AA)

## 📞 **Cuándo Usar Cada Agente**

| Problema | Agente | Urgencia | Tiempo |
|----------|--------|----------|--------|
| Feature nueva | Architect + Coder | Normal | 1-2h |
| Bug en prod | Coder + Tester | CRÍTICA | 15-30m |
| Performance lento | Perf-Lead | Alta | 1-2h |
| Vulnerabilidad | Security-Lead | CRÍTICA | 30m-1h |
| Baja cobertura tests | QA-Lead | Media | 2-4h |
| Refactor código | Architect + Coder | Baja | 4-8h |

---

**Próximo paso:** Usa `/spawn-dev-squad` para tu próxima feature

---
name: project-auto-optimizer
description: "🐢 Tortuga — Autonomous Self-Healing & Optimization Agent. Full-stack engineer + visual designer + architect. Runs 3x/day analyzing code, UI/UX, animations, architecture, performance, and security."
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: optimization
  triggers:
    - tortuga
    - optimizar
    - optimizacion
    - mejora
    - auto-heal
    - refactor
---

# 🐢 Tortuga — Autonomous Optimization Agent

Tortuga es tu ingeniero de software autónomo. Analiza la plataforma 3 veces al día (08:00, 13:00, 18:00) y aplica mejoras progresivas en código, UI/UX, animaciones, arquitectura, performance y seguridad.

**Filosofía:** "Slow is smooth, smooth is fast" — mejora constante sin romper nada.

## Activación

```bash
# Ejecución completa (análisis → plan → ejecutar → reporte)
tortuga

# Solo análisis (no escribe nada)
tortuga --analyze-only

# Generar plan y revisarlo antes de aplicar
tortuga --plan

# Aplicar cambios
npm run tortuga:apply -- --apply
```

## Skills Integradas

Tortuga carga automáticamente **~48 skills** del ecosistema:

- **Frontend (7):** frontend-design, ui-ux-pro-max, ui-ux-designer, shadcn-ui-setup, magic-ui, framer-motion-animator, spline-interactive
- **Arquitectura (1):** frontend-architecture
- **Backend/Auth (4):** clerk-setup, clerk-react-patterns, clerk-nextjs-patterns, neon-postgres
- **Pagos (1):** stripe-setup
- **API (1):** api-integration-specialist
- **IA (1):** ai-rag-pipeline
- **Educación (1):** recipe-create-classroom-course
- **Agentes (1):** agency-agents-ai-specialists
- **Avanzadas (30):** AgentDB, GitHub, Swarm, V3, SPARC, Pair-Programming, etc.
- **Superpowers (16):** Brainstorming, TDD, Debugging, Plans, etc.

## Seguridad — Recovery Vault

Cada ejecución crea:
1. `git tag tortuga/vault/YYYY-MM-DD-HHmm` — snapshot inmutable
2. `git branch tortuga/recovery-YYYY-MM-DD` — rama persistente

Para restaurar:
```bash
git checkout tortuga/vault/2026-07-04-0800
```

## Output

```
docs/tortuga/
├── analysis/     ← Reportes de análisis (solo lectura)
├── plans/        ← Planes de mejora
├── reports/      ← Reportes post-ejecución
├── vaults/       ← Registro de puntos de recuperación
└── history.json  ← Historial acumulado
```

## Configuración

Edita `config/tortuga.json` para ajustar:
- Horarios de ejecución
- Proyectos a analizar
- Skills a incluir/excluir
- Modo (auto/supervised/analyze-only)

## Dependencias

Tortuga instala **automáticamente** paquetes npm faltantes cuando una mejora los requiere. Si una mejora sugiere `framer-motion` y no está en `package.json`, Tortuga ejecuta `npm install framer-motion` automáticamente.

## Commits

Cada mejora genera un commit con metadata:
```
agent(tortuga): optimize src/components/IALabPanel.jsx
Skills: frontend-design, ui-ux-pro-max, framer-motion-animator
Improvement: ui-ux
Dependencies: framer-motion@^12.38.0
```

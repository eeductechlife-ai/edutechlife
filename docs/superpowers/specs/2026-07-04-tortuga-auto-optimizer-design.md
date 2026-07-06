# Tortuga — Agente de Optimización Autónoma

**Fecha:** 2026-07-04
**Estado:** Approved
**Versión:** 1.0.0

## Resumen

Tortuga es un agente de software autónomo que actúa como ingeniero full-stack, diseñador visual y arquitecto senior. Corre 3 veces al día (08:00, 13:00, 18:00) analizando la plataforma Edutechlife y aplicando mejoras progresivas en código, UI/UX, animaciones, arquitectura, performance y seguridad.

Siempre deja un **punto de recuperación** (vault) antes de tocar cualquier archivo.

## Arquitectura

```
.agents/skills/project-auto-optimizer/
├── SKILL.md                    ← Metadatos + instrucciones de activación
├── package.json                ← Dependencias
├── tsconfig.json               ← TypeScript para ts-node
├── .env.example                ← DEEPSEEK_API_KEY=
│
├── config/
│   └── tortuga.json            ← Config: horarios, proyectos, skills paths
│
├── core/
│   ├── skill-loader.ts         ← Escanea .agents/ + .claude/ + superpowers SKILL.md
│   ├── file-classifier.ts      ← Clasifica archivos por skills aplicables
│   ├── prompt-builder.ts       ← Construye prompt contextual multi-skill
│   └── response-parser.ts      ← Extrae código + dependencias sugeridas
│
├── phases/
│   ├── vault.ts                ← FASE 0: git tag + branch recovery
│   ├── analysis.ts             ← FASE 1: escanea + reporte solo-lectura
│   ├── planner.ts              ← FASE 2: plan de mejora priorizado
│   ├── executor.ts             ← FASE 3: aplicar cambios + validar + commit
│   └── reporter.ts             ← FASE 4: reporte final + stats
│
├── git/
│   └── git-manager.ts          ← Git isolation (simple-git)
│
├── validation/
│   └── validators.ts           ← Lint/test/build por proyecto
│
├── package/
│   └── package-manager.ts      ← Instalación automática de deps
│
├── logger/
│   └── logger.ts               ← Logger con colores + stats
│
└── index.ts                    ← Entry point
```

## Flujo de Ejecución

### FASE 0 — Vault (SIEMPRE primero)
- `git tag tortuga/vault/YYYY-MM-DD-HHmm`
- `git branch tortuga/recovery-YYYY-MM-DD`
- Log: "Vault created"

### FASE 1 — Análisis (solo lectura)
- Carga ~48 skills del ecosistema
- Escanea recursivamente `edutechlife-frontend/src` y `edutechlife-backend/src`
- Clasifica cada archivo por tipo y skills aplicables
- Envía a DeepSeek para análisis (sin escribir nada)
- Genera reporte: `docs/tortuga/analysis/YYYY-MM-DD-HHmm.md`

### FASE 2 — Plan
- Tortuga genera plan de mejora priorizado
- Cada mejora incluye: archivo, skills, dependencias, riesgo
- Se guarda en: `docs/tortuga/plans/YYYY-MM-DD-HHmm.md`

### FASE 3 — Ejecución Controlada
- Crea branch `tortuga/optimization/YYYY-MM-DD-HHmm`
- Por cada mejora: backup → aplicar → npm install → validar → commit o revert

### FASE 4 — Reporte
- `docs/tortuga/reports/YYYY-MM-DD-HHmm.md`
- Archivos mejorados, errores, skills usadas, deps instaladas

## Skills Integradas

### Capa 1 — Proyecto (.agents/skills/ — 17 skills)
frontend-design, ui-ux-pro-max, ui-ux-designer, framer-motion-animator,
frontend-architecture, shadcn-ui-setup, magic-ui, spline-interactive,
clerk-setup, clerk-react-patterns, clerk-nextjs-patterns, stripe-setup,
neon-postgres, api-integration-specialist, ai-rag-pipeline,
recipe-create-classroom-course, agency-agents-ai-specialists

### Capa 2 — Avanzado (.claude/skills/ — 30 skills)
AgentDB (5), GitHub (5), Swarm (2), V3 (9), SPARC, Stream-Chain,
Pair-Programming, Verification-Quality, ReasoningBank (2),
Hooks-Automation, Skill-Builder, Browser

### Capa 3 — Superpowers (OpenCode — 16 skills)
Brainstorming, TDD, Debugging, Writing-Plans, Executing-Plans,
Git-Worktrees, Subagent-Driven, Parallel-Agents, Code-Review (2),
Finishing-Branch, Verification, Find-Skills, Writing-Skills,
Customize-Opencode, Using-Superpowers

## Seguridad — Recovery Vault

Cada ejecución crea:
1. `git tag tortuga/vault/YYYY-MM-DD-HHmm` — tag inmutable del estado exacto
2. `git branch tortuga/recovery-YYYY-MM-DD` — branch persistente por día
3. Backup en buffer de cada archivo antes de modificarlo
4. Revert automático si validación falla

Para restaurar:
```bash
git checkout tortuga/vault/2026-07-04-0800    # Vuelve al estado exacto
git branch tortuga/recovery-2026-07-04         # O usa la rama persistente
```

## Activación

```bash
tortuga                    # Ejecución completa (alias)
npm run tortuga            # Via npm script
```

### Cron (3x/día)
```cron
0 8 * * * cd /path && npx ts-node .agents/skills/project-auto-optimizer/index.ts
0 13 * * * cd /path && npx ts-node .agents/skills/project-auto-optimizer/index.ts
0 18 * * * cd /path && npx ts-node .agents/skills/project-auto-optimizer/index.ts
```

## Output

```
docs/tortuga/
├── vaults/          ← Registro de puntos de recuperación
├── analysis/        ← Reportes solo-lectura
├── plans/           ← Planes de mejora
├── reports/         ← Reportes post-ejecución
└── history.json     ← Historial acumulado
```

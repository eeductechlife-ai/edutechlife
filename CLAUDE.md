# Ruflo — Claude Code Configuration

## Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation files unless explicitly requested
- NEVER save working files or tests to root — use `/src`, `/tests`, `/docs`, `/config`, `/scripts`
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- NEVER add a `Co-Authored-By` trailer to user commits unless this project's `.claude/settings.json` has `attribution.commit` set (#2078). The Claude Code Bash tool may suggest one in its default commit-message template — ignore it. `Co-Authored-By` is semantic authorship attribution under git/GitHub convention; the tool is the facilitator, not a co-author.
- Keep files under 500 lines
- Validate input at system boundaries

## Agent Comms (SendMessage-First Coordination)

Named agents coordinate via `SendMessage`, not polling or shared state.

```
Lead (you) ←→ architect ←→ developer ←→ tester ←→ reviewer
              (named agents message each other directly)
```

### Spawning a Coordinated Team

```javascript
// ALL agents in ONE message, each knows WHO to message next
Agent({ prompt: "Research the codebase. SendMessage findings to 'architect'.",
  subagent_type: "researcher", name: "researcher", run_in_background: true })
Agent({ prompt: "Wait for 'researcher'. Design solution. SendMessage to 'coder'.",
  subagent_type: "system-architect", name: "architect", run_in_background: true })
Agent({ prompt: "Wait for 'architect'. Implement it. SendMessage to 'tester'.",
  subagent_type: "coder", name: "coder", run_in_background: true })
Agent({ prompt: "Wait for 'coder'. Write tests. SendMessage results to 'reviewer'.",
  subagent_type: "tester", name: "tester", run_in_background: true })
Agent({ prompt: "Wait for 'tester'. Review code quality and security.",
  subagent_type: "reviewer", name: "reviewer", run_in_background: true })

// Kick off the pipeline
SendMessage({ to: "researcher", summary: "Start", message: "[task context]" })
```

### Patterns

| Pattern | Flow | Use When |
|---------|------|----------|
| **Pipeline** | A → B → C → D | Sequential dependencies (feature dev) |
| **Fan-out** | Lead → A, B, C → Lead | Independent parallel work (research) |
| **Supervisor** | Lead ↔ workers | Ongoing coordination (complex refactor) |

### Rules

- ALWAYS name agents — `name: "role"` makes them addressable
- ALWAYS include comms instructions in prompts — who to message, what to send
- Spawn ALL agents in ONE message with `run_in_background: true`
- After spawning: STOP, tell user what's running, wait for results
- NEVER poll status — agents message back or complete automatically

## Swarm & Routing

### Config
- **Topology**: hierarchical-mesh (anti-drift)
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

### Agent Routing

| Task | Agents | Topology |
|------|--------|----------|
| Bug Fix | researcher, coder, tester | hierarchical |
| Feature | architect, coder, tester, reviewer | hierarchical |
| Refactor | architect, coder, reviewer | hierarchical |
| Performance | perf-engineer, coder | hierarchical |
| Security | security-architect, auditor | hierarchical |

### When to Swarm
- **YES**: 3+ files, new features, cross-module refactoring, API changes, security, performance
- **NO**: single file edits, 1-2 line fixes, docs updates, config changes, questions

### 3-Tier Model Routing

| Tier | Handler | Use Cases |
|------|---------|-----------|
| 1 | Agent Booster (WASM) | Simple transforms — skip LLM, use Edit directly |
| 2 | Haiku | Simple tasks, low complexity |
| 3 | Sonnet/Opus | Architecture, security, complex reasoning |

## Memory & Learning

### Before Any Task
```bash
npx @claude-flow/cli@latest memory search --query "[task keywords]" --namespace patterns
npx @claude-flow/cli@latest hooks route --task "[task description]"
```

### After Success
```bash
npx @claude-flow/cli@latest memory store --namespace patterns --key "[name]" --value "[what worked]"
npx @claude-flow/cli@latest hooks post-task --task-id "[id]" --success true --store-results true
```

### MCP Tools (use `ToolSearch("keyword")` to discover)

| Category | Key Tools |
|----------|-----------|
| **Memory** | `memory_store`, `memory_search`, `memory_search_unified` |
| **Bridge** | `memory_import_claude`, `memory_bridge_status` |
| **Swarm** | `swarm_init`, `swarm_status`, `swarm_health` |
| **Agents** | `agent_spawn`, `agent_list`, `agent_status` |
| **Hooks** | `hooks_route`, `hooks_post-task`, `hooks_worker-dispatch` |
| **Security** | `aidefence_scan`, `aidefence_is_safe`, `aidefence_has_pii` |
| **Hive-Mind** | `hive-mind_init`, `hive-mind_consensus`, `hive-mind_spawn` |

### Background Workers

| Worker | When |
|--------|------|
| `audit` | After security changes |
| `optimize` | After performance work |
| `testgaps` | After adding features |
| `map` | Every 5+ file changes |
| `document` | After API changes |

```bash
npx @claude-flow/cli@latest hooks worker dispatch --trigger audit
```

## Agents

**Core**: `coder`, `reviewer`, `tester`, `planner`, `researcher`
**Architecture**: `system-architect`, `backend-dev`, `mobile-dev`
**Security**: `security-architect`, `security-auditor`
**Performance**: `performance-engineer`, `perf-analyzer`
**Coordination**: `hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`
**GitHub**: `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

Any string works as a custom agent type.

## @session-summary

### Completed
- **Phase 4B Refactoring**: Centralized MCP configs (20→1), tsconfigs (10→`.tsconfig/`), settings (`.claude/settings.json` → `settings/`), analytics images → `assets/`
- **Docs Reorganization**: Auth docs → `docs/auth/`, Reports → `docs/reports/`, Guides → `docs/guides/`, SQL → `sql/`
- **Deploy Pipeline**: `.github/workflows/deploy.yml` — 4 jobs:
  - `migrate-db` (Supabase CLI) → `deploy-backend` (Render hook); `deploy-frontend` (Vercel) corre en paralelo → `smoke-test`
  - **Estado real**: el workflow nunca completó una corrida exitosa (12/12 fallidas en `migrate-db`).
    Las migraciones 003–010 nunca se aplicaron: la base remota se construyó a mano con los scripts
    sueltos de `sql/` y `edutechlife-frontend/*.sql`, y quedó desalineada con `supabase/migrations/`.
    Producción la despliega la integración Git de Vercel, no este workflow.
  - `migrate-db` **sigue fallando**: las migraciones se reescribieron para tolerar el esquema real,
    pero esa reescritura vive sin fusionar en la rama `claude/gracious-mccarthy-9d023b` (commit `bea7ad0`)
    porque nunca se ha ejecutado contra una base de datos. Verificar en staging antes de fusionar:
    al entrar a `main`, el siguiente push corre `supabase db push` sobre producción.
  - No asumir que el CD funciona hasta verlo en verde.
- **SEO Prerendering**: Fixed SEO for SPA — implemented prerendering + meta tags dinámicos:
  - `src/components/SEO.jsx` — componente SEO con react-helmet-async
  - `HelmetProvider` en `main.jsx`
  - SEO agregado a 14 páginas públicas (title + description únicos por ruta)
  - `scripts/prerender.mjs` — prerender con puppeteer-core (Chrome local)
  - 11/16 rutas prerenderizadas con contenido real
  - `npm run build:full` para build + prerender
- **Responsive Web Design (F0–F5)**: auditoría completa con 4 subagentes (~40 hallazgos) + implementación:
  - F0: `base.css` overflow-x guard + text-size-adjust; Footer legal row wrap; Hero CTAs `px-6 sm:px-12`; `h-dvh` fallbacks (MobileDrawer, SmartBoard, loading skeleton)
  - F1: modales con scroll (`max-h-[90dvh] overflow-y-auto`): ExamResultViewer, LeadCapture, AdminLogin, UserMenu dropdown, UserDropdownMenuPremium; touch targets semáforo CF (`after:-inset-3`); headers de PDF/Resources con truncate + labels `hidden sm:inline`; Sidebar 400px→responsive
  - F2: barra Valeria — bottom-padding en `DiagnosticoVAK.jsx:87` + botones `top-[calc(env(safe-area-inset-top,0px)+76px)]` (safe-area-aware), slider oculto solo en <520px; `.pillar-tabs` flex-wrap; OVANavTabs wrap; skeleton `max-w-full`
  - F3: grids responsive (`grid-cols-1 sm:grid-cols-2`) en AutomationLeadCapture/ROICalculator, VAKInfoPanel; `infoGrid` documentStyles → `repeat(auto-fit, minmax(120px,1fr))`; `.caso-metrics`/`.modal-stats` media queries; AnalyticsDashboard flex-wrap; ModuleTopicAccordion `pl-4 md:pl-8`
  - F4: X buttons ≥44px (ContactModal, ModalContacto, HabeasDataModal, StudyPlanner, IALabForumCreatePost); `LandingPage.jsx` fallback dinámico `h-${h}` → mapa literal; LocaleSwitcher py-2.5
  - F5: `GlobalCanvas` sin blur/animación en táctil (`matchMedia('(pointer: coarse)')`); FloatingParticles ya tenía cap 25 móvil
  - Verificación: ESLint 0 errores, a11y 36/36, `vite build` OK (2m36s)

### Secrets (set)
- `SUPABASE_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_FRONTEND`, `RENDER_DEPLOY_HOOK`, `SMOKE_TEST_FRONTEND_URL`, `SMOKE_TEST_BACKEND_URL`

## Build & Test

- ALWAYS run tests after code changes
- ALWAYS verify build succeeds before committing

```bash
npm run build && npm test
```

## CLI Quick Reference

```bash
npx @claude-flow/cli@latest init --wizard           # Setup
npx @claude-flow/cli@latest swarm init --v3-mode     # Start swarm
npx @claude-flow/cli@latest memory search --query "" # Vector search
npx @claude-flow/cli@latest hooks route --task ""    # Route to agent
npx @claude-flow/cli@latest doctor --fix             # Diagnostics
npx @claude-flow/cli@latest security scan            # Security scan
npx @claude-flow/cli@latest performance benchmark    # Benchmarks
```

26 commands, 140+ subcommands. Use `--help` on any command for details.

## Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

**Agent tool** handles execution (agents, files, code, git). **MCP tools** handle coordination (swarm, memory, hooks). **CLI** is the same via Bash.

## GStack — Workflow & Browser Automation

### Web Browsing
- **ALWAYS use `/browse` skill from gstack for all web browsing**
- **NEVER use `mcp__claude-in-chrome__*` tools**
- `/browse` is optimized for navigation, verification, and data extraction
- Simpler, faster, and handles cache/auth correctly

### Available GStack Skills

| Skill | Purpose |
|-------|---------|
| `/browse` | Navigate websites, verify deployments, extract data |
| `/plan-ceo-review` | CEO-level strategic planning |
| `/plan-eng-review` | Engineering review & technical assessment |
| `/review` | Code and feature review |
| `/ship` | Deploy and release automation |
| `/qa` | Quality assurance testing |
| `/setup-browser-cookies` | Configure browser authentication |
| `/retro` | Retrospectives and team feedback |

### Installation

GStack is installed at `~/.claude/skills/gstack`. If missing, run:

```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack
./setup
```

### Usage Examples

```bash
# Browse a website
/browse https://edutechlife.co/ialab

# Review code changes
/review

# Plan deployment
/ship

# QA test a feature
/qa
```

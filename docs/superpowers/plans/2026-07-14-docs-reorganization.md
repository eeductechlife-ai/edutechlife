# Docs Reorganization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move 25 orphaned `.md`/`.sql` files from project root into `docs/{auth,deployment,reports,guides}/` and `sql/`, create `README.md` + `docs/INDEX.md`, preserving full git history.

**Architecture:** Pure file reorganization. `git mv` per category batch, no content changes to moved files. Two new index files for navigation. Zero impact on application code.

**Tech Stack:** bash, git

**Pre-flight check:** All files are git-tracked, zero are referenced in source code. No risk of broken imports.

---

### Task 1: Create target directories and new index files

**Files:**
- Create: `README.md`
- Create: `docs/INDEX.md`
- Create: `docs/auth/.gitkeep`
- Create: `docs/deployment/.gitkeep`
- Create: `docs/reports/.gitkeep`
- Create: `docs/guides/.gitkeep`

- [ ] **Step 1: Create directories**

```bash
mkdir -p docs/auth docs/deployment docs/reports docs/guides
touch docs/auth/.gitkeep docs/deployment/.gitkeep docs/reports/.gitkeep docs/guides/.gitkeep
```

- [ ] **Step 2: Create `docs/INDEX.md` — complete documentation map**

Write `/Users/home/Desktop/edutechlife/docs/INDEX.md`:

```markdown
# Edutechlife Documentation Index

## Corporate
- [ADN](EDUTECHLIFE-ADN.md) — Corporate identity
- [Complete Document](EDUTECHLIFE-COMPLETE.md) — Full corporate documentation
- [Corporate Document](EDUTECHLIFE-DOCUMENTO-CORPORATIVO.md)

## Auth & Security
Files in `docs/auth/`:
| File | Description |
|------|-------------|
| [CLERK-EMAIL-CONFIG.md](auth/CLERK-EMAIL-CONFIG.md) | Clerk email configuration |
| [CLERK-SETUP-GUIDE.md](auth/CLERK-SETUP-GUIDE.md) | Clerk setup guide |
| [CLERK_SUPABASE_INTEGRATION_GUIDE.md](auth/CLERK_SUPABASE_INTEGRATION_GUIDE.md) | Clerk + Supabase integration |
| [CONFIGURAR_CLERK_JWT_GUIA.md](auth/CONFIGURAR_CLERK_JWT_GUIA.md) | Clerk JWT config (ES) |
| [CONFIGURAR_SUPABASE_JWT_AHORA.md](auth/CONFIGURAR_SUPABASE_JWT_AHORA.md) | Supabase JWT config now (ES) |
| [CONFIGURAR_SUPABASE_JWT_GUIA.md](auth/CONFIGURAR_SUPABASE_JWT_GUIA.md) | Supabase JWT guide (ES) |
| [MIGRACION_CLERK_SUPABASE_JWT.md](auth/MIGRACION_CLERK_SUPABASE_JWT.md) | Clerk→Supabase JWT migration |
| [RESUMEN_FIX_AUTHCONTEXT.md](auth/RESUMEN_FIX_AUTHCONTEXT.md) | AuthContext fix summary |

## Deployment
Files in `docs/deployment/`:
| File | Description |
|------|-------------|
| [DEPLOYMENT.md](deployment/DEPLOYMENT.md) | Deployment instructions |
| [EJECUTAR_SQL_AHORA.md](deployment/EJECUTAR_SQL_AHORA.md) | Execute SQL now (ES) |
| [EJECUTAR_SQL_PASO_A_PASO.md](deployment/EJECUTAR_SQL_PASO_A_PASO.md) | SQL step-by-step (ES) |
| [INSTRUCCIONES_EJECUCION.md](deployment/INSTRUCCIONES_EJECUCION.md) | Execution instructions (ES) |
| [create-student-grades-instructions.md](deployment/create-student-grades-instructions.md) | Student grades instructions |

## Reports & Progress
Files in `docs/reports/`:
| File | Description |
|------|-------------|
| [FASE3_COMPLETADA.md](reports/FASE3_COMPLETADA.md) | Phase 3 completion report (ES) |
| [FASE3_OPTIMIZADA.md](reports/FASE3_OPTIMIZADA.md) | Phase 3 optimization (ES) |
| [PLAN_MEJORA_SEGURIDAD_DX_COMPETITIVIDAD.md](reports/PLAN_MEJORA_SEGURIDAD_DX_COMPETITIVIDAD.md) | Security & competitiveness plan (ES) |
| [README_PREMIUM_INTEGRATION.md](reports/README_PREMIUM_INTEGRATION.md) | Premium integration guide |
| [RESUMEN_PROGRESO.md](reports/RESUMEN_PROGRESO.md) | Progress summary (ES) |
| [resumen-refactorizacion-modales.md](reports/resumen-refactorizacion-modales.md) | Modal refactor summary (ES) |
| [resumen-refactorizacion-visual.md](reports/resumen-refactorizacion-visual.md) | Visual refactor summary (ES) |

## Guides
Files in `docs/guides/`:
| File | Description |
|------|-------------|
| [SKILLS_GUIDE.md](guides/SKILLS_GUIDE.md) | AI agent skills guide |

## Database
Files in `../sql/`:
| File | Description |
|------|-------------|
| [IALAB_PREMIUM_SAAS_SCHEMA.sql](../sql/IALAB_PREMIUM_SAAS_SCHEMA.sql) | Premium SaaS schema |
| [IALAB_PREMIUM_SCHEMA_ADAPTADO.sql](../sql/IALAB_PREMIUM_SCHEMA_ADAPTADO.sql) | Premium adapted schema |
| [create_student_grades_table.sql](../sql/create_student_grades_table.sql) | Student grades table |

See also `../sql/` for additional migration and utility scripts.

## Superpowers
See `superpowers/` for planning and specification documents:
- [Plans](superpowers/plans/) — 12 implementation plans
- [Specs](superpowers/specs/) — 20 design specifications

## Tortuga
See `tortuga/reports/` for autonomous optimization reports.
```

- [ ] **Step 3: Create README.md at project root**

Write `/Users/home/Desktop/edutechlife/README.md`:

```markdown
# Edutechlife

Plataforma educativa inteligente con diagnóstico VAK, tutores IA, gamificación y más.

## Structure

```
edutechlife/
├── edutechlife-frontend/    — React + Vite frontend (SPA)
├── edutechlife-backend/     — Backend services
├── docs/                    — Documentation
│   ├── INDEX.md             ← START HERE
│   ├── auth/                — Auth setup guides
│   ├── deployment/          — Deployment instructions
│   ├── reports/             — Progress reports
│   ├── guides/              — Configuration guides
│   ├── superpowers/         — Planning & spec documents
│   └── tortuga/             — Auto-optimization reports
├── sql/                     — Database migrations & scripts
├── supabase/                — Supabase config & functions
└── scripts/                 — Automation scripts
```

## Quick Start

See `docs/deployment/DEPLOYMENT.md` for setup instructions.

## Documentation

All documentation is organized under `docs/`. Start at `docs/INDEX.md` for the full map.
```

- [ ] **Step 4: Verify and commit**

```bash
git add -A
git status  # Verify: new dirs, README.md, docs/INDEX.md, .gitkeep files
git commit -m "docs: create directory structure and index files for docs reorganization"
```

---

### Task 2: Move SQL files to `sql/`

**Files:**
- Move: `IALAB_PREMIUM_SAAS_SCHEMA.sql` → `sql/`
- Move: `IALAB_PREMIUM_SCHEMA_ADAPTADO.sql` → `sql/`
- Move: `create_student_grades_table.sql` → `sql/`

- [ ] **Step 1: git mv SQL files**

```bash
cd /Users/home/Desktop/edutechlife
git mv IALAB_PREMIUM_SAAS_SCHEMA.sql sql/
git mv IALAB_PREMIUM_SCHEMA_ADAPTADO.sql sql/
git mv create_student_grades_table.sql sql/
```

- [ ] **Step 2: Verify movements**

```bash
git status  # Should show 3 renamed files
ls sql/     # Verify files present
```

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: move SQL schema files from root to sql/"
```

---

### Task 3: Move auth/security docs to `docs/auth/`

**Files:**
- Move: `CLERK-EMAIL-CONFIG.md` → `docs/auth/`
- Move: `CLERK-SETUP-GUIDE.md` → `docs/auth/`
- Move: `CLERK_SUPABASE_INTEGRATION_GUIDE.md` → `docs/auth/`
- Move: `CONFIGURAR_CLERK_JWT_GUIA.md` → `docs/auth/`
- Move: `CONFIGURAR_SUPABASE_JWT_AHORA.md` → `docs/auth/`
- Move: `CONFIGURAR_SUPABASE_JWT_GUIA.md` → `docs/auth/`
- Move: `MIGRACION_CLERK_SUPABASE_JWT.md` → `docs/auth/`
- Move: `RESUMEN_FIX_AUTHCONTEXT.md` → `docs/auth/`

- [ ] **Step 1: git mv auth files**

```bash
cd /Users/home/Desktop/edutechlife
git mv CLERK-EMAIL-CONFIG.md docs/auth/
git mv CLERK-SETUP-GUIDE.md docs/auth/
git mv CLERK_SUPABASE_INTEGRATION_GUIDE.md docs/auth/
git mv CONFIGURAR_CLERK_JWT_GUIA.md docs/auth/
git mv CONFIGURAR_SUPABASE_JWT_AHORA.md docs/auth/
git mv CONFIGURAR_SUPABASE_JWT_GUIA.md docs/auth/
git mv MIGRACION_CLERK_SUPABASE_JWT.md docs/auth/
git mv RESUMEN_FIX_AUTHCONTEXT.md docs/auth/
```

- [ ] **Step 2: Verify and commit**

```bash
git status  # 8 renamed files
ls docs/auth/  # Verify all present
git commit -m "docs: move auth/security documentation to docs/auth/"
```

---

### Task 4: Move deployment/operations docs to `docs/deployment/`

**Files:**
- Move: `DEPLOYMENT.md` → `docs/deployment/`
- Move: `EJECUTAR_SQL_AHORA.md` → `docs/deployment/`
- Move: `EJECUTAR_SQL_PASO_A_PASO.md` → `docs/deployment/`
- Move: `INSTRUCCIONES_EJECUCION.md` → `docs/deployment/`
- Move: `create-student-grades-instructions.md` → `docs/deployment/`

- [ ] **Step 1: git mv deployment files**

```bash
cd /Users/home/Desktop/edutechlife
git mv DEPLOYMENT.md docs/deployment/
git mv EJECUTAR_SQL_AHORA.md docs/deployment/
git mv EJECUTAR_SQL_PASO_A_PASO.md docs/deployment/
git mv INSTRUCCIONES_EJECUCION.md docs/deployment/
git mv create-student-grades-instructions.md docs/deployment/
```

- [ ] **Step 2: Verify and commit**

```bash
git status
ls docs/deployment/
git commit -m "docs: move deployment/operations docs to docs/deployment/"
```

---

### Task 5: Move reports/progress docs to `docs/reports/`

**Files:**
- Move: `FASE3_COMPLETADA.md` → `docs/reports/`
- Move: `FASE3_OPTIMIZADA.md` → `docs/reports/`
- Move: `PLAN_MEJORA_SEGURIDAD_DX_COMPETITIVIDAD.md` → `docs/reports/`
- Move: `README_PREMIUM_INTEGRATION.md` → `docs/reports/`
- Move: `RESUMEN_PROGRESO.md` → `docs/reports/`
- Move: `resumen-refactorizacion-modales.md` → `docs/reports/`
- Move: `resumen-refactorizacion-visual.md` → `docs/reports/`

- [ ] **Step 1: git mv report files**

```bash
cd /Users/home/Desktop/edutechlife
git mv FASE3_COMPLETADA.md docs/reports/
git mv FASE3_OPTIMIZADA.md docs/reports/
git mv PLAN_MEJORA_SEGURIDAD_DX_COMPETITIVIDAD.md docs/reports/
git mv README_PREMIUM_INTEGRATION.md docs/reports/
git mv RESUMEN_PROGRESO.md docs/reports/
git mv resumen-refactorizacion-modales.md docs/reports/
git mv resumen-refactorizacion-visual.md docs/reports/
```

- [ ] **Step 2: Verify and commit**

```bash
git status
ls docs/reports/
git commit -m "docs: move reports and progress docs to docs/reports/"
```

---

### Task 6: Move guides to `docs/guides/`

**Files:**
- Move: `SKILLS_GUIDE.md` → `docs/guides/`

- [ ] **Step 1: git mv guide files**

```bash
cd /Users/home/Desktop/edutechlife
git mv SKILLS_GUIDE.md docs/guides/
```

- [ ] **Step 2: Verify and commit**

```bash
git status
ls docs/guides/
git commit -m "docs: move skills guide to docs/guides/"
```

---

### Task 7: Final verification

- [ ] **Step 1: Confirm root is clean**

```bash
cd /Users/home/Desktop/edutechlife
ls *.md *.sql 2>/dev/null
# Should ONLY show: CLAUDE.md  README.md
```

- [ ] **Step 2: Verify git history preserved**

```bash
git log --oneline --follow sql/IALAB_PREMIUM_SAAS_SCHEMA.sql
git log --oneline --follow docs/auth/CLERK-SETUP-GUIDE.md
git log --oneline --follow docs/reports/FASE3_COMPLETADA.md
# Each should show history from before the move
```

- [ ] **Step 3: Verify git status is clean**

```bash
git status
# Should show: nothing to commit, working tree clean
```

- [ ] **Step 4: Verify frontend build still works**

```bash
cd /Users/home/Desktop/edutechlife/edutechlife-frontend
npx vite build --logLevel error
# Should: succeed with no errors
```

- [ ] **Step 5: Final commit with summary**

```bash
cd /Users/home/Desktop/edutechlife
git add -A
git commit -m "docs: reorganize root documentation into docs/{auth,deployment,reports,guides}/ and sql/

- 22 .md files moved to docs/ with category structure
- 3 .sql files moved to sql/
- Created README.md at root
- Created docs/INDEX.md as documentation map
- CLAUDE.md preserved at root
- git mv preserves full history
- Zero functionality changes"
```

## Success Criteria

1. `ls *.md` at root shows only `CLAUDE.md` and `README.md`
2. `ls *.sql` at root shows nothing
3. `git log --follow` on any moved file shows full history
4. `npx vite build` succeeds with no errors
5. `docs/INDEX.md` contains links to all 25 moved files in their new locations
6. `README.md` at root provides project overview and doc navigation

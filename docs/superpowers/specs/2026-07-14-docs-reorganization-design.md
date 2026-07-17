# Docs Reorganization Design

> **Date:** 2026-07-14
> **Status:** Approved
> **Goal:** Clean up 25 orphaned `.md`/`.sql` files from project root into proper directories without altering functionality.

## Current State

25 files (22 `.md` + 3 `.sql`) at project root, 5,747 total lines. All tracked in git, **none referenced** by any application source code. Existing `docs/` and `sql/` directories already hold organized documentation and scripts.

### Root files inventory

| Category | Files | Lines |
|----------|-------|-------|
| Auth/Security | 8 `.md` (Clerk, Supabase JWT) | 1,546 |
| Deployment/Operations | 5 `.md` (deploy, SQL instructions) | 930 |
| Reports/Progress | 7 `.md` (phases, progress, refactors) | 1,872 |
| Guides | 2 `.md` (skills, config) | 277 |
| SQL Scripts | 3 `.sql` (schemas, migrations) | 1,370 |
| **AI Config (keep)** | **CLAUDE.md** | **176** |
| **Total** | **25 files** | **5,747** |

## Target Structure

```
edutechlife/
├── CLAUDE.md                         ← KEPT (AI agent config)
├── README.md                         ← NEW (project overview + doc index)
│
├── docs/
│   ├── INDEX.md                      ← NEW (documentation map)
│   ├── auth/                         ← 8 auth .md files
│   ├── deployment/                   ← 5 deployment .md files
│   ├── reports/                      ← 7 progress/report .md files
│   ├── guides/                       ← 2 guide .md files
│   ├── superpowers/                  ← UNCHANGED (12 plans + 20 specs)
│   └── tortuga/                      ← UNCHANGED (reports)
│
└── sql/                              ← +3 .sql files (existing 12 + new 3)
```

## Approach

### Movement strategy
- `git mv` for every file (preserves full git history)
- No content changes to moved files
- Batch into logical categories for focused commits

### New files
1. `README.md` — project root overview with documentation directory map
2. `docs/INDEX.md` — detailed documentation index by category

### What stays unchanged
- `CLAUDE.md` in root (required by Claude Code)
- `docs/superpowers/` (planning/spec files)
- `docs/tortuga/` (optimization reports)
- All existing `sql/` content
- All application source code (no imports/routes change)

## Execution Plan

See `docs/superpowers/plans/2026-07-14-docs-reorganization.md` for the implementation plan.

## Verification

1. `git status` — confirm only expected moves and new files
2. `git log --follow` on any moved file — confirm history preserved
3. Build check (`npx vite build`) — confirm no regressions
4. CI check — all tests must pass

# IALab Multi-Module Challenge System

## Goal
Replace the generic single-type challenge (prompt engineering) with unique, theme-aligned challenges for each IALab module (1–5), keeping Valerio narration, bilingual ES/EN, DeepSeek evaluation, and the existing security/auto-save infrastructure.

## Architecture

```
IALabEvaluationModalPremium (wrapper, passes moduleId + locale)
  └── IALabEvaluationModal (routes to correct steps by moduleId)
       ├── Step 0: ValerioChallengeIntro (narrator, new)
       ├── Steps 1..N: module-specific step components
       └── Results step (shared, existing)
```

- `useIALabEvaluation(moduleId, locale)` → uses `MODULE_EVALUATION_CONFIG[moduleId]` for per-module generators/evaluators/fallbacks
- Each module's step components live in `challenges/moduleN/`
- `ValerioChallengeIntro` is a shared component for the narrated intro step

## Module Challenge Designs

| Module | Theme | Steps | Interaction Types |
|--------|-------|-------|-------------------|
| 1 | Prompts (existing) | 3 | Drag-drop, textarea, builder |
| 2 | ChatGPT | 3 | MCQ + justification, constructor visual, JSON editor |
| 3 | Gemini | 4 | Input guiado, galería fuentes, card-sort, editor secciones |
| 4 | NotebookLM | 3 | Selector fuentes, mapa conexiones, editor guión |
| 5 | Ética IA | 3 | Caso interactivo + MCQ, árbol análisis, constructor protocolo |

## Key Design Decisions

1. **Per-module step components**: Each module has its own folder with step files. No shared step components across modules (max flexibility).
2. **Step 0 shared**: `ValerioChallengeIntro` is reused across all modules with per-module intro texts.
3. **Evaluation**: DeepSeek API for all modules. Each module has a unique generation prompt and evaluation prompt.
4. **Fallback**: Hardcoded bilingual exercises per module if DeepSeek is unavailable.
5. **Security**: Existing anti-cheat/screenshot protection reused for all modules.
6. **Auto-save**: Existing draft system reused (stores per-module drafts).
7. **Bilingual**: All UI strings via `t()`, all Valerio intros bilingual.

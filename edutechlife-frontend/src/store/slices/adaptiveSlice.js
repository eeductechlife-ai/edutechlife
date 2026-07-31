/**
 * adaptiveSlice — Sistema de aprendizaje adaptativo (Spaced Repetition + Error Diagnosis)
 *
 * PROPÓSITO: Personalizar la experiencia educativa sin modificar el flujo existente.
 * ADITIVO: No reemplaza gamification/progress/lesson slices — los complementa.
 *
 * Estado:
 *   - viewHistory:      Historial de vistas por OVA/lección (para SRS)
 *   - reviewSchedule:   Items programados para repaso (Leitner box 1-5)
 *   - errorPatterns:    Diagnóstico de errores repetidos por concepto
 *   - learningPace:     Ritmo del usuario ('slow' | 'normal' | 'fast')
 *   - lastRecommendation: Cache de última recomendación calculada
 *
 * Sistema Leitner (Spaced Repetition):
 *   Box 1: Revisar en 1 día    (acabaste de aprender)
 *   Box 2: Revisar en 3 días   (bien)
 *   Box 3: Revisar en 7 días   (dominado parcialmente)
 *   Box 4: Revisar en 14 días  (bien retenido)
 *   Box 5: Revisar en 30 días  (dominado)
 *
 * @see ROADMAP_FUNCIONALIDAD_PEDAGOGICA.md — Sprint 2
 */

import { scopedKey } from "@/utils/userScopedStorage";

const STORAGE_KEY = "ialab_adaptive_v1";

// Intervalos Leitner en días (índice = box - 1)
const LEITNER_INTERVALS_DAYS = [1, 3, 7, 14, 30];

// Cargar datos persistidos con fallback safe
const loadPersisted = () => {
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(scopedKey(STORAGE_KEY))
        : null;
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

// Persistir con fallback silencioso
const persist = (data) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(scopedKey(STORAGE_KEY), JSON.stringify(data));
    }
  } catch {
    // Silent fail — no bloqueamos UX si storage falla
  }
};

const initial = loadPersisted();

export const createAdaptiveSlice = (set, get) => ({
  // ═══════════════════════════════════════════════════════════
  // ESTADO
  // ═══════════════════════════════════════════════════════════
  viewHistory: initial.viewHistory || [],
  reviewSchedule: initial.reviewSchedule || [],
  errorPatterns: initial.errorPatterns || [],
  learningPace: initial.learningPace || "normal",
  lastRecommendation: initial.lastRecommendation || null,

  // ═══════════════════════════════════════════════════════════
  // ACCIONES
  // ═══════════════════════════════════════════════════════════

  /**
   * Registrar vista de un OVA/lección
   * @param {string} itemId - ID único (ej: 'biasLab', 'moduleId-lessonN')
   * @param {object} meta - { type: 'ova'|'lesson'|'quiz', score?: number, timeSpent?: number }
   */
  recordView: (itemId, meta = {}) => {
    if (!itemId) return;

    set((state) => {
      const entry = {
        itemId,
        timestamp: Date.now(),
        type: meta.type || "ova",
        score: typeof meta.score === "number" ? meta.score : null,
        timeSpent: typeof meta.timeSpent === "number" ? meta.timeSpent : null,
      };

      // Mantener últimas 200 entradas para no llenar storage
      const viewHistory = [...state.viewHistory, entry].slice(-200);

      const nextState = { ...state, viewHistory };
      persist({
        viewHistory,
        reviewSchedule: state.reviewSchedule,
        errorPatterns: state.errorPatterns,
        learningPace: state.learningPace,
        lastRecommendation: state.lastRecommendation,
      });
      return { viewHistory };
    });
  },

  /**
   * Programar un item para revisión (Leitner box)
   * @param {string} itemId
   * @param {number} box - 1 a 5 (1 = revisar pronto, 5 = dominado)
   */
  scheduleReview: (itemId, box = 1) => {
    if (!itemId) return;
    const safeBox = Math.max(1, Math.min(5, Math.floor(box)));
    const intervalDays = LEITNER_INTERVALS_DAYS[safeBox - 1];
    const dueAt = Date.now() + intervalDays * 24 * 60 * 60 * 1000;

    set((state) => {
      // Reemplazar si ya existe, agregar si no
      const filtered = state.reviewSchedule.filter((r) => r.itemId !== itemId);
      const reviewSchedule = [
        ...filtered,
        { itemId, box: safeBox, dueAt, scheduledAt: Date.now() },
      ];

      persist({
        viewHistory: state.viewHistory,
        reviewSchedule,
        errorPatterns: state.errorPatterns,
        learningPace: state.learningPace,
        lastRecommendation: state.lastRecommendation,
      });
      return { reviewSchedule };
    });
  },

  /**
   * Marcar review como completado — promociona al siguiente box
   * @param {string} itemId
   * @param {'correct'|'incorrect'} outcome
   */
  completeReview: (itemId, outcome = "correct") => {
    const { reviewSchedule, scheduleReview } = get();
    const item = reviewSchedule.find((r) => r.itemId === itemId);
    if (!item) return;

    // Correcto: promociona (Box 1 → 2 → 3 → ...)
    // Incorrecto: baja a Box 1 (reset)
    const newBox = outcome === "correct" ? Math.min(item.box + 1, 5) : 1;

    scheduleReview(itemId, newBox);
  },

  /**
   * Registrar error de un usuario (diagnosis)
   * @param {string} conceptId - ej: 'transformer-attention', 'prompt-role-play'
   * @param {string} misunderstanding - Descripción corta
   */
  recordError: (conceptId, misunderstanding = "") => {
    if (!conceptId) return;

    set((state) => {
      const existing = state.errorPatterns.find(
        (e) => e.conceptId === conceptId,
      );
      let errorPatterns;

      if (existing) {
        errorPatterns = state.errorPatterns.map((e) =>
          e.conceptId === conceptId
            ? {
                ...e,
                incorrectAttempts: e.incorrectAttempts + 1,
                lastError: Date.now(),
                misunderstanding: misunderstanding || e.misunderstanding,
              }
            : e,
        );
      } else {
        errorPatterns = [
          ...state.errorPatterns,
          {
            conceptId,
            incorrectAttempts: 1,
            firstError: Date.now(),
            lastError: Date.now(),
            misunderstanding,
          },
        ];
      }

      // Mantener top 50 más recientes
      errorPatterns = errorPatterns
        .sort((a, b) => b.lastError - a.lastError)
        .slice(0, 50);

      persist({
        viewHistory: state.viewHistory,
        reviewSchedule: state.reviewSchedule,
        errorPatterns,
        learningPace: state.learningPace,
        lastRecommendation: state.lastRecommendation,
      });
      return { errorPatterns };
    });
  },

  /**
   * Configurar ritmo de aprendizaje
   * @param {'slow'|'normal'|'fast'} pace
   */
  setLearningPace: (pace) => {
    if (!["slow", "normal", "fast"].includes(pace)) return;

    set((state) => {
      persist({
        viewHistory: state.viewHistory,
        reviewSchedule: state.reviewSchedule,
        errorPatterns: state.errorPatterns,
        learningPace: pace,
        lastRecommendation: state.lastRecommendation,
      });
      return { learningPace: pace };
    });
  },

  // ═══════════════════════════════════════════════════════════
  // SELECTORES (computed)
  // ═══════════════════════════════════════════════════════════

  /**
   * Items vencidos para revisar HOY
   * @returns {Array<{itemId, box, dueAt}>}
   */
  getDueReviews: () => {
    const { reviewSchedule } = get();
    const now = Date.now();
    return reviewSchedule
      .filter((r) => r.dueAt <= now)
      .sort((a, b) => a.dueAt - b.dueAt);
  },

  /**
   * Próximas revisiones (aún no vencidas, próximos 7 días)
   */
  getUpcomingReviews: (daysAhead = 7) => {
    const { reviewSchedule } = get();
    const now = Date.now();
    const limit = now + daysAhead * 24 * 60 * 60 * 1000;
    return reviewSchedule
      .filter((r) => r.dueAt > now && r.dueAt <= limit)
      .sort((a, b) => a.dueAt - b.dueAt);
  },

  /**
   * Conceptos donde el usuario tiene dificultades (3+ errores)
   */
  getStruggleConcepts: () => {
    const { errorPatterns } = get();
    return errorPatterns
      .filter((e) => e.incorrectAttempts >= 3)
      .sort((a, b) => b.incorrectAttempts - a.incorrectAttempts);
  },

  /**
   * Items NO visitados recientemente (>7 días)
   */
  getStaleItems: (daysThreshold = 7) => {
    const { viewHistory } = get();
    const cutoff = Date.now() - daysThreshold * 24 * 60 * 60 * 1000;

    // Agrupa por itemId, toma la última vista
    const lastViewed = {};
    viewHistory.forEach((v) => {
      if (!lastViewed[v.itemId] || v.timestamp > lastViewed[v.itemId]) {
        lastViewed[v.itemId] = v.timestamp;
      }
    });

    return Object.entries(lastViewed)
      .filter(([, ts]) => ts < cutoff)
      .map(([itemId, ts]) => ({ itemId, lastViewed: ts }))
      .sort((a, b) => a.lastViewed - b.lastViewed);
  },
});

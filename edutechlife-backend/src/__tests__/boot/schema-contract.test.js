/**
 * Schema Contract — anti-regression tests.
 *
 * Fuente de verdad: migraciones supabase/migrations (011, 042, 052, 053, 054,
 * 055, 056, 057, 058) + sondeo de producción (columnas reales en Supabase).
 *
 * Falla si:
 *   - un servicio consulta una columna inexistente;
 *   - un servicio usa nombres antiguos (mastery_score, plan_data, memory_data,
 *     schedule_slots, activity_sessions, longest_streak);
 *   - se referencia una tabla inexistente;
 *   - una entidad crítica tiene múltiples fuentes de verdad.
 */
const fs = require('fs');
const path = require('path');

const BACKEND_ROOT = path.resolve(__dirname, '..', '..', '..');
const FRONTEND_ROOT = path.resolve(BACKEND_ROOT, '..', 'edutechlife-frontend');

const SCAN_FILES = [
  'src/services/adaptiveLearning.js',
  'src/services/badgeEngine.js',
  'src/services/competencyMastery.js',
  'src/services/daniOrchestrator.js',
  'src/services/earlyWarning.js',
  'src/services/missionEngine.js',
  'src/services/parentInsights.js',
  'src/services/metricsService.js',
  'src/routes/smartboard.js',
];

const FORBIDDEN_TOKENS = [
  'mastery_score',
  'plan_data',
  'memory_data',
  'schedule_slots',
  'activity_sessions',
  'longest_streak',
  'sb_auth_token',
];

// ── Schema Contract (tabla → columnas reales) ────────────────────────────────
const CONTRACT = {
  students: [
    'id', 'auth_id', 'name', 'age', 'email', 'vak_result_json', 'subscription_tier',
    'parent_email', 'parent_verified', 'language', 'avatar_url', 'bio', 'created_at',
    'updated_at', 'last_activity', 'is_active', 'school', 'grade', 'vak_style',
    'grade_level', 'country_code', 'grades_json', 'progress_json',
  ],
  sessions: [
    'id', 'student_id', 'start_time', 'end_time', 'subject', 'points_earned', 'type',
    'duration_minutes', 'content_id', 'completion_percentage', 'notes', 'created_at', 'updated_at',
  ],
  points_history: [
    'id', 'student_id', 'points', 'reason', 'category', 'related_session_id', 'timestamp',
    'metadata', 'created_at',
  ],
  vak_results: [
    'id', 'student_id', 'visual_score', 'auditory_score', 'kinesthetic_score', 'primary_style',
    'secondary_style', 'test_version', 'responses', 'detected_at', 'created_at', 'updated_at',
  ],
  learning_streaks: [
    'id', 'student_id', 'current_streak', 'best_streak', 'last_activity_date',
    'total_days_active', 'freeze_used_today', 'created_at', 'updated_at',
  ],
  dani_memory: [
    'id', 'student_id', 'communication_style', 'strengths', 'weaknesses', 'interests',
    'frequent_errors', 'pending_topics', 'last_mood', 'last_updated', 'created_at',
  ],
  learning_plans: [
    'id', 'student_id', 'type', 'plan_json', 'generated_at', 'expires_at', 'is_active',
  ],
  early_warnings: [
    'id', 'student_id', 'severity', 'type', 'evidence_json', 'recommendation',
    'resolved_at', 'created_at',
  ],
  student_competency_mastery: [
    'id', 'student_id', 'competency_id', 'mastery_level', 'practice_count', 'last_score',
    'last_practiced_at', 'updated_at',
  ],
  competencies: [
    'id', 'country_code', 'subject', 'label', 'grade_range', 'grade_min', 'grade_max',
    'description', 'created_at',
  ],
  learning_content: [
    'id', 'country_code', 'title', 'type', 'subject', 'area', 'competency_id', 'skill',
    'age_min', 'age_max', 'grade_min', 'grade_max', 'difficulty', 'duration_min',
    'learning_objective', 'vak_style', 'url', 'body', 'is_active', 'created_at', 'updated_at',
  ],
  recommendations: [
    'id', 'student_id', 'type', 'content_id', 'competency_id', 'reason', 'priority',
    'status', 'result_json', 'metadata', 'created_at', 'updated_at', 'expires_at',
  ],
  missions: [
    'id', 'key', 'type', 'title', 'description', 'icon', 'xp_reward', 'criteria_json',
    'is_active', 'created_at',
  ],
  student_missions: [
    'id', 'student_id', 'mission_id', 'progress', 'target', 'completed', 'completed_at',
    'expires_at', 'created_at',
  ],
  badges: [
    'id', 'key', 'name', 'description', 'icon', 'criteria_json', 'is_active', 'created_at',
  ],
  student_badges: [
    'id', 'student_id', 'badge_id', 'unlocked_at', 'evidence_json',
  ],
  student_timetable: [
    'id', 'student_id', 'school_name', 'term_label', 'term_start', 'term_end', 'timezone',
    'source', 'is_active', 'created_at', 'updated_at',
  ],
  timetable_slots: [
    'id', 'timetable_id', 'day_of_week', 'start_time', 'end_time', 'subject', 'subject_label',
    'teacher', 'room', 'color', 'notes', 'created_at', 'updated_at',
  ],
  student_exams: [
    'id', 'student_id', 'slot_id', 'subject', 'exam_name', 'exam_date', 'exam_time', 'topic',
    'desired_grade', 'source', 'file_url', 'reminded_at', 'completed', 'result_score',
    'created_at', 'updated_at',
  ],
  parent_student_links: ['parent_user_id', 'student_user_id'],
  crisis_alerts: ['id', 'student_id', 'crisis_level', 'detected_content', 'created_at', 'resolved_at'],
  parent_consents: [
    'id', 'student_id', 'parent_email', 'student_age', 'consent_timestamp', 'verification_status',
    'verification_token', 'verification_email_sent', 'verified_at', 'created_at', 'updated_at',
  ],
  smartboard_kids_data: ['user_id', 'platform', 'data'],
  grade_analyses: ['id', 'student_user_id', 'grades', 'created_at'],
  student_tasks: [
    'id', 'student_id', 'title', 'description', 'subject', 'file_url', 'file_type',
    'file_size_bytes', 'uploaded_at', 'analyzed', 'analysis_result', 'ai_feedback', 'grade',
    'is_submitted', 'submission_deadline', 'created_at', 'updated_at',
  ],
  conversations: [
    'id', 'student_id', 'user_message', 'ai_response', 'timestamp', 'emotional_context',
    'subject', 'learning_style_applied', 'messages_in_context', 'token_count', 'model_used',
    'parent_session_id', 'created_at',
  ],
  academic_context: [
    'id', 'student_id', 'subject', 'performance_level', 'total_points', 'lessons_completed',
    'average_score', 'quiz_attempts', 'quiz_passed', 'current_streak', 'best_streak',
    'topics_mastered', 'topics_in_progress', 'weak_areas', 'last_updated', 'created_at',
  ],
  parent_dashboards: [
    'id', 'student_id', 'parent_email', 'access_granted_at', 'access_level',
    'notification_frequency', 'notify_on_achievements', 'notify_on_concerns',
    'notify_on_milestones', 'last_login', 'is_active', 'created_at', 'updated_at',
  ],
  achievements: [
    'id', 'student_id', 'achievement_type', 'title', 'description', 'badge_url', 'earned_at',
    'points_awarded', 'is_milestone', 'created_at',
  ],
  smartboard_settings: [
    'id', 'student_id', 'difficulty_level', 'daily_goal_minutes', 'preferred_subject',
    'sound_enabled', 'notifications_enabled', 'dark_mode', 'show_hints', 'adaptive_learning',
    'language', 'timezone', 'created_at', 'updated_at',
  ],
  feedback_log: ['id', 'student_id', 'feedback_type', 'payload', 'created_at'],
  // Tablas de analytics del stub de métricas — NO existen aún en prod.
  // Plan de creación: FASE C (conciliación de migraciones).
  user_sessions: ['id', 'user_id', 'duration_seconds', 'created_at'],
  lesson_attempts: ['id', 'user_id', 'completed', 'created_at'],
  parent_dashboard_views: ['id', 'parent_id', 'created_at'],
  feature_usage: ['id', 'user_id', 'feature', 'created_at'],
  users: ['id', 'clerk_id', 'email', 'role', 'account_type', 'created_at'],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function readSource(relPath) {
  return fs.readFileSync(path.join(BACKEND_ROOT, relPath), 'utf8');
}

function extractTableRefs(src) {
  const refs = [];
  // Captura el receptor para descartar buckets de storage (supabase.storage.from)
  const re = /([a-z_]+)\.from\(\s*["']([a-z_]+)["']\s*\)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1] === 'storage') continue;
    refs.push({ table: m[2], index: m.index });
  }
  return refs;
}

function statementWindow(src, startIndex) {
  const nextFrom = src.indexOf('.from("', startIndex + 8);
  const nextFrom2 = src.indexOf(".from('", startIndex + 8);
  const nextFromIdx = Math.min(
    [nextFrom, nextFrom2].filter((i) => i !== -1).reduce((a, b) => (a === -1 ? b : Math.min(a, b)), -1),
  );
  const end = nextFromIdx !== -1 ? nextFromIdx : Math.min(src.length, startIndex + 700);
  return src.slice(startIndex, end);
}

function columnTokensInWindow(windowSrc) {
  const tokens = new Set();
  const quoted = /["']([a-z_][a-z0-9_]*\s*(?:,\s*[a-z_][a-z0-9_]*)*)["']/g;
  const colArgs = /\.(?:eq|order|gte|lte|gt|lt|in|like|is|neq)\(\s*["']([a-z_]+)["']/g;

  let m;
  while ((m = colArgs.exec(windowSrc)) !== null) tokens.add(m[1]);

  const selectRe = /\.select\(\s*["']([^"']+?)["']\s*\)/g;
  while ((m = selectRe.exec(windowSrc)) !== null) {
    for (const field of m[1].split(',')) {
      const f = field.trim();
      if (!f || f === '*' || f.startsWith('!')) continue;
      if (f.includes('(')) {
        // Relación embebida: "missions(criteria_json)" → validar el nombre de la relación
        const rel = f.slice(0, f.indexOf('('));
        tokens.add(`<relation:${rel}>`);
      } else if (f.includes(')')) {
        // Cola de una relación embebida que se partió por coma (p. ej. " type)")
        continue;
      } else {
        tokens.add(f);
      }
    }
  }
  return tokens;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('schema contract', () => {
  test('no quedan tokens legacy prohibidos en backend SmartBoard', () => {
    for (const rel of SCAN_FILES) {
      const src = readSource(rel);
      for (const token of FORBIDDEN_TOKENS) {
        expect(src.includes(token)).toBe(false);
      }
    }
  });

  test('no queda sb_auth_token ni mastery_score en frontend SmartBoard', () => {
    const dir = path.join(FRONTEND_ROOT, 'src');
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );
    const files = walk(dir).filter((f) => /\.(js|jsx|ts|tsx)$/.test(f));
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8');
      expect(src.includes('sb_auth_token')).toBe(false);
    }
  });

  test('toda tabla referenciada existe en el contrato', () => {
    for (const rel of SCAN_FILES) {
      const src = readSource(rel);
      for (const { table } of extractTableRefs(src)) {
        expect(CONTRACT[table], `${rel} referencia tabla inexistente "${table}"`).toBeDefined();
      }
    }
  });

  test('toda columna consultada existe en su tabla', () => {
    for (const rel of SCAN_FILES) {
      const src = readSource(rel);
      for (const { table, index } of extractTableRefs(src)) {
        const windowSrc = statementWindow(src, index);
        for (const token of columnTokensInWindow(windowSrc)) {
          if (token.startsWith('<relation:')) {
            const relName = token.slice(10, -1);
            expect(CONTRACT[relName], `${rel} embebe relación inexistente "${relName}"`).toBeDefined();
            continue;
          }
          expect(
            CONTRACT[table].includes(token),
            `${rel}: "${table}" no tiene columna "${token}"`,
          ).toBe(true);
        }
      }
    }
  });

  test('mastery: una sola fuente de verdad (student_competency_mastery.mastery_level)', () => {
    const masterySrc = readSource('src/services/competencyMastery.js');
    expect(masterySrc).toContain('from("student_competency_mastery")');
    expect(masterySrc).toContain('mastery_level');
    expect(masterySrc).toContain('practice_count');
    // No debe escribir mastery en el blob
    expect(masterySrc).not.toContain('smartboard_kids_data');
  });

  test('planes: una sola fuente de verdad (learning_plans.plan_json)', () => {
    const adaptive = readSource('src/services/adaptiveLearning.js');
    expect(adaptive).toContain('from("learning_plans")');
    expect(adaptive).toContain('plan_json');
  });

  test('memoria de Dani: una sola fuente de verdad (dani_memory con columnas tipadas)', () => {
    const dani = readSource('src/services/daniOrchestrator.js');
    expect(dani).toContain('from("dani_memory")');
    expect(dani).toContain('communication_style');
    expect(dani).not.toContain('memory_data');
  });

  test('horario: usa timetable_slots con day_of_week SMALLINT', () => {
    const dani = readSource('src/services/daniOrchestrator.js');
    expect(dani).toContain('from("timetable_slots")');
    expect(dani).toContain('day_of_week');
  });
});

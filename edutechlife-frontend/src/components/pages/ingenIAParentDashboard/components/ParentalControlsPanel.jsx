import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  Save,
  Check,
  Target,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { createSupabaseClient } from "../../../../lib/supabase";
import { useTranslation } from "../../../../i18n/I18nProvider";

// Acordeón mobile — en desktop siempre abierto (md:block)
const AccordionSection = ({
  title,
  icon,
  defaultOpen = false,
  children,
  badge,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-bold text-[#004B63] text-sm">
          {icon} {title}
        </span>
        <span className="flex items-center gap-2">
          {badge && <span className="text-[10px] text-[#94A3B8]">{badge}</span>}
          <ChevronDown
            className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {/* Desktop: siempre visible */}
      <div className="hidden md:block px-5 pb-5 pt-1">
        <div className="flex items-center gap-2 font-bold text-[#004B63] text-sm mb-4 pt-4 border-b border-[#F1F5F9] pb-2">
          {icon} {title}{" "}
          {badge && (
            <span className="ml-auto text-[10px] text-[#94A3B8] font-normal">
              {badge}
            </span>
          )}
        </div>
        {children}
      </div>
      {/* Mobile: colapsable */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FEATURE_TOGGLES = [
  {
    id: "flashcards",
    emoji: "🃏",
    i18nKey: "parent_dashboard.feature_flashcards",
  },
  { id: "oral", emoji: "🎤", i18nKey: "parent_dashboard.feature_oral" },
  {
    id: "examenes",
    emoji: "📝",
    i18nKey: "parent_dashboard.feature_practice_exams",
  },
  { id: "retos", emoji: "🏆", i18nKey: "parent_dashboard.feature_challenges" },
  { id: "podcast", emoji: "🎙️", i18nKey: "parent_dashboard.feature_podcast" },
  { id: "vak", emoji: "🧠", i18nKey: "parent_dashboard.feature_vak" },
  {
    id: "calificaciones",
    emoji: "📊",
    i18nKey: "parent_dashboard.feature_grades",
  },
  { id: "misiones", emoji: "🎯", i18nKey: "parent_dashboard.feature_missions" },
];

const TIME_LIMITS = [
  { value: 0, labelKey: "parent_dashboard.controls_no_limit" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hora" },
  { value: 90, label: "1.5 horas" },
  { value: 120, label: "2 horas" },
  { value: 180, label: "3 horas" },
];

const STORAGE_KEY = "edutechlife_parental_controls";

const NOTIF_TOGGLES = [
  { id: "streak_risk", emoji: "🔥", i18nKey: "ctrl.notif_streak_risk" },
  { id: "weekly_goal", emoji: "🎯", i18nKey: "ctrl.notif_weekly_goal" },
  { id: "weekly_report", emoji: "📋", i18nKey: "ctrl.notif_weekly_report" },
  { id: "achievements", emoji: "🏆", i18nKey: "ctrl.notif_achievements" },
];

const STUDY_DAYS = ["L", "M", "X", "J", "V", "S", "D"];
const STUDY_TIMES = [
  { id: "morning", i18nKey: "ctrl.time_morning" },
  { id: "afternoon", i18nKey: "ctrl.time_afternoon" },
  { id: "evening", i18nKey: "ctrl.time_evening" },
];

const WEEKLY_GOALS = [
  { value: 0, labelKey: "ctrl.goal_none" },
  { value: 2, labelKey: "ctrl.goal_2" },
  { value: 3, labelKey: "ctrl.goal_3" },
  { value: 5, labelKey: "ctrl.goal_5" },
  { value: 7, labelKey: "ctrl.goal_7" },
];

const MONTHLY_PRESETS_KEYS = [
  "ctrl.monthly_preset_explore",
  "ctrl.monthly_preset_module",
  "ctrl.monthly_preset_streak",
  "ctrl.monthly_preset_improve",
];

const defaultControls = () => {
  const features = {};
  FEATURE_TOGGLES.forEach((f) => {
    features[f.id] = true;
  });
  const notifications = {};
  NOTIF_TOGGLES.forEach((n) => {
    notifications[n.id] = true;
  });
  return {
    features,
    dailyTimeLimitMin: 0,
    chatEnabled: true,
    weeklyGoalSessions: 0,
    monthlyObjective: "",
    notifications,
    studyDays: [0, 1, 2, 3, 4], // L-V por defecto
    studyTime: "afternoon",
  };
};

const ParentalControlsPanel = ({ authToken, studentId }) => {
  const { t } = useTranslation();
  const [controls, setControls] = useState(defaultControls);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const textareaRef = useRef(null);

  const loadControls = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setControls(JSON.parse(stored));
    } catch {
      /* ignore */
    }

    if (!authToken || !studentId) {
      setLoaded(true);
      return;
    }
    try {
      const client = createSupabaseClient(authToken);
      const { data } = await client
        .from("parental_controls")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();
      if (data) {
        const merged = {
          features: { ...defaultControls().features, ...(data.features || {}) },
          dailyTimeLimitMin: data.daily_time_limit_min ?? 0,
          chatEnabled: data.chat_enabled ?? true,
          weeklyGoalSessions: data.weekly_goal_sessions ?? 0,
          monthlyObjective: data.monthly_objective ?? "",
          notifications: {
            ...defaultControls().notifications,
            ...(data.notifications || {}),
          },
          studyDays: data.study_days ?? [0, 1, 2, 3, 4],
          studyTime: data.study_time ?? "afternoon",
        };
        setControls(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    } catch {
      // fallback to localStorage
    }
    setLoaded(true);
  }, [authToken, studentId]);

  useEffect(() => {
    loadControls();
  }, [loadControls]);

  const toggleFeature = (id) => {
    setControls((prev) => ({
      ...prev,
      features: { ...prev.features, [id]: !prev.features[id] },
    }));
    setSaved(false);
  };

  const setTimeLimit = (val) => {
    setControls((prev) => ({ ...prev, dailyTimeLimitMin: val }));
    setSaved(false);
  };

  const toggleChat = () => {
    setControls((prev) => ({ ...prev, chatEnabled: !prev.chatEnabled }));
    setSaved(false);
  };

  const setWeeklyGoal = (val) => {
    setControls((prev) => ({ ...prev, weeklyGoalSessions: val }));
    setSaved(false);
  };

  const setMonthlyObjective = (text) => {
    setControls((prev) => ({ ...prev, monthlyObjective: text }));
    setSaved(false);
  };

  const toggleNotif = (id) => {
    setControls((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [id]: !prev.notifications[id] },
    }));
    setSaved(false);
  };

  const toggleStudyDay = (idx) => {
    setControls((prev) => {
      const days = prev.studyDays.includes(idx)
        ? prev.studyDays.filter((d) => d !== idx)
        : [...prev.studyDays, idx].sort((a, b) => a - b);
      return { ...prev, studyDays: days };
    });
    setSaved(false);
  };

  const setStudyTime = (id) => {
    setControls((prev) => ({ ...prev, studyTime: id }));
    setSaved(false);
  };

  const applyPreset = (key) => {
    const text = t(key);
    setMonthlyObjective(text);
    if (textareaRef.current) textareaRef.current.value = text;
  };

  const saveControls = async () => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));

    if (authToken && studentId) {
      try {
        const client = createSupabaseClient(authToken);
        await client.from("parental_controls").upsert(
          {
            student_id: studentId,
            features: controls.features,
            daily_time_limit_min: controls.dailyTimeLimitMin,
            chat_enabled: controls.chatEnabled,
            weekly_goal_sessions: controls.weeklyGoalSessions,
            monthly_objective: controls.monthlyObjective,
            notifications: controls.notifications,
            study_days: controls.studyDays,
            study_time: controls.studyTime,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id" },
        );
      } catch (e) {
        console.warn("[ParentalControls] Save to DB failed:", e.message);
      }
    }
    setSaving(false);
    setSaved(true);
  };

  if (!loaded) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[#E2E8F0] animate-pulse" />
        ))}
      </div>
    );
  }

  const enabledCount = Object.values(controls.features).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004B63] to-[#0077B6] rounded-xl p-5 text-white flex items-center gap-4">
        <Shield className="w-8 h-8 flex-shrink-0" />
        <div>
          <h3 className="font-black text-lg">
            {t("parent_dashboard.controls_title")}
          </h3>
          <p className="text-white/70 text-sm">
            {t("parent_dashboard.controls_description")}
          </p>
        </div>
      </div>

      {/* ── Acordeón 1: Herramientas + Chat ── */}
      <AccordionSection
        title={t("parent_dashboard.controls_tools_header")}
        icon="🛠️"
        badge={t("parent_dashboard.controls_tools_count", {
          count: enabledCount,
          total: FEATURE_TOGGLES.length,
        })}
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {FEATURE_TOGGLES.map((feat) => {
            const enabled = controls.features[feat.id];
            return (
              <button
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  enabled
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <span className="text-xl">{feat.emoji}</span>
                <span
                  className={`text-sm font-medium flex-1 ${enabled ? "text-emerald-800" : "text-gray-500"}`}
                >
                  {t(feat.i18nKey)}
                </span>
                <div
                  className={`w-10 h-6 rounded-full relative flex-shrink-0 transition-colors ${enabled ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ left: enabled ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        {/* Dani chat dentro del mismo grupo */}
        <button
          onClick={toggleChat}
          className={`flex items-center gap-3 p-3 rounded-lg border w-full text-left transition-all ${
            controls.chatEnabled
              ? "bg-blue-50 border-blue-200"
              : "bg-gray-50 border-gray-200 opacity-60"
          }`}
        >
          <span className="text-xl">💬</span>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${controls.chatEnabled ? "text-blue-800" : "text-gray-500"}`}
            >
              {t("parent_dashboard.controls_dani_chat")}
            </p>
            <p className="text-xs text-gray-500">
              {t("parent_dashboard.controls_dani_description")}
            </p>
          </div>
          <div
            className={`w-10 h-6 rounded-full relative flex-shrink-0 transition-colors ${controls.chatEnabled ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
              animate={{ left: controls.chatEnabled ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>
      </AccordionSection>

      {/* ── Acordeón 2: Límites de tiempo ── */}
      <AccordionSection
        title={t("parent_dashboard.controls_time_limit")}
        icon={<Clock className="w-4 h-4" />}
        defaultOpen={false}
      >
        <p className="text-xs text-[#94A3B8] mb-3">
          {t("parent_dashboard.controls_time_limit_description")}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TIME_LIMITS.map((tl) => (
            <button
              key={tl.value}
              onClick={() => setTimeLimit(tl.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                controls.dailyTimeLimitMin === tl.value
                  ? "bg-[#4DA8C4] text-white border-[#4DA8C4]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tl.labelKey ? t(tl.labelKey) : tl.label}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* ── Acordeón 3: Mis metas ── */}
      <AccordionSection
        title={t("ctrl.accordion_goals")}
        icon={<Target className="w-4 h-4" />}
        defaultOpen={
          controls.weeklyGoalSessions > 0 || !!controls.monthlyObjective
        }
      >
        {/* Meta semanal */}
        <p className="text-xs font-semibold text-[#64748B] mb-1">
          {t("ctrl.weekly_goal_title")}
        </p>
        <p className="text-xs text-[#94A3B8] mb-2">
          {t("ctrl.weekly_goal_desc")}
        </p>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {WEEKLY_GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setWeeklyGoal(g.value)}
              className={`py-2 rounded-lg text-xs font-semibold transition-all border text-center ${
                controls.weeklyGoalSessions === g.value
                  ? "bg-[#004B63] text-white border-[#004B63]"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {t(g.labelKey)}
            </button>
          ))}
        </div>
        {controls.weeklyGoalSessions > 0 && (
          <p className="text-[11px] text-[#4DA8C4] mb-4">
            {t("ctrl.weekly_goal_set", { n: controls.weeklyGoalSessions })}
          </p>
        )}
        {/* Objetivo del mes */}
        <p className="text-xs font-semibold text-[#64748B] mb-1">
          {t("ctrl.monthly_obj_title")}
        </p>
        <p className="text-xs text-[#94A3B8] mb-2">
          {t("ctrl.monthly_obj_desc")}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {MONTHLY_PRESETS_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                controls.monthlyObjective === t(key)
                  ? "bg-[#4DA8C4]/15 border-[#4DA8C4] text-[#004B63] font-semibold"
                  : "bg-[#F1F5F9] border-[#E2E8F0] text-[#475569]"
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          defaultValue={controls.monthlyObjective}
          onChange={(e) => setMonthlyObjective(e.target.value)}
          placeholder={t("ctrl.monthly_obj_placeholder")}
          rows={2}
          className="w-full text-sm text-[#334155] placeholder-[#CBD5E1] border border-[#E2E8F0] rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#4DA8C4] transition-all"
        />
      </AccordionSection>

      {/* ── Acordeón 4: Horario y notificaciones ── */}
      <AccordionSection
        title={t("ctrl.accordion_schedule")}
        icon={<CalendarDays className="w-4 h-4" />}
        defaultOpen={false}
      >
        {/* Días */}
        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">
          {t("ctrl.schedule_days")}
        </p>
        <div className="flex gap-1.5 mb-4">
          {STUDY_DAYS.map((day, idx) => {
            const active = controls.studyDays.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleStudyDay(idx)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                  active
                    ? "bg-[#004B63] text-white border-[#004B63]"
                    : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        {/* Horario */}
        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">
          {t("ctrl.schedule_time")}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {STUDY_TIMES.map((st) => (
            <button
              key={st.id}
              onClick={() => setStudyTime(st.id)}
              className={`py-2 rounded-lg text-xs font-semibold transition-all border text-center ${
                controls.studyTime === st.id
                  ? "bg-[#4DA8C4] text-white border-[#4DA8C4]"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {t(st.i18nKey)}
            </button>
          ))}
        </div>
        {/* Notificaciones */}
        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">
          🔔 {t("ctrl.notif_title")}
        </p>
        <div className="space-y-2">
          {NOTIF_TOGGLES.map((n) => {
            const on = controls.notifications?.[n.id] ?? true;
            return (
              <button
                key={n.id}
                onClick={() => toggleNotif(n.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border w-full text-left transition-all ${
                  on
                    ? "bg-[#F0F9FF] border-[#BAE6FD]"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <span className="text-lg">{n.emoji}</span>
                <span
                  className={`text-sm flex-1 ${on ? "text-[#0369A1]" : "text-gray-400"}`}
                >
                  {t(n.i18nKey)}
                </span>
                <div
                  className={`w-10 h-6 rounded-full relative flex-shrink-0 transition-colors ${on ? "bg-[#4DA8C4]" : "bg-gray-300"}`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ left: on ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* Save Button */}
      <motion.button
        onClick={saveControls}
        disabled={saving || saved}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-gradient-to-r from-[#004B63] to-[#0077B6] text-white hover:shadow-lg"
        } disabled:opacity-60`}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            {t("parent_dashboard.controls_saving")}
          </>
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> {t("parent_dashboard.controls_saved")}
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> {t("parent_dashboard.controls_save")}
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ParentalControlsPanel;

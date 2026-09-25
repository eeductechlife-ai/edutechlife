import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { sanitize } from "../../utils/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

function authToken() {
  try {
    return (
      sessionStorage.getItem("auth_token") ||
      localStorage.getItem("auth_token") ||
      ""
    );
  } catch {
    return "";
  }
}
function getStudentId() {
  try {
    return localStorage.getItem("student_id") || "";
  } catch {
    return "";
  }
}

const STYLE_COLORS = {
  visual: "#06D6A0",
  auditivo: "#A855F7",
  kinestesico: "#FB8500",
};

const STYLE_EMOJIS = {
  visual: "👁️",
  auditivo: "👂",
  kinestesico: "🏃",
};

const STYLE_NAMES = {
  visual: "Visual",
  auditivo: "Auditivo",
  kinestesico: "Kinestésico",
};

const DAILY_TIPS = {
  visual: [
    { time: "Mañana", tip: "Dibuja un mapa mental de lo que estudiarás hoy" },
    { time: "Tarde", tip: "Usa colores y resalta lo más importante" },
    { time: "Noche", tip: "Repasa con imágenes y diagramas" },
  ],
  auditivo: [
    { time: "Mañana", tip: "Explica en voz alta tu plan de estudio" },
    { time: "Tarde", tip: "Graba un resumen y escúchalo" },
    { time: "Noche", tip: "Conversa con Dani sobre lo aprendido" },
  ],
  kinestesico: [
    { time: "Mañana", tip: "Inicia con ejercicios físicos ligeros" },
    { time: "Tarde", tip: "Estudia con pausas activas cada 20 min" },
    { time: "Noche", tip: "Construye un modelo o maqueta de tu tema" },
  ],
};

const WEEKLY_ACTIVITIES = {
  visual: [
    { id: "v1", name: "Mapa mental de la semana", days: "Lun, Mié, Vie" },
    { id: "v2", name: "Infografías de tus materias", days: "Mar, Jue" },
    { id: "v3", name: "Ver video educativo relacionado", days: "Sáb" },
  ],
  auditivo: [
    { id: "a1", name: "Grabar resumen de clase", days: "Lun, Mié, Vie" },
    { id: "a2", name: "Explicar tema a alguien", days: "Mar, Jue" },
    { id: "a3", name: "Escuchar podcast educativo", days: "Sáb" },
  ],
  kinestesico: [
    {
      id: "k1",
      name: "Experimento o proyecto práctico",
      days: "Lun, Mié, Vie",
    },
    { id: "k2", name: "Role-playing del tema", days: "Mar, Jue" },
    { id: "k3", name: "Construir modelo físico", days: "Sáb" },
  ],
};

const ACTIVITY_ICONS = {
  practice: "📝",
  flashcard: "🃏",
  challenge: "⚡",
  oral: "🎙️",
  content: "📚",
  video: "🎬",
  default: "🎯",
};

// "+" read as "add"; the button means "I did it" and pays the points.
function DoneButton({ done, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={done}
      aria-label={done ? `${label}: hecha` : `Marcar «${label}» como hecha`}
      className={`shrink-0 min-h-[40px] px-3 rounded-xl text-xs font-black border-2 transition-colors ${
        done
          ? "bg-green-500 border-green-500 text-white"
          : "border-[#FB8500] text-[#C2410C] bg-white hover:bg-[#FFF7ED]"
      }`}
    >
      {done ? "✓ Hecha" : "✓ Lo hice · +25"}
    </button>
  );
}

// The chosen time reshapes the routine: fewer, shorter activities on a
// busy day (the select used to change nothing without the server plan).
export function routineFor(activities, minutes) {
  const count = minutes <= 10 ? 1 : minutes <= 20 ? 2 : 3;
  const each = Math.round(minutes / count);
  return activities.slice(0, count).map((a) => ({ ...a, minutes: each }));
}

const PersonalizedPlan = () => {
  const { t } = useTranslation();
  const {
    vakResult,
    vakRecommendations,
    addPoints,
    planCompletedActivities: completedActivities,
    setPlanCompletedActivities: setCompletedActivities,
  } = useIngenIAKids();
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);
  const [aiWeeklyPlan, setAiWeeklyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [availableMinutes, setAvailableMinutes] = useState(20);

  useEffect(() => {
    const sid = getStudentId();
    const token = authToken();
    if (!sid || !token) return;
    setLoadingPlan(true);
    Promise.all([
      fetch(`${API_BASE}/api/smartboard/adaptive/daily-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: sid, availableMinutes }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${API_BASE}/api/smartboard/adaptive/weekly-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: sid, availableMinutesPerDay: 25 }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([daily, weekly]) => {
        if (daily?.plan) setAiPlan(daily.plan);
        if (weekly?.plan) setAiWeeklyPlan(weekly.plan);
      })
      .finally(() => setLoadingPlan(false));
  }, [availableMinutes]);

  const dominantStyle = vakResult?.predominantStyle || "visual";

  const dailyTips = DAILY_TIPS[dominantStyle] || [];
  const weeklyActivities = WEEKLY_ACTIVITIES[dominantStyle] || [];
  const todayActivities = routineFor(weeklyActivities, availableMinutes);

  const handleCompleteActivity = useCallback(
    (activityId) => {
      if (!completedActivities.includes(activityId)) {
        setCompletedActivities((prev) => [...prev, activityId]);
        addPoints(25, "Actividad del plan completada");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    },
    [completedActivities, addPoints, setCompletedActivities],
  );

  if (!vakResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0] text-center"
      >
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-2xl font-bold text-[#1E293B] mb-3">
          {t("kid.personalized_plan.title_empty")}
        </h3>
        <p
          className="text-[#64748B]"
          dangerouslySetInnerHTML={{
            __html: sanitize(t("kid.personalized_plan.desc_empty")),
          }}
        />
        <p className="text-sm text-[#FB8500] mt-4">
          {t("kid.personalized_plan.hint_empty")}
        </p>
      </motion.div>
    );
  }

  const PROGRESS_GRADIENT =
    "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)";

  return (
    <div className="space-y-6">
      {/* Section header banner */}
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{ background: PROGRESS_GRADIENT }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <span className="text-2xl">📋</span>
          </div>
          {/* Not "Mi Plan": that name belongs to the 4-week plan in Aprender. */}
          <div>
            <h3 className="!m-0 text-lg font-black !text-white drop-shadow-sm">
              Tu rutina de estudio
            </h3>
            <p className="!m-0 text-xs text-white/90">
              Hecha para tu estilo {STYLE_EMOJIS[dominantStyle]}{" "}
              {STYLE_NAMES[dominantStyle]}
            </p>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(30%,-30%)",
          }}
        />
      </div>

      {showConfetti && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <span className="text-8xl">🎉</span>
        </motion.div>
      )}

      {/* The style percentages are already on the ADN result card above. */}
      {vakRecommendations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-[#E2E8F0]"
        >
          <h3 className="text-lg font-bold text-[#1E293B] mb-4">
            {t("kid.personalized_plan.recommendations_title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vakRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:shadow-md transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: `${STYLE_COLORS[dominantStyle]}20`,
                  }}
                >
                  <span className="text-lg">
                    {rec.type === "activity" ? "🎮" : "📚"}
                  </span>
                </div>
                <h4 className="font-semibold text-[#1E293B] text-sm mb-1">
                  {rec.name}
                </h4>
                <p className="text-xs text-[#64748B]">{rec.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Daily Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
      >
        <h3 className="!m-0 text-base sm:text-lg font-bold text-[#1E293B]">
          📅 Tu rutina de hoy
        </h3>
        {/* Big chips instead of a tiny select; the choice really reshapes
            the routine (see todayActivities). */}
        <p className="!m-0 mt-1 mb-2 text-xs text-[#64748B]">
          ¿Cuánto tiempo tienes hoy?
        </p>
        <div
          role="radiogroup"
          aria-label="Tiempo disponible"
          className="grid grid-cols-5 gap-1.5 mb-4"
        >
          {[10, 20, 30, 45, 60].map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={availableMinutes === m}
              onClick={() => setAvailableMinutes(m)}
              className={`min-h-[40px] rounded-xl text-xs font-black border-2 ${
                availableMinutes === m
                  ? "text-white border-transparent"
                  : "border-[#E2E8F0] text-[#334155] bg-white"
              }`}
              style={
                availableMinutes === m ? { background: PROGRESS_GRADIENT } : {}
              }
            >
              {m} min
            </button>
          ))}
        </div>

        {loadingPlan ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : aiPlan?.activities?.length > 0 ? (
          <div className="space-y-3">
            {aiPlan.activities.map((act, idx) => {
              const actId = `ai-daily-${idx}`;
              const isCompleted = completedActivities.includes(actId);
              const icon = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.default;
              return (
                <motion.div
                  key={actId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#FB8500]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm ${isCompleted ? "text-green-600 line-through" : "text-[#1E293B]"}`}
                      >
                        {act.title}
                      </h4>
                      {act.reason && (
                        <p className="text-xs text-[#64748B] truncate">
                          {act.reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 text-xs text-[#64748B]">
                      ⏱ {act.estimatedMinutes} min
                    </div>
                    <DoneButton
                      done={isCompleted}
                      onClick={() => handleCompleteActivity(actId)}
                      label={act.title}
                    />
                  </div>
                </motion.div>
              );
            })}
            {aiPlan.nextBestAction && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700">
                  🎯 Siguiente mejor acción:{" "}
                  {aiPlan.nextBestAction.action?.replace(/_/g, " ")} —{" "}
                  {aiPlan.nextBestAction.label || aiPlan.nextBestAction.subject}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {todayActivities.map((activity, index) => {
              const isCompleted = completedActivities.includes(activity.id);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#FB8500]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`!m-0 font-semibold text-sm leading-snug ${isCompleted ? "text-green-600 line-through" : "text-[#1E293B]"}`}
                      >
                        {activity.name}
                      </h4>
                      <p className="!m-0 mt-0.5 text-xs text-[#64748B]">
                        ⏱ {activity.minutes} min · {activity.days}
                      </p>
                    </div>
                    <DoneButton
                      done={isCompleted}
                      onClick={() => handleCompleteActivity(activity.id)}
                      label={activity.name}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* AI Weekly Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
      >
        <h3 className="text-lg font-bold text-[#1E293B] mb-4">
          📆 Plan semanal — adaptado a tu desempeño
        </h3>
        {loadingPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : aiWeeklyPlan?.days?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {aiWeeklyPlan.days.map((dayPlan, idx) => (
              <motion.div
                key={dayPlan.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="p-3 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-white border border-[#E2E8F0]"
              >
                <div className="font-bold text-xs text-[#004B63] mb-1">
                  {dayPlan.day}
                </div>
                <div className="text-xs font-semibold text-[#1E293B] truncate">
                  {dayPlan.label}
                </div>
                <div
                  className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                    dayPlan.focus === "Refuerzo"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {dayPlan.focus}
                </div>
                <div className="text-xs text-[#64748B] mt-1">
                  {dayPlan.estimatedMinutes} min
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {dailyTips.map((item, index) => {
              const timeConfig = {
                Mañana: {
                  emoji: "🌅",
                  key: "kid.personalized_plan.time_morning",
                },
                Tarde: {
                  emoji: "☀️",
                  key: "kid.personalized_plan.time_afternoon",
                },
                Noche: { emoji: "🌙", key: "kid.personalized_plan.time_night" },
              };
              const cfg = timeConfig[item.time] || timeConfig.Mañana;
              return (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-white border border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{cfg.emoji}</span>
                    <span className="font-bold text-sm text-[#1E293B]">
                      {t(cfg.key)}
                    </span>
                  </div>
                  <p className="text-sm text-[#64748B]">{item.tip}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PersonalizedPlan;

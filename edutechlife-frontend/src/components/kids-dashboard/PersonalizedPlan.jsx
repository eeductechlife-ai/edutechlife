import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";
import { sanitize } from "../../utils/sanitize";

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

const PersonalizedPlan = () => {
  const { t } = useTranslation();
  const {
    vakResult,
    vakRecommendations,
    addPoints,
    planCompletedActivities: completedActivities,
    setPlanCompletedActivities: setCompletedActivities,
  } = useSmartBoardKids();
  const [showConfetti, setShowConfetti] = useState(false);

  const dominantStyle = vakResult?.predominantStyle || "visual";
  const scores = vakResult?.scores || {
    visual: 0,
    auditivo: 0,
    kinestesico: 0,
  };

  const dailyTips = DAILY_TIPS[dominantStyle] || [];
  const weeklyActivities = WEEKLY_ACTIVITIES[dominantStyle] || [];

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
          <div>
            <h3 className="text-xl font-black text-white drop-shadow-sm">
              Mi Plan
            </h3>
            <p className="text-xs text-white/80">
              Plan personalizado según tu estilo de aprendizaje{" "}
              {STYLE_EMOJIS[dominantStyle]} {STYLE_NAMES[dominantStyle]}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
            }}
          >
            📋
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1E293B]">
              {t("kid.personalized_plan.title")}
            </h2>
            <p className="text-sm text-[#64748B]">
              {t("kid.personalized_plan.subtitle")}{" "}
              <span className="font-bold text-[#FB8500]">
                {STYLE_EMOJIS[dominantStyle]}{" "}
                {t(
                  `kid.vak.style_${dominantStyle === "kinestesico" ? "kinesthetic" : dominantStyle}`,
                )}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(scores).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: `${STYLE_COLORS[key]}10` }}
            >
              <span className="text-2xl block mb-2">{STYLE_EMOJIS[key]}</span>
              <p
                className="text-2xl font-black"
                style={{ color: STYLE_COLORS[key] }}
              >
                {value}%
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {t(
                  `kid.vak.style_${key === "kinestesico" ? "kinesthetic" : key}`,
                )}
              </p>
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: STYLE_COLORS[key] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
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
                style={{ backgroundColor: `${STYLE_COLORS[dominantStyle]}20` }}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
      >
        <h3 className="text-lg font-bold text-[#1E293B] mb-4">
          {t("kid.personalized_plan.weekly_plan_title")}
        </h3>
        <div className="space-y-3">
          {weeklyActivities.map((activity, index) => {
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
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => handleCompleteActivity(activity.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-[#FB8500] text-[#FB8500] hover:bg-[#FB8500]/10"
                    }`}
                  >
                    {isCompleted ? "✓" : <span className="text-sm">+</span>}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-sm ${isCompleted ? "text-green-600 line-through" : "text-[#1E293B]"}`}
                    >
                      {activity.name}
                    </h4>
                    <p className="text-xs text-[#64748B]">{activity.days}</p>
                  </div>
                  {!isCompleted && (
                    <span className="text-xs font-bold text-[#FB8500]">
                      +25 pts
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]"
      >
        <h3 className="text-lg font-bold text-[#1E293B] mb-4">
          {t("kid.personalized_plan.daily_routine_title")}
        </h3>
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
      </motion.div>
    </div>
  );
};

export default PersonalizedPlan;
